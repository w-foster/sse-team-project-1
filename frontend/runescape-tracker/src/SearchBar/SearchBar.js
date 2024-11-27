import React, { useState } from 'react';
import AutocompleteIntroduction from './Search';
import './SearchBar.css';

export default function SearchBar({ className }) {
  const [selectedId, setSelectedId] = useState(null); // State to store the selected ID

  const handleOptionSelect = (id) => {
    setSelectedId(id); // Update the state with the selected ID
  };

  return (
    <div className={`container ${className}`}>
      <div className="left">
        <p>RuneScape Price Tracker</p>
      </div>
      <div className="right">
        <AutocompleteIntroduction onOptionSelect={handleOptionSelect} />
        {selectedId !== null && <p className="id">Item ID: {selectedId}</p>}
      </div>
    </div>
  );
}
