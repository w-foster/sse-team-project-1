import ItemGrid from './ItemGrid';
import HotItemGrid from './HotItems';

export default function Dashboard({ favourites, addFavourite, removeFavourite }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '100%' }}
        class="bg-primaryLightBackground dark:bg-primaryDarkBackground
        fixed top-[8vh] left-[20vw] w-[calc(100vw-20vw)] h-[calc(100vh-8vh)] border-3 border-solid border-green-500 p-5 box-border overflow-y-auto z-0">
            <div className="text-slate-900 dark:text-white">
                <h2>All Items</h2>
                <div class="bg-primaryLightBackground dark:bg-secondaryDarkBackground">
                    <ItemGrid
                        favourites={favourites}
                        addFavourite={addFavourite}
                        removeFavourite={removeFavourite} 
                    />
                </div>
                {/* Hot Items List */}
                <div style={{ marginTop: '20px', marginBottom: '100px'}}>
                    <h2>Hot Items!</h2>
                    <div >
                        <HotItemGrid />
                    </div>
                </div>
            </div>
        </div>
    );
}