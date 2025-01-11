import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./App.css";
import "./styles/tailwind.css";
import PageWithHeader from './pages/PageWithHeader';
import AboutPage from './pages/AboutPage';
import SignInPage from './pages/SignInPage';
import NewUserPage from './pages/NewUserPage';
import NormalPage from './pages/NormalPage';
import PerItemPage from './pages/PerItemPage';
import AllItemsPage from './pages/AllItemsPage';
import ItemViewsPage from "./pages/ItemViewsPage";
import Notfound from './pages/404';
import AlchemyPage from "./pages/AlchemyPage";
import { itemList } from './ItemList';
import { SessionInfoProvider } from "./SessionInfoContext";
import { useSessionInfo } from "./SessionInfoContext";
import ThemeSwitch from './ThemeSwitch'; // Import the ThemeSwitch component
import AnalysisPage from "./pages/AnalysisPage";
import { dark } from "@mui/material/styles/createPalette";
import CompareItemsPage from "./pages/CompareItemsPage";

function App() {
  return (
    <SessionInfoProvider>
      <div className="font-sans" style={{ scrollbarColor: '#6e6e6e #302F2E' }}>
        <MainApp /> 
      </div>
    </SessionInfoProvider>
  );
}

function MainApp() {
  const [darkMode, setDarkMode] = useState(true); // State to toggle theme

  // Sync theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setDarkMode(savedTheme ? savedTheme === 'dark' : prefersDarkMode);
  }, []);

  // Create the MUI theme based on darkMode state
  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "'Trebuchet MS', 'Roboto', 'Arial', sans-serif",
          fontSize: 16, // Base font size for the app
        },
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const toggleTheme = (newMode) => {
    setDarkMode(newMode);
  };

  useEffect(() => {
    // Sync both MUI theme and Tailwind CSS dark mode class
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const url = process.env.NODE_ENV === "development" 
    ? "http://127.0.0.1:5000" 
    : "https://runescape-tracker.impaas.uk";

  const { userId } = useSessionInfo();
  const idToNameMap = useMemo(() => {
    const map = new Map();
    itemList.forEach((item) => {
      map.set(Number(item.id), item.name);
    });
    return map;
  }, []);

  const [favourites, setFavourites] = useState([]);
  const fetchFavourites = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${url}/api/favourites?user_id=${userId}`);
      const data = await response.json();
      setFavourites(data);
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, [userId]);

  const addFavourite = async (itemId) => {
    if (!userId) return;
    try {
      setFavourites((prev) => [...prev, itemId]);
      await fetch(`${url}/api/favourites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, item_id: itemId }),
      });
    } catch (error) {
      console.error('Error adding favourite:', error);
      setFavourites((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const removeFavourite = async (itemId) => {
    if (!userId) return;
    try {
      setFavourites((prev) => prev.filter((id) => id !== itemId));
      await fetch(`${url}/api/favourites/${itemId}?user_id=${userId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error("Error removing favourite:", error);
      setFavourites((prev) => [...prev, itemId]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        {/* Pass toggleTheme function as a prop */}
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
          <Route path="/compare" element={<CompareItemsPage />} />
          {/* PAGES WITH FAVOURITES BAR -- NESTED ROUTES */}
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
							path="analysis"
							element={
								<AnalysisPage
                  darkMode={darkMode}
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
			
      <ThemeSwitch onThemeChange={toggleTheme} darkMode={darkMode} />

      </div>
    </ThemeProvider>
  );
}

export default App;
