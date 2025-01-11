import CompareItemsGrid from "../components/CompareItems/CompareItemsGrid"
import { about } from "../utils/tailwindClasses";
import { useState, useEffect } from 'react';

const url = process.env.NODE_ENV === "development"
? "http://127.0.0.1:5000"
: "https://runescape-tracker.impaas.uk";


export default function CompareItemsPage() {
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
          setAllSlotStats(newAllSlotStats); // <-- Now `allSlotStats` is the actual data, not a Promise
        }
        fetchData();
      }, []);


    return (
        <div className={about}>
            <CompareItemsGrid 
                allSlotStats={allSlotStats}
                activeSlot={activeSlot}
                activeStatCategory={activeStatCategory}
            />
        </div>
    )
}