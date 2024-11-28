import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/SideBar/SideBar';
import NavBar from '../components/common/SearchBar/NavBar';
import './styles/home.css';
import BasicLineChart from '../components/Dashboard/Graph';
import MovingTextBar from '../components/common/SearchBar/MovingTextBar'; // Adjust path as needed


function Graphing() {

  const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/react"
    : "https://runescape-tracker.impaas.uk/react";

  console.log("API Base URL:", url);

  const currentUserId = 420;  // For now, you can update this with actual user info

  // State hooks
  const [selectedItem, setSelectedItem] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [description, setDescription] = useState(""); // State for item description

  const navigate = useNavigate();

  // Fetch item details based on ID
  const fetchItemData = async (itemId) => {
    try {
      const response = await fetch(`${url}/api/items/${itemId}`);
      const data = await response.json();
      setSelectedItem(data); // Set the item details into state
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  // Flask API call helper functions
  async function fetchFavourites() {
    try {
      const response = await fetch(`${url}/api/favourites?user_id=${currentUserId}`, {
        method: 'GET'
      });
      const data = await response.json();
      setFavourites(data);  // assumes response is array of item_ids
    }
    catch (error) {
      console.error("Error fetching favourites:", error);
    }
  }

  // Extract itemId from query parameters using useLocation
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemIdFromQuery = queryParams.get('itemId'); // Get itemId from query string
  const nameFromQuery = queryParams.get('name'); // Get name from query string

  // === Effect Hooks ===
  useEffect(() => {
    console.log('useEffect called, fetching favourites...');
    fetchFavourites();

    if (itemIdFromQuery) {
      fetchItemData(itemIdFromQuery);  // Fetch the selected item data based on query parameter
    }
  }, [itemIdFromQuery]);  // Only run this effect when itemIdFromQuery changes

  // === Handlers ===
  // Adds a favourite item (first to state, then to DB)
  const addFavourite = async (itemId) => {
    try {
      // 'Optimistic' update (faster for UI)
      setFavourites((prev) => [...prev, itemId]);
      // Update the DB after
      await fetch(`${url}/api/favourites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ user_id: currentUserId, item_id: itemId}),
      });
    } catch (error) {
      console.error('Error adding favourite:', error);
      // Rollback favourites in State if error adding to DB
      setFavourites((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Remove a favourite item
  const removeFavourite = async (itemId) => {
    try {
      // Optimistic update (faster for UI)
      setFavourites((prev) => prev.filter((id) => id !== itemId));
      // Update DB afterwards
      await fetch(`${url}/api/favourites/${itemId}?user_id=${currentUserId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error("Error removing favourite:", error);
      // Rollback State
      setFavourites((prev) => [...prev, itemId]);
    }
  };

  //for the moving line bar
  const fetchItemDescription = async (itemId) => {
    try {
        const response = await fetch(`${url}/api/item-description/${itemId}`);
        if (!response.ok) throw new Error("Failed to fetch item description");
        const data = await response.json();
        return data.description;
    } catch (error) {
        console.error("Error fetching item description:", error);
        return null;
    }
};
useEffect(() => {
  if (itemIdFromQuery) {
      fetchItemDescription(itemIdFromQuery).then((description) => {
          if (description) {
              setDescription(description); // Update the state with the description
          }
      });
  }
}, [itemIdFromQuery]); // Trigger when itemIdFromQuery changes



  // Components to be rendered
  return (
    <div className="Home">
      <NavBar active="home" />
      <Sidebar 
        className="debug-sidebar"
        favourites={favourites}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite} />
      <div className="debug-main-content">
        {/* Pass the selectedItem ID or the whole selectedItem object to Dashboard */}
        <BasicLineChart 
            selectedItemID={itemIdFromQuery ? parseInt(itemIdFromQuery, 10) : 2}
            itemName={nameFromQuery ? nameFromQuery : 'Cannonball'}
        />
      </div>
      <MovingTextBar text={description} />
    </div>
  );
}

export default Graphing