import ItemViews from "../components/ItemViewsComponents/ItemViews.js";
import MostFavouritedItems from "../components/ItemViewsComponents/MostFavouritedItems.js";
import { mainItemViews } from "../utils/tailwindClasses.js";

export default function ItemViewsPage({ idToNameMap }) {
  return (
    <div class={mainItemViews}>
      <ItemViews idToNameMap={idToNameMap} />
      <MostFavouritedItems idToNameMap={idToNameMap} />
    </div>
  );
}
