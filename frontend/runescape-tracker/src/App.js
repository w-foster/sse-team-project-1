import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/home";
import About from "./pages/about";
import Graphing from "./pages/graphing";

import SearchBar from "./components/common/SearchBar/SearchBar";
import SideBar from "./components/common/SideBar/SideBar";

import "./App.css";

function App() {
  const navigate = useNavigate();  // Hook to handle navigation

  // State hooks for favourites and selectedItem
  const [favourites, setFavourites] = useState([]);
  
  const currentUserId = 420;  // Replace with actual user ID

  const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/react"
    : "https://runescape-tracker.impaas.uk/react";
  
  // Fetch favourites
  const fetchFavourites = async () => {
    try {
      const response = await fetch(`${url}/api/favourites?user_id=${currentUserId}`);
      const data = await response.json();
      setFavourites(data);  // Assumes response is an array of item_ids
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };

  useEffect(() => {
    fetchFavourites();  // Load favourites when app loads
  }, []);

  // Handle item selection from the SearchBar
  const handleItemSelect = (item) => {
    navigate(`/graphing?itemId=${item.id}&name=${item.name}`);
  };

  // Adds a favourite item (optimistic update)
  const addFavourite = async (itemId) => {
    try {
      setFavourites((prev) => [...prev, itemId]);
      await fetch(`${url}/api/favourites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, item_id: itemId }),
      });
    } catch (error) {
      console.error("Error adding favourite:", error);
      setFavourites((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Removes a favourite item
  const removeFavourite = async (itemId) => {
    try {
      setFavourites((prev) => prev.filter((id) => id !== itemId));
      await fetch(`${url}/api/favourites/${itemId}?user_id=${currentUserId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error removing favourite:", error);
      setFavourites((prev) => [...prev, itemId]);
    }
  };

  return (
    <div className="App">
      <SearchBar onItemSelect={handleItemSelect} className="debug-searchbar" />
      <SideBar
        className="debug-sidebar"
        favourites={favourites}
        addFavourite={addFavourite}
        removeFavourite={removeFavourite}
      />
      
      <Routes>
        <Route path="/react" element={<Home 
          favourites={favourites} 
          addFavourite={addFavourite} 
          removeFavourite={removeFavourite} 
        />} />
        <Route path="/about" element={<About />} />
        <Route path="/graphing" element={<Graphing 
          favourites={favourites} 
          addFavourite={addFavourite} 
          removeFavourite={removeFavourite} 
        />} />
      </Routes>
    </div>
  );
}

export default App;
