import ItemViews from "../components/ItemViewsComponents/ItemViews.js";

export default function ItemViewsPage({ idToNameMap }) {
  return (
<div>
      <ItemViews idToNameMap={idToNameMap} />
    </div>
  );
}
