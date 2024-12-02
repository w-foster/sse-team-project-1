import ItemGrid from './ItemGrid';
import HotItemGrid from './HotItems';

export default function Dashboard({ favourites, addFavourite, removeFavourite }) {
    return (
        <div className="debug-main-content" style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '100%' }}>
            <h2>All Items</h2>
            <ItemGrid
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite} 
            />
            
            {/* Hot Items List */}
            <div style={{ marginTop: '20px', marginBottom: '100px'}}>
                <h2>Hot Items!</h2>
                <HotItemGrid />
            </div>
        </div>
    );
}