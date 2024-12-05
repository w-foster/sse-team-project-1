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
    <div
      className={className}
      style={{
        width: '100%',  // Ensures it takes up the full width of the container (30vw)
        height: '100%', // Ensures the height adapts to the parent container
        display: 'flex',
        justifyContent: 'flex-start', // Aligns the content to the left
        alignItems: 'stretch', // Makes the container take the full height of the parent
        padding: 0, // Optional: Add some padding for responsiveness
      }}
    >
      <AutocompleteIntroduction
        onOptionSelect={handleOptionSelect}
        itemList={itemList}
      />
    </div>
  );
}