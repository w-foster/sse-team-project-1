import './App.css';
import BasicRating from './BasicRating';
import Dashboard from './Dashboard';
import SearchBar from './SearchBar';
import Sidebar from './Sidebar';


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
