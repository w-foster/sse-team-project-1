import React from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/home";
import About from "./pages/about";
import Graphing from "./pages/graphing";
import SearchBar from "./components/common/SearchBar/SearchBar";

import "./App.css";

function App() {
  const navigate = useNavigate();  // Hook to handle navigation

  const handleItemSelect = (item) => {
    // Navigate to graphing page with the selected item's ID (using query parameters)
    navigate(`/graphing?itemId=${item.id}&name=${item.name}`);
  };

  return (
    <div className="App">
      <SearchBar onItemSelect={handleItemSelect} className="debug-searchbar" />

      <Routes>
        <Route path="/react" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/graphing" element={<Graphing />} />
      </Routes>
    </div>
  );
}

export default App;
