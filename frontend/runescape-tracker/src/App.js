import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
// STANDARD COMPONENTS
import SearchBar from './components-new/SearchBar/SearchBar';
import TitleBar from "./components-new/SearchBar/TitleBar";
// PAGE COMPONENTS
import AboutPage from './pages-new/AboutPage';
import NormalPage from './pages-new/NormalPage';
import PerItemPage from './pages-new/PerItemPage';
import AllItemsPage from './pages-new/AllItemsPage';
// IMPORT ITEM LIST ONCE, PASSED DOWN AS PROP
import { itemList } from './ItemList';


function App() {
	const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://runescape-tracker.impaas.uk";
	const currentUserId = 420;

	// Create mapping {item ID: item name}, to be passed around as a prop
	const idToNameMap = React.useMemo(() => {
		const map = new Map();
		itemList.forEach((item) => {
			map.set(Number(item.id), item.name);
		});
		return map;
	}, []);


	// === STATE HOOKS ===
	const [favourites, setFavourites] = useState([]);


	// Flask API call helper functions
	async function fetchFavourites() {
		try {
			const response = await fetch(`${url}/api/favourites?user_id=${currentUserId}`, {
				method: 'GET'
			});
			const data = await response.json();
			setFavourites(data);  // assumes response is array of item_ids
		}
		catch (error) {
			console.error("Error fetching favourites:", error);
		}
	}

	// === Effect Hooks ===
	useEffect(() => {
		console.log('useEffect called, fetching favourites...');
		fetchFavourites();
	}, []);

	// === Handlers === 
	// Adds a favourite item (first to state, then to DB)
	const addFavourite = async (itemId) => {
	try {
		// 'Optimistic' update (faster for UI)
		setFavourites((prev) => [...prev, itemId]);
		// Update the DB after
		await fetch(`${url}/api/favourites`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({ user_id: currentUserId, item_id: itemId}),
		});
	} catch (error) {
		console.error('Error adding favourite:', error);
		// Rollback favourites in State if error adding to DB
		setFavourites((prev) => prev.filter((id) => id !== itemId));
	}
	};

	// Remove a favourite item
	const removeFavourite = async (itemId) => {
	try {
		// Optimistic update (faster for UI)
		setFavourites((prev) => prev.filter((id) => id !== itemId));
		// Update DB afterwards
		await fetch(`${url}/api/favourites/${itemId}?user_id=${currentUserId}`, {
		method: 'DELETE',
		});
	} catch (error) {
		console.error("Error removing favourite:", error);
		// Rollback State
		setFavourites((prev) => [...prev, itemId]);
	}
	};

	/**
	 * STRUCTURE: 
	 */
	return (
		<div className="App">

			<TitleBar className='search-bar'
				itemList={itemList}
			/>

			<Routes>
				<Route path="/" element={<Navigate to="/items" replace />} />
				<Route
					path="/about"
					element={<AboutPage />}	 
				/>
				<Route
					path="/items/*"
					element={
						<NormalPage
							itemList={itemList}
							favourites={favourites}
							removeFavourite={removeFavourite}
						/>
					}	 
				>
					<Route
						path=":itemId"
						element={
							<PerItemPage 
								itemList={itemList}
								idToNameMap={idToNameMap}
							/>
						}
					/>
					{/* default route for /items */}
					<Route
						index
						element={
							<AllItemsPage 
								itemList={itemList}
								favourites={favourites}
								addFavourite={addFavourite}
								removeFavourite={removeFavourite}	
							/>
						}
					/>
				</Route>
				
			</Routes>
		</div>
	);
}

export default App;