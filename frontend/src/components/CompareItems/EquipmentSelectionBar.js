import React from 'react';
import AutocompleteIntroduction from '../SearchBar/Search';

const usingWikiName = true;

export default function EquipmentSelectionBar({ itemList, handleSelectItem }) {

  return (
    <div>
      <AutocompleteIntroduction
        onOptionSelect={handleSelectItem}
        itemList={itemList}
        usingWikiName={usingWikiName}
      />
    </div>
  );
}