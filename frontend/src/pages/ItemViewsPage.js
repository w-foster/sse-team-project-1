import ItemViews from "../components/ItemViewsComponents/ItemViews.js";
import MostFavouritedItems from "../components/ItemViewsComponents/MostFavouritedItems.js";
import { mainContainer } from "../utils/tailwindClasses.js";

export default function ItemViewsPage({ idToNameMap }) {
  return (
    <div class={mainContainer}>
      <div className="grid place-items-center w-full h-full">
        <div className="space-y-4">
          <ItemViews idToNameMap={idToNameMap} />
          <MostFavouritedItems idToNameMap={idToNameMap} />
        </div>
      </div>
    </div>
  );
}