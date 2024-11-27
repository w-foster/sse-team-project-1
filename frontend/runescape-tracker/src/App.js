import React, { useState } from 'react';
import './App.css';
import BasicRating from './BasicRating';
import Dashboard from './Dashboard/Dashboard';
import SearchBar from './SearchBar/SearchBar';
import Sidebar from './SideBar/SideBar';


function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSelect = (item) => {
    setSelectedItem(item); // Update the App.js state with the selected item
  };

  return (
    <div className="App">
      <SearchBar onItemSelect={handleItemSelect} className="debug-searchbar"/>
      {selectedItem && (
        <p>
          Selected Item: {selectedItem.name}, ID: {selectedItem.id}
        </p>
      )}
      <Sidebar className="debug-sidebar"/>
      <Dashboard className="debug-dashboard"/>


      <p>Example of importing a MUI component:</p>
      <BasicRating/> 
    </div>
  );
}

export default App;
