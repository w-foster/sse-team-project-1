import ItemGrid from './ItemGrid'
import BasicLineChart from './Graph'
import HotItemGrid from './HotItems';

export default function Dashboard({ className, selectedItemID, itemName, favourites, addFavourite, removeFavourite }) {
    return (
        <div className={className}>
            
            {selectedItemID < 0 ? (
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

            ) : (
                <BasicLineChart 
                    selectedItemID={selectedItemID} 
                    itemName={itemName} 
                />
            )}
            
        </div>
    );
}