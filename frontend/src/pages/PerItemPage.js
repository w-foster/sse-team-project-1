import { useParams } from 'react-router-dom';
import { useSessionInfo } from "../SessionInfoContext";
import Graph from '../components/PerItemComponents/Graph';
import MovingTextBar from '../components/PerItemComponents/MovingTextBar';
import { useEffect } from 'react';
import { mainGraphContainer } from '../utils/tailwindClasses';


export default function PerItemPage({ itemList, idToNameMap }) {
    const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://runescape-tracker.impaas.uk";

    const { userId } = useSessionInfo();
    const { itemId } = useParams();

    // Helper function for telling Flask that a user has viewed the page
	async function postItemView() {
		if (!userId) {
			console.log("User not logged in -- view not counted.");
			return null;
		}
        if (!itemId) {
			console.log("Item ID is missing in URL params.");
			return null;
		}
		try {
			await fetch(`${url}/api/itemview`, {
				method: 'POST',
                headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({ user_id: userId, item_id: itemId}),
			});
		}
		catch (error) {
			console.error(`Error sending item view info for item ${itemId}:`, error);
		}
	}

    useEffect(() => {
        postItemView();
    }, [userId, itemId]);
    
    return (
        <div class={mainGraphContainer}>
            <h2>{idToNameMap.get(Number(itemId))}</h2>
            <Graph itemId={itemId} itemList={itemList} />
            <MovingTextBar itemId={itemId} />
        </div>
    );
}