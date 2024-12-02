import React from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompleteIntroduction from './Search';

export default function SearchBar({ className, itemList }) {
  const navigate = useNavigate();

  const handleOptionSelect = (itemId) => {
    if (itemId) {
        navigate(`/items/${itemId}`); // Redirect to the item-specific route
    }
};

  return (
      <div className={className}>
        <AutocompleteIntroduction 
          onOptionSelect={handleOptionSelect} 
          itemList={itemList}
        />
      </div>
  );
}

