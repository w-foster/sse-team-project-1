import './App.css';
import BasicRating from './BasicRating';
import Dashboard from './Dashboard/Dashboard';
import SearchBar from './SearchBar/SearchBar';
import Sidebar from './SideBar/SideBar';


function App() {
  return (
    <div className="App">
      <SearchBar className="debug-searchbar"/>
      <Sidebar className="debug-sidebar"/>
      <Dashboard className="debug-dashboard"/>


      <p>Example of importing a MUI component:</p>
      <BasicRating/> 
    </div>
  );
}

export default App;
