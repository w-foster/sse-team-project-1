import CompareItemsGrid from "../components/CompareItems/CompareItemsGrid"
import ChangeColumnButtons from "../components/CompareItems/ChangeColumnsButtons";
import ChangeTableButtons from "../components/CompareItems/ChangeTableButtons";
import { about } from "../utils/tailwindClasses";
import { useState, useEffect, useMemo } from 'react';
import EquipmentSetupCard from "../components/CompareItems/EquipmentSetupCard";
import clsx from 'clsx';


const url = process.env.NODE_ENV === "development"
? "http://127.0.0.1:5000"
: "https://runescape-tracker.impaas.uk";

const statCategories = {
    'Melee Offence': 'meleeOffence',
    'Ranged Offence': 'rangedOffence',
    'Magic Offence': 'magicOffence',
    'Defence': 'defence',
};

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

const slotTypes = {
    'Head': 'head',
    'Neck': 'neck',
    'Cape': 'cape',
    'Body': 'body',
    'Shield': 'shield',
    'Hands': 'hands',
    'Ring': 'ring',
    'Legs': 'legs',
    'Feet': 'feet',
    'Weapon': 'weapon',
    '2h': "2h",
    'Ammo': 'ammo',
};

const statIcons = {
    'stabAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/dagger.23b640d2.png',
    'slashAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/scimitar.9ddfeb9e.png',
    'crushAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/warhammer.bf1e6866.png',
    'magicAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/magic.ea5daf44.png',
    'rangedAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged.bee4115c.png',
    'stabDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/dagger.23b640d2.png',
    'slashDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/scimitar.9ddfeb9e.png',
    'crushDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/warhammer.bf1e6866.png',
    'magicDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/magic.ea5daf44.png',
    'rangedDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged.bee4115c.png',
    'strength': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/strength.588608dd.png',
    'rangedStrength': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged_strength.b19597e6.png',
    'magicDamage': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/magic_strength.3bfc40c9.png',
    'prayer': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/prayer.2f027df7.png',
  }
  
  
const permaColumns = [
{ field: 'icon', 
    headerName: 'Icon', 
    width: 60,
    editable: false, 
    sortable: false, 
    renderCell: (params) => (
    <div
        style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Ensures it fills the cell height
        width: '100%', // Ensures it fills the cell width
        }}
    >
        {params.value ? (
        <img
            src={params.value}
            alt="Icon"
            style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain', // Prevents distortion
            }}
            onError={(e) => {
            e.target.style.display = 'none'; // Hide the image if it fails to load
            }}
        />
        ) : (
        <span>?</span>
        )}
    </div>
    ),
},
{ field: 'name', headerName: 'Name', width: 250, editable: false },
buildStatColumn('stabAttack', 'Stab Attack'),
buildStatColumn('slashAttack', 'Slash Attack'),
buildStatColumn('crushAttack', 'Crush Attack'),
buildStatColumn('magicAttack', 'Magic Attack'),
buildStatColumn('rangedAttack', 'Ranged Attack'),
buildStatColumn('stabDefence', 'Stab Defence'),
buildStatColumn('slashDefence', 'Slash Defence'),
buildStatColumn('crushDefence', 'Crush Defence'),
buildStatColumn('magicDefence', 'Magic Defence'),
buildStatColumn('rangedDefence', 'Ranged Defence'),
buildStatColumn('strength', 'Strength'),
buildStatColumn('rangedStrength', 'Ranged Strength'),
buildStatColumn('magicDamage', 'Magic Damage'),
buildStatColumn('prayer', 'Prayer'),
{
    field: 'gp',
    headerName: 'GP',
    type: 'number',
    width: 90,
    editable: true,
    valueFormatter: (value) => {
    if (value == null) {
        return '-';
    }
    return getPriceString(value);
    },
},
];

const extraColumns = {
    'meleeOffence': [
      buildStatCostColumn('gpPerStabAttack', 'GP/Stab'),
      buildStatCostColumn('gpPerCrushAttack', 'GP/Crush'),
      buildStatCostColumn('gpPerSlashAttack', 'GP/Slash'),
      buildStatCostColumn('gpPerStrength', 'GP/Strength'),
    ],
    'rangedOffence': [
      buildStatCostColumn('gpPerRangedAttack', 'GP/Ranged'),
      buildStatCostColumn('gpPerRangedStrength', 'GP/Ranged Str'),
    ],
    'magicOffence': [
      buildStatCostColumn('gpPerMagicAttack', 'GP/Magic Attack'),
      buildStatCostColumn('gpPerMagicDamage', 'GP/Magic Damage'),
    ],
    'defence': [
      buildStatCostColumn('gpPerStabDefence', 'GP/Stab Def'),
      buildStatCostColumn('gpPerCrushDefence', 'GP/Crush Def'),
      buildStatCostColumn('gpPerSlashDefence', 'GP/Slash Def'),
      buildStatCostColumn('gpPerMagicDefence', 'GP/Magic Def'),
      buildStatCostColumn('gpPerRangedDefence', 'GP/Ranged Def'),
    ],
  };

function buildStatColumn(newField, newHeaderName) {
    return { 
      field: newField, 
      type: 'number', 
      width: 54, 
      editable: false,
      valueFormatter: (value) => {
        if (!value) return '-';
        let result = ''
        if (value > 0) {
          result += '+';
        }
        result += value;
        return result;
      },
      cellClassName: (params) =>
        clsx({
          'cell-negative': params.value < 0,
          'cell-positive': params.value > 0,
      }),
      renderHeader: () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={statIcons[newField]} // Dynamically fetch the icon
            alt={newHeaderName}
            style={{ objectFit: 'contain' }}
          />
        </div>
      ),
    };
}

function getPriceString(gp) {
    let price = ''
    if (gp <= 0) {
      price += '-'
    }
    else if (gp >= 1 && gp < 1000) {
      price += gp;
    } else if (gp >= 1000 && gp < 1000000) {
      price += (gp / 1000).toFixed(0) + 'k';
    } else if (gp >= 1000000 && gp < 1000000000) {
      price += (gp / 1000000).toFixed(1) + 'm';
    } else {
      price += (gp / 1000000000).toFixed(1) + 'b';
    }
    return price;
}
  
function gpPer(stat, gp) {
    if (!gp || !stat || stat <= 0) return null;
    return Math.round(gp / stat);
}
  
function buildStatCostColumn(newField, newHeaderName) {
    return {
        field: newField,
        headerName: newHeaderName,
        type: 'number',
        width: 90,
        editable: true,
        valueFormatter: (value) => {
        if (value == null) {
            return '-';
        }
        return getPriceString(value);
        },
    };
}




export default function CompareItemsPage({ darkMode }) {
    const [allSlotStats, setAllSlotStats] = useState([]);
    const [activeSlot, setActiveSlot] = useState("head");
    const [activeStatCategory, setActiveStatCategory] = useState("meleeOffence");

    const fetchAllSlotStats = async () => {
        const response = await fetch(`${url}/api/item-stats`, {
            method: 'GET',
        })
        const newAllSlotStats = await response.json();
        return removeDuplicatesFromHashMap(newAllSlotStats);
    };

    function removeDuplicatesFromHashMap(hashmap) {
        const uniqueItemsMap = {};
      
        Object.entries(hashmap).forEach(([slot, items]) => {
          const seenNames = new Map(); // Use Map to track duplicates based on name or wiki_name
      
          uniqueItemsMap[slot] = items.filter((item) => {
            const key = item.name || item.wiki_name; // Check both .name and .wiki_name
      
            if (!key) {
              // If neither name nor wiki_name exists, keep the item (or decide based on your needs)
              return true;
            }
      
            if (seenNames.has(key)) {
              const existingItem = seenNames.get(key);
      
              // Prioritize the item with has_price_data === true
              if (item.has_price_data && !existingItem.has_price_data) {
                seenNames.set(key, item);
                return true; // Replace the existing item
              }
      
              // Otherwise, discard the current item
              return false;
            }
      
            // If it's the first occurrence, add it to the seenNames map
            seenNames.set(key, item);
            return true;
          });
        });
      
        return uniqueItemsMap;
    }

    useEffect(() => {  
        async function fetchData() {
          const newAllSlotStats = await fetchAllSlotStats();
          setAllSlotStats(newAllSlotStats);
        }
        fetchData();
    }, []);

    function handleChangeSlot(slot) {
        setActiveSlot(slotTypes[slot]);
    }

    function handleChangeColumns(category) {
        setActiveStatCategory(statCategories[category]);
    }

    const idToItemInfo = useMemo(() => {
        return Object.fromEntries(
            Object.values(allSlotStats)
                .flat() // Flatten the lists into a single array
                .map((item) => [Number(item.id), item]) // Map each object to [id, object] pairs
        );
    }, [allSlotStats]);

    return (
        <div className={about}>
            <EquipmentSetupCard 
                darkMode={darkMode}
                allSlotStats={allSlotStats}
                idToItemInfo={idToItemInfo}
                permaColumns={permaColumns}
                extraColumns={extraColumns}
                gpPer={gpPer}
                columnCategories={statCategories}
                activeCategory={activeStatCategory}
                handleChangeColumns={handleChangeColumns}
            />
            <div style={{display: 'flex', justifyContent: 'center', paddingTop: '100px', fontSize: '38px'}}>
                <h1>ALL ITEMS</h1>
            </div>
            <div>
                <ChangeTableButtons 
                    slotTypes={slotTypes}
                    activeSlot={activeSlot}
                    handleChangeSlot={handleChangeSlot}
                />
            </div>
            <div>
                <ChangeColumnButtons 
                    columnCategories={statCategories}
                    activeCategory={activeStatCategory}
                    handleChangeColumns={handleChangeColumns}
                />
            </div>
            <CompareItemsGrid 
                darkMode={darkMode}
                allSlotStats={allSlotStats}
                activeSlot={activeSlot}
                activeStatCategory={activeStatCategory}
                permaColumns={permaColumns}
                extraColumns={extraColumns}
                gpPer={gpPer}
            />
        </div>
    )
}