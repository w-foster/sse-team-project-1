import Dashboard from "../components/AllItemsComponents/Dashboard"

export default function AllItemsPage({ favourites, addFavourite, removeFavourite }) {
    return (
        <div class="bg-white dark:bg-slate-800 fixed top-[10vh] left-[20vw] w-[calc(100vw-20vw)] h-[calc(100vh-10vh)] border-3 border-solid border-green-500 p-5 box-border overflow-y-auto z-0">
            <Dashboard
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite} />
        </div>
    );

}