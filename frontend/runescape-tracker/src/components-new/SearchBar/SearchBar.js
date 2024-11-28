import React from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompleteIntroduction from './Search';
import './styles/SearchBar.css';

export default function SearchBar({ className, itemList }) {
  const navigate = useNavigate();

  const handleOptionSelect = (itemId) => {
    if (itemId) {
        navigate(`/items/${itemId}`); // Redirect to the item-specific route
    }
};

  return (
    <div className={`container ${className}`}>
      <div className="left">
        <p>RuneScape Price Tracker</p>
      </div>
      <div className="right">
        <AutocompleteIntroduction 
          onOptionSelect={handleOptionSelect} 
          itemList={itemList}
        />
      </div>
    </div>
  );
}

