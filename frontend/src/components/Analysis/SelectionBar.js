import React from 'react';
import { useNavigate } from 'react-router-dom';
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