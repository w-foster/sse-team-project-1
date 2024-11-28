import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/common/SearchBar/NavBar'; // NavBar should still be here
import './styles/home.css';
import BasicLineChart from '../components/Dashboard/Graph';
import MovingTextBar from '../components/common/SearchBar/MovingTextBar';

function Graphing({ favourites, addFavourite, removeFavourite }) {

  const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/react"
    : "https://runescape-tracker.impaas.uk/react";

  console.log("API Base URL:", url);

  const currentUserId = 420;  // For now, you can update this with actual user info

  // State hooks
  const [selectedItem, setSelectedItem] = useState(null);
  const [description, setDescription] = useState(""); // State for item description

  // Extract itemId from query parameters using useLocation
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemIdFromQuery = queryParams.get('itemId'); // Get itemId from query string
  const nameFromQuery = queryParams.get('name'); // Get name from query string

  // === Fetch Item Details Based on ID ===
  const fetchItemData = async (itemId) => {
    try {
      const response = await fetch(`${url}/api/items/${itemId}`);
      const data = await response.json();
      setSelectedItem(data); // Set the item details into state
    } catch (error) {
      console.error("Error fetching item:", error);
    }
  };

  // === Fetch Item Description ===
  const fetchItemDescription = async (itemId) => {
    try {
      const response = await fetch(`${url}/api/item-description/${itemId}`);
      if (!response.ok) throw new Error("Failed to fetch item description");
      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error("Error fetching item description:", error);
    }
  };

  // === Effect Hooks ===
  useEffect(() => {
    if (itemIdFromQuery) {
      fetchItemData(itemIdFromQuery);  // Fetch the selected item data based on query parameter
      fetchItemDescription(itemIdFromQuery);  // Fetch item description
    }
  }, [itemIdFromQuery]);  // Trigger when itemIdFromQuery changes

  return (
    <>
      <NavBar active="home" />
      {/* No Sidebar here, as it's handled by App.js */}
      <div className="debug-main-content">
        <BasicLineChart
          selectedItemID={itemIdFromQuery ? parseInt(itemIdFromQuery, 10) : 2}
          itemName={nameFromQuery || 'Cannonball'}
        />
      </div>
      <MovingTextBar text={description} />
    </>
  );
}

export default Graphing;