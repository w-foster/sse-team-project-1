import Dashboard from "../components-new/AllItemsComponents/Dashboard"

export default function AllItemsPage({ favourites, addFavourite, removeFavourite }) {
    return (
        <div className="debug-main-content">
        <Dashboard
            favourites={favourites}
            addFavourite={addFavourite}
            removeFavourite={removeFavourite} />
      </div>
    );

}