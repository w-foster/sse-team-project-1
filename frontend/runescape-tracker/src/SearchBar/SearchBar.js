import React from 'react';
import AutocompleteIntroduction from './Search';
import './SearchBar.css';

export default function SearchBar({ className, onItemSelect }) {
  const handleOptionSelect = (item) => {
    onItemSelect(item); // Pass the selected item to App.js via callback
  };

  return (
    <div className={`container ${className}`}>
      <div className="left">
        <p>RuneScape Price Tracker</p>
      </div>
      <div className="right">
        <AutocompleteIntroduction onOptionSelect={handleOptionSelect} />
      </div>
    </div>
  );
}
