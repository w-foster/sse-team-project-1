import ItemGrid from './ItemGrid'
import BasicLineChart from './Graph'

export default function Dashboard({ className, favourites, addFavourite, removeFavourite }) {
    return (
        <div className={className}>
            Dashboard
            <ItemGrid
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite} />
        </div>
    );
}