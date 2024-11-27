import ItemGrid from './ItemGrid'

export default function Dashboard({ className, favourites, addFavourite, removeFavourite }) {
    return (
        <div className={className}>
            Dashboard
            <ItemGrid 
                addFavourite={addFavourite} 
                removeFavourite={removeFavourite}
                favourites={favourites} />
        </div>
    );
}