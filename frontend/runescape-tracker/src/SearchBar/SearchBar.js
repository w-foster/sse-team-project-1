import AutocompleteIntroduction from './Search'

export default function SearchBar({ className }) {
    return (
        <div className={className}>
            <AutocompleteIntroduction />
            Search bar
        </div>
    );
}