import Dashboard from "../components/AllItemsComponents/Dashboard"

export default function AllItemsPage({ favourites, addFavourite, removeFavourite }) {
    return (
        <div class="fixed top-[8vh] left-[20vw] w-[calc(100vw-20vw)] h-[calc(100vh-8vh)] border-3 border-solid border-green-500 p-5 box-border overflow-y-auto z-0
        bg-primaryLightBackground dark:bg-primaryDarkBackground
        text-primaryLight dark:text-primaryDark">
            <Dashboard
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite} />
        </div>
    );

}