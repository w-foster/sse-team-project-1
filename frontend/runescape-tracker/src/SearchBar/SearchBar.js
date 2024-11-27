import React, { useState } from 'react';
import AutocompleteIntroduction from './Search';
import './SearchBar.css';

export default function SearchBar({ className }) {
  const [selectedItem, setSelectedItem] = useState(null); // State to store the selected ID

  const handleOptionSelect = (item) => {
    setSelectedItem(item); // Update the state with the selected ID
  };

  return (
    <div className={`container ${className}`}>
      <div className="left">
        <p>RuneScape Price Tracker</p>
      </div>
      <div className="right">
        <AutocompleteIntroduction onOptionSelect={handleOptionSelect} />
        {selectedItem !== null && <p className="id">Item Name: {selectedItem.label}, Item ID: {selectedItem.id}</p>}
      </div>
    </div>
  );
}
