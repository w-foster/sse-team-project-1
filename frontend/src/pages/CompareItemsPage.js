import CompareItemsGrid from "../components/CompareItems/CompareItemsGrid"
import ChangeColumnButtons from "../components/CompareItems/ChangeColumnsButtons";
import ChangeTableButtons from "../components/CompareItems/ChangeTableButtons";
import { about } from "../utils/tailwindClasses";
import { useState, useEffect } from 'react';

const url = process.env.NODE_ENV === "development"
? "http://127.0.0.1:5000"
: "https://runescape-tracker.impaas.uk";

const statCategories = {
    'Melee Offence': 'meleeOffence',
    'Ranged Offence': 'rangedOffence',
    'Magic Offence': 'magicOffence',
    'Defence': 'defence',
};

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

export default function CompareItemsPage({ darkMode }) {
    const [allSlotStats, setAllSlotStats] = useState([]);
    const [activeSlot, setActiveSlot] = useState("shield");
    const [activeStatCategory, setActiveStatCategory] = useState("meleeOffence");

    const fetchAllSlotStats = async () => {
        const response = await fetch(`${url}/api/item-stats`, {
            method: 'GET',
        })
        const newAllSlotStats = await response.json();
        return newAllSlotStats;
    };

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

    return (
        <div className={about}>
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
            />
        </div>
    )
}