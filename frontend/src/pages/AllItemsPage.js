import Dashboard from "../components/AllItemsComponents/Dashboard"
import { mainAllItemsContainer } from "../utils/tailwindClasses";

export default function AllItemsPage({ favourites, addFavourite, removeFavourite }) {
    return (
        <div class={mainAllItemsContainer}>
            <Dashboard
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite} />
        </div>
    );

}