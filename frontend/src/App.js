import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
// STANDARD COMPONENTS

// PAGE COMPONENTS
import PageWithHeader from './pages/PageWithHeader';
import AboutPage from './pages/AboutPage';
import SignInPage from './pages/SignInPage';
import NewUserPage from './pages/NewUserPage';
import NormalPage from './pages/NormalPage';
import PerItemPage from './pages/PerItemPage';
import AllItemsPage from './pages/AllItemsPage';
import ItemViewsPage from "./pages/ItemViewsPage";
import Notfound from './pages/404';
// IMPORT ITEM LIST ONCE, PASSED DOWN AS PROP
import { itemList } from './ItemList';
import { SessionInfoProvider } from "./SessionInfoContext";
import { useSessionInfo } from "./SessionInfoContext";
import AlchemyPage from "./pages/AlchemyPage";


function App() {
	return (
		<SessionInfoProvider>
			<MainApp />
		</SessionInfoProvider>
	);
}


function MainApp() {
	const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://runescape-tracker.impaas.uk";

	const { userId } = useSessionInfo();
	console.log(`Current user ID: ${userId}`);

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
		if (!userId) {
			console.log("Could not fetch faves -- user is null");
			return null; // idk
		}
		try {
			const response = await fetch(`${url}/api/favourites?user_id=${userId}`, {
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
	}, [userId]);

	// === Handlers === 
	// Adds a favourite item (first to state, then to DB)
	const addFavourite = async (itemId) => {
		if (!userId) {
			console.log("Could not fetch faves -- user is null");
			return null; // idk
		}
		try {
			// 'Optimistic' update (faster for UI)
			setFavourites((prev) => [...prev, itemId]);
			// Update the DB after
			await fetch(`${url}/api/favourites`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({ user_id: userId, item_id: itemId}),
			});
		} catch (error) {
			console.error('Error adding favourite:', error);
			// Rollback favourites in State if error adding to DB
			setFavourites((prev) => prev.filter((id) => id !== itemId));
		}
	};

	// Remove a favourite item
	const removeFavourite = async (itemId) => {
		if (!userId) {
			console.log("Could not fetch faves -- user is null");
			return null; // idk
		}
		try {
			// Optimistic update (faster for UI)
			setFavourites((prev) => prev.filter((id) => id !== itemId));
			// Update DB afterwards
			await fetch(`${url}/api/favourites/${itemId}?user_id=${userId}`, {
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

			<Routes>
				{/* PAGES WITHOUT HEADER or TITLE BAR */}
				<Route path="/signin" element={<SignInPage />} />
				<Route path="/signup" element={<NewUserPage />} />

				{/* PAGES WITH HEADER -- NESTED ROUTES */}
				<Route path='/' element={
						<PageWithHeader 
							itemList={itemList} 
							favourites={favourites} 
							addFavourite={addFavourite} 
							removeFavourite={removeFavourite} 
						/>
					} 
				>
					<Route index element={<Navigate to="/items" replace />} />
					<Route path="/about" element={<AboutPage />} />
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
						<Route
							path="popular"
							element={
								<ItemViewsPage
									idToNameMap={idToNameMap}
								/>
							}
						/>
						<Route
							path="alchemy"
							element={
								<AlchemyPage
									favourites={favourites}
									addFavourite={addFavourite}
									removeFavourite={removeFavourite}  
									idToNameMap={idToNameMap}
								/>
							}
						/>
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
				</Route>
				
				{/* Fallback for undefined routes */}
				<Route path="*" element={<Notfound />} />
			</Routes>
		</div>
		
	);
}

export default App;