import EquipmentSetupButtons from "./EquipmentSetupButtons";
import { useState } from 'react';
import SelectedSetupList from "./SelectedSetupList";
import ChangeColumnButtons from "./ChangeColumnsButtons";
import EquipmentSelectionBar from "./EquipmentSelectionBar";
import { EditRounded } from "@mui/icons-material";


const maxSetups = 5;

function buildSetupTemplate() {
    return {
        'head': null,
        'neck': null,
        'cape': null,
        'body': null,
        'shield': null,
        'hands': null,
        'ring': null,
        'legs': null,
        'feet': null,
        'weapon': null,
        '2h': null,
        'ammo': null
    };
}

export default function EquipmentSetupCard({ 
    darkMode, allSlotStats, idToItemInfo, permaColumns, extraColumns, gpPer, columnCategories
}) {
    const [activeEquipmentSetup, setActiveEquipmentSetup] = useState(0);
    const [setups, setSetups] = useState(
        Array.from({length: maxSetups}, (_, index) => (
            buildSetupTemplate()
        ))
    );
    const [activeCategory, setActiveStatCategory] = useState('meleeOffence');

    function handleChangeColumns(category) {
        setActiveStatCategory(columnCategories[category]);
    }

    function handleChangeEquipmentSetup(newSetup) {
        setActiveEquipmentSetup(newSetup);
    }

    function handleSelectItem(itemId) {
        setSetups((prev) =>
          prev.map((setup, index) => {
            const item = idToItemInfo[Number(itemId)];
            if (!item) {
              console.error(`Item with ID ${itemId} not found.`);
              return setup; // Return the unchanged setup if item not found
            }
            if (index === activeEquipmentSetup) {
              // Use dynamic key with [item.equipment.slot]
              return { ...setup, [item.equipment.slot]: item };
            }
            return setup; // Return the unchanged setup for other indices
          })
        );
        console.log(setups);
    }
      

    return (
        <div>
            <EquipmentSetupButtons
                activeEquipmentSetup={activeEquipmentSetup}
                maxSetups={maxSetups}
                handleChangeEquipmentSetup={handleChangeEquipmentSetup}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <EquipmentSelectionBar
                    itemList={allSlotStats}
                    handleSelectItem={handleSelectItem}
                />
            </div>
            <ChangeColumnButtons 
                columnCategories={columnCategories}
                activeCategory={activeCategory}
                handleChangeColumns={handleChangeColumns}
            />
            <SelectedSetupList 
                darkMode={darkMode}
                setups={setups}
                activeEquipmentSetup={activeEquipmentSetup}
                permaColumns={permaColumns}
                extraColumns={extraColumns}
                activeCategory={activeCategory}
                gpPer={gpPer}
            />
        </div>
    );
}