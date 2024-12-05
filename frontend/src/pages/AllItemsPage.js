import Dashboard from "../components/AllItemsComponents/Dashboard"
import { mainContainer } from "../utils/tailwindClasses";

export default function AllItemsPage({ favourites, addFavourite, removeFavourite }) {
    return (
        <div class={mainContainer}>
            <Dashboard
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite} />
        </div>
    );

}