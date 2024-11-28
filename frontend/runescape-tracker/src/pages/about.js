import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar/SearchBar';
import './styles/about.css'

function About() {
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();  // Hook to handle navigation

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    // Navigate to home with the selected item's ID (for example, using query parameters)
    navigate(`/graphing?itemId=${item.id}`);
  };

  return (
    <div>
      <SearchBar className="debug-searchbar" onItemSelect={handleItemSelect} page="about" />
      <h1>About Page</h1>
    </div>
  );
}

export default About;