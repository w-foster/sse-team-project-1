import EquipmentSetupButtons from "./EquipmentSetupButtons";
import { useState } from 'react';
import SelectedSetupList from "./SelectedSetupList";
import ChangeColumnButtons from "./ChangeColumnsButtons";
import EquipmentSelectionBar from "./EquipmentSelectionBar";
import { EditRounded } from "@mui/icons-material";
import UpgradesList from "./UpgradesList";
import StatToUpgradeButtons from "./StatToUpgradeButtons";


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

const statTypes = [
    "attack_stab",
    "attack_slash",
    "attack_crush",
    "attack_magic",
    "attack_ranged",
    "defence_stab",
    "defence_slash",
    "defence_crush",
    "defence_magic",
    "defence_ranged",
    "melee_strength",
    "ranged_strength",
    "magic_damage",
    "prayer",
]

const statIcons = {
    "attack_stab": "https://tools.runescape.wiki/osrs-dps/_next/static/media/dagger.23b640d2.png",
    "attack_slash": "https://tools.runescape.wiki/osrs-dps/_next/static/media/scimitar.9ddfeb9e.png",
    "attack_crush": "https://tools.runescape.wiki/osrs-dps/_next/static/media/warhammer.bf1e6866.png",
    "attack_magic": "https://tools.runescape.wiki/osrs-dps/_next/static/media/magic.ea5daf44.png",
    "attack_ranged": "https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged.bee4115c.png",
    "defence_stab": "https://tools.runescape.wiki/osrs-dps/_next/static/media/dagger.23b640d2.png",
    "defence_slash": "https://tools.runescape.wiki/osrs-dps/_next/static/media/scimitar.9ddfeb9e.png",
    "defence_crush": "https://tools.runescape.wiki/osrs-dps/_next/static/media/warhammer.bf1e6866.png",
    "defence_magic": "https://tools.runescape.wiki/osrs-dps/_next/static/media/magic.ea5daf44.png",
    "defence_ranged": "https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged.bee4115c.png",
    "melee_strength": "https://tools.runescape.wiki/osrs-dps/_next/static/media/strength.588608dd.png",
    "ranged_strength": "https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged_strength.b19597e6.png",
    "magic_damage": "https://tools.runescape.wiki/osrs-dps/_next/static/media/magic_strength.3bfc40c9.png",
    "prayer": "https://tools.runescape.wiki/osrs-dps/_next/static/media/prayer.2f027df7.png",
};


export default function EquipmentSetupCard({ 
    darkMode, allSlotStats, idToItemInfo, permaColumns, extraColumns, gpPer, columnCategories,
}) {
    const [activeEquipmentSetup, setActiveEquipmentSetup] = useState(0);
    const [setups, setSetups] = useState(
        Array.from({length: maxSetups}, (_, index) => (
            buildSetupTemplate()
        ))
    );
    const [activeCategory, setActiveStatCategory] = useState('meleeOffence');
    const [statToUpgrade, setStatToUpgrade] = useState('melee_strength');

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

    function handleChangeStatToUpgrade(statType) {
        setStatToUpgrade(statType);
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
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '16px', paddingTop: '54px', paddingBottom: '10px' }}>
                <h1 style={{ fontSize: '28px' }}>UPGRADES</h1>
                <p>Items that for the target stat are (a) greater than zero, and either (b1) better than the item equipped in their slot, OR (b2) equal to that item, but better in some other stat.</p>
                <p><em>NOTE: the values represent the <u>DIFFERENCE</u> between the item and the item equipped in its slot, for that stat. The 'GP per' stats thus represent the cost of upgrading to the given item.</em></p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '18px', paddingTop: '10px', paddingBottom: '10px' }}>
                <p><strong>Choose a stat to upgrade:</strong></p>
                <StatToUpgradeButtons 
                    statToUpgrade={statToUpgrade}
                    statIcons={statIcons}
                    handleChangeStatToUpgrade={handleChangeStatToUpgrade}
                />
            </div>
            <UpgradesList 
                darkMode={darkMode} 
                allSlotStats={allSlotStats}
                activeStatCategory={activeCategory} 
                permaColumns={permaColumns} 
                gpPer={gpPer} 
                extraColumns={extraColumns}
                setups={setups} 
                activeEquipmentSetup={activeEquipmentSetup}
                statTypes={statTypes}
                statToUpgrade={statToUpgrade}
            />
        </div>
    );
}