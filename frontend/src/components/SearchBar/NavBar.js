import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function NavBar({ className }) {

  const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://runescape-tracker.impaas.uk";

  const location = useLocation(); // GET THE CURRENT URL (ROUTE)
  const [randomItem, setRandomItem] = useState(null); // State to store random item data (id and name)

  // Function to fetch the random item from the backend
  const fetchRandomItemId = async () => {
    try {
      const response = await fetch(`${url}/api/getRandomId`); // Fetch the random item ID from Flask backend
      const data = await response.json();  // Parse the JSON response
      setRandomItem(data);  // Store the response data (id and name) in the state
    } catch (err) {
      console.error('Error fetching random item:', err);
    }
  };

  // Run fetch when component mounts or when the "Curious?" button is clicked
  useEffect(() => {
    if (randomItem === null) {
      fetchRandomItemId();  // Fetch random item if on initial load
    }
  }, [randomItem]);  // Dependency array makes sure to run when `randomItem` changes

  // Function to handle clicking on the Curious? button
  const handleCuriousClick = () => {
    setRandomItem(null); // Reset the random item (so the fetch function will run)
  };

  // If randomItem is null, display loading message or spinner
  if (!randomItem) {
    return <div className="text-slate-900 dark:text-white">Loading...</div>; // Or replace with a spinner/loading indicator
  }

  // Define your nav items with the dynamic random item ID
  const navItems = [
    { label: 'Dashboard', path: '/items' },
    { label: 'About', path: '/about' },
    { label: 'Popular', path: '/items/popular' },
    { label: 'Alchemy', path: '/items/alchemy' },
    { label: 'Analysis', path: '/items/analysis' },
    { label: 'Curious?', path: `/items/${randomItem.id}`, onClick: handleCuriousClick }, // Handle click to toggle fetch
  ];

  return (
    <div className={className} style={{ width: '50vw', display: 'flex', justifyContent: 'flex-start' }}>
      <div className="m-0 flex justify-center items-center" style={{ width: '100%' }}>
        <Stack
          direction='row'
          spacing={2}
          className="m-0 p-0"
          sx={{
            width: '100%',
            gap: '0.25vw', // You can adjust this based on how much spacing you want between buttons
          }}
        >
          {navItems.map((button) => (
            <Button
              key={button.path}
              variant={(location.pathname === button.path && button.label !== 'Curious?') ? 'disabled' : 'outlined'}  // Disable button for current page
              component={Link}
              to={button.path}
              onClick={button.onClick} // Add the onClick event to the Curious? button
              sx={{
                fontSize: '1.25vw', // Adjust font size to be responsive to the viewport
                padding: '0.4vh 0.8vw', // Padding based on vh and vw for scaling
                minWidth: '3vw',  // Minimum button width
                borderWidth: '0.1vw', // Border width based on viewport width
              }}
            >
              {button.label}
            </Button>
          ))}
        </Stack>
      </div>
    </div>
  );
}
