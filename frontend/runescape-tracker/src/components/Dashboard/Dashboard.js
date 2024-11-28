import ItemGrid from './ItemGrid'
import HotItemGrid from './HotItems';

export default function Dashboard({ className, favourites, addFavourite, removeFavourite }) {
    return (
        <div className={className}>
                <>
                <ItemGrid
                    favourites={favourites}
                    addFavourite={addFavourite}
                    removeFavourite={removeFavourite} 
                />
                {/* Hot Items List */}
                <div style={{ marginTop: '20px' }}>
                        <h2>Hot Items</h2>
                        <HotItemGrid />
                    </div>
                </>            
        </div>
    );
}