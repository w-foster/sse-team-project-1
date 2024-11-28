import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import SearchBar from '../components/common/SearchBar/SearchBar';
import Sidebar from '../components/common/SideBar/SideBar';
import './styles/home.css';

function Home() {

  const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/react"
    : "https://runescape-tracker.impaas.uk/react";

  console.log("API Base URL:", url);

  const currentUserId = 420;  // For now, you can update this with actual user info

  // State hooks
  const [selectedItem, setSelectedItem] = useState(null);
  const [favourites, setFavourites] = useState([]);
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

  // === Effect Hooks ===
  useEffect(() => {
    console.log('useEffect called, fetching favourites...');
    fetchFavourites();
  }, []);  // Only run this effect when itemIdFromQuery changes

  // === Handlers ===
  // Handler for item selection via search bar
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    // Navigate to home and pass the selected itemId via query parameters
    navigate(`/graphing?itemId=${item.id}`);
  };

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

  // Components to be rendered
  return (
    <div className="Home">
      <SearchBar onItemSelect={handleItemSelect} page='home' className="debug-searchbar"/>
      <Sidebar 
        className="debug-sidebar"
        favourites={favourites}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite} />
      <div className="debug-main-content">
        {/* Pass the selectedItem ID or the whole selectedItem object to Dashboard */}
        <Dashboard
          selectedItemID={selectedItem ? parseInt(selectedItem.id, 10) : -1}
          itemName={selectedItem ? selectedItem.name : ''}
          favourites={favourites}
          addFavourite={addFavourite}
          removeFavourite={removeFavourite} />
      </div>
    </div>
  );
}

export default Home;
