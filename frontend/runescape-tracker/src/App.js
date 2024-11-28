import React, { useState, useEffect } from 'react';
import './App.css';
import BasicRating from './BasicRating';
import Dashboard from './Dashboard/Dashboard';
import SearchBar from './SearchBar/SearchBar';
import Sidebar from './SideBar/SideBar';


function App() {

  const url = process.env.NODE_ENV === "development"
  ? "http://127.0.0.1:5000/react"
  : "https://runescape-tracker.impaas.uk/react";
  //const url = "http://127.0.0.1:5000/react"
  console.log("API Base URL:", url);

  const currentUserId = 420;  // for now
  // State hooks
  const [selectedItem, setSelectedItem] = useState(null);
  const [favourites, setFavourites] = useState([]);

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
  // Fetch favourites once upon rendering App
  useEffect(() => {
    console.log('useEffect called, fetching favourites...')
    fetchFavourites();
  }, []);

  // === Handlers ===
  // Handler for item selection via search bar
  const handleItemSelect = (item) => {
    setSelectedItem(item); // Update the App.js state with the selected item
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
  }


  // Components to be rendered
  return (
    <div className="App">
      <SearchBar onItemSelect={handleItemSelect} className="debug-searchbar"/>
      <Sidebar 
        className="debug-sidebar"
        favourites={favourites}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite} />
      <div className="debug-main-content">
        <Dashboard
          selectedItemID={selectedItem ? parseInt(selectedItem.id, 10) : 2}
          itemName={selectedItem ? selectedItem.name : 'Cannonball'}
          favourites={favourites}
          addFavourite={addFavourite}
          removeFavourite={removeFavourite} />


        <p>Example of importing a MUI component:</p>
        <BasicRating/> 
      </div>
    </div>
  );
}

export default App;
