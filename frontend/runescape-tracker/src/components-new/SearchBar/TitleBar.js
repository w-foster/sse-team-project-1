import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import TitleAndLogo from './TitleAndLogo';
import './styles/TitleBar.css';

export default function TitleBar() {

    return (
        <div className="container">
            <TitleAndLogo className="left" />
            <NavBar className="center" />
            <SearchBar className="right" />
        </div>
    );
}
