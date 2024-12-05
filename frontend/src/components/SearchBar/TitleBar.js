import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import TitleAndLogo from './TitleAndLogo';

export default function TitleBar() {
    return (
        <div
            className="fixed mx-auto flex justify-between items-center p-2.5 w-full"
            style={{
                backgroundColor: 'var(--accentLightBackground)', // Apply background color using CSS variable
                color: 'var(--primaryLight)', // Apply text color using CSS variable
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center', // Center the items vertically
                width: '100vw',  // Full viewport width
                height: '10vh',  // Set height to 10% of the viewport height
                gap: '1vw'  // Set the gap between the child elements to 1vw
            }}
        >
            {/* Title and Logo (takes up 20% of the viewport width) */}
            <div style={{ flex: '0 0 20vw', display: 'flex', justifyContent: 'center' }}>
                <TitleAndLogo />
            </div>

            {/* NavBar (takes the remaining space) */}
            <div style={{ flex: '1 0 50vw', display: 'flex', justifyContent: 'center' }}>
                <NavBar />
            </div>

            {/* SearchBar (takes up 30% of the viewport width) */}
            <div style={{ flex: '0 0 30vw', display: 'flex', justifyContent: 'flex-start' }}>
                <SearchBar />
            </div>
        </div>
    );
}
