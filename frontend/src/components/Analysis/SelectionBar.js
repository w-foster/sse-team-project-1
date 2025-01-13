import React from 'react';
import AutocompleteIntroduction from '../SearchBar/Search';

export default function SearchBar({ itemList, handleOptionSelect }) {

  return (
    <div>
      <AutocompleteIntroduction
        onOptionSelect={handleOptionSelect}
        itemList={itemList}
      />
    </div>
  );
}