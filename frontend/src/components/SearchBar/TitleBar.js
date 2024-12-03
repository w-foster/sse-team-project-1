import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import TitleAndLogo from './TitleAndLogo';

export default function TitleBar() {

    return (
        <div className="fixed mx-auto flex justify-center items-start p-2.5 gap-5 w-full">
            <TitleAndLogo className="flex-1 flex items-center pl-5" />
            <NavBar className="flex-none flex flex-col items-center text-center" />
            <SearchBar className="flex flex-col items-end pr-5" />
        </div>
    );
}
