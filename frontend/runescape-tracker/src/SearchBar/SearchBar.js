import React, { useState } from 'react';
import AutocompleteIntroduction from './Search';

export default function SearchBar({ className }) {
  const [selectedId, setSelectedId] = useState(null); // State to store the selected ID

  const handleOptionSelect = (id) => {
    setSelectedId(id); // Update the state with the selected ID
  };

  return (
    <div className={className}>
        <p>Search bar</p>
        <AutocompleteIntroduction onOptionSelect={handleOptionSelect} />
        {selectedId !== null && <p>Item ID: {selectedId}</p>} {/* Display the ID */}
    </div>
  );
}