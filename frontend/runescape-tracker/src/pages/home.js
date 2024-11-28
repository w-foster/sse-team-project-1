import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import NavBar from '../components/common/SearchBar/NavBar';
import './styles/home.css';

function Home({ favourites, addFavourite, removeFavourite }) {
  const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/react"
    : "https://runescape-tracker.impaas.uk/react";

  console.log("API Base URL:", url);

  const currentUserId = 420;  // For now, you can update this with actual user info

  // State hooks
  const [selectedItem, setSelectedItem] = useState(null);
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

  // === Handlers ===
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    // Navigate to home and pass the selected itemId via query parameters
    navigate(`/graphing?itemId=${item.id}`);
  };

  return (
    <>
      <NavBar active="home" />
      <div className="debug-main-content">
        {/* Pass the selectedItem ID or the whole selectedItem object to Dashboard */}
        <Dashboard
          favourites={favourites}
          addFavourite={addFavourite}
          removeFavourite={removeFavourite} />
      </div>
    </>
  );
}

export default Home;
