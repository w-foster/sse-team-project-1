import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import TitleAndLogo from './TitleAndLogo';

export default function TitleBar() {

    return (
        <div className="fixed mx-auto flex justify-between items-center gap-12 p-2.5 w-full
        bg-primaryLightBackground dark:bg-primaryDarkBackground
        text-primaryLight dark:text-primaryDark">
        
            <div className="flex flex-1 items-center pl-5 mr-[50px]">
                <TitleAndLogo />
            </div>
            <div className="flex-none flex flex-col items-center text-center">
                <NavBar />
            </div>
            <div className="flex flex-1 justify-end gap-12 pr-5">
                <SearchBar />
                
                <div className="flex mt-2"></div>

            </div>
        </div>
    );
}
