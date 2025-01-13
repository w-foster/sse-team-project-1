import React from 'react';
import AutocompleteIntroduction from '../SearchBar/Search';


export default function EquipmentSelectionBar({ allSlotStats, handleSelectItem }) {

    const itemList = Array.from(
        new Map(
            Object.values(allSlotStats)
            .flat()
            .map((item) => [item.id, item]) // Use `id` as the unique key
        ).values()
    ).sort();

  return (
    <div>
      <AutocompleteIntroduction
        onOptionSelect={handleSelectItem}
        itemList={itemList}
        useWikiName={true}
      />
    </div>
  );
}