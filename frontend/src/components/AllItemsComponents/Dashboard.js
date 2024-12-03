import ItemGrid from './ItemGrid';
import HotItemGrid from './HotItems';
import MarketIndexChart from './MarketIndex';

export default function Dashboard({ favourites, addFavourite, removeFavourite }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '100%' }}
            className="bg-primaryLightBackground dark:bg-primaryDarkBackground
            fixed top-[8vh] left-[20vw] w-[calc(100vw-20vw)] h-[calc(100vh-8vh)] p-5 box-border overflow-y-auto z-0
            text-slate-900 dark:text-white
            border-solid border-t border-neutral-700">
            
            {/* Top row: Market Index Chart (left) and Hot Items (right) */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '15px' }}>
                <div style={{ flex: 3 }}
                    className="bg-primaryLightBackground dark:bg-secondaryDarkBackground border border-neutral-700">
                    <MarketIndexChart />
                </div>

                <div style={{ flex: 1,
                             display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'space-between', paddingTop: '30px'}}
                    className="bg-primaryLightBackground dark:bg-secondaryDarkBackground border border-neutral-700">
                    <h2 style={{ display: 'flex', justifyContent: 'center' }}>Hot Items!</h2>
                    <HotItemGrid />
                </div>
            </div>

            {/* Below the top row: All Items */}
            <h2>All Items</h2>
            <div className="bg-primaryLightBackground dark:bg-secondaryDarkBackground">
                <ItemGrid
                    favourites={favourites}
                    addFavourite={addFavourite}
                    removeFavourite={removeFavourite} 
                />
            </div>
        </div>
    );
}
