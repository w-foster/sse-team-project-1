import ItemViews from "../components/ItemViewsComponents/ItemViews.js";

export default function ItemViewsPage({ idToNameMap }) {
  return (
    <div
      className="debug-main-content"
      style={{
        outline: "2px solid red", // Add an outline to visually debug the container
        margin: "10px", // Add margin for clarity
        padding: "10px", // Ensure padding inside the container
      }}
    >
      <ItemViews idToNameMap={idToNameMap} />
    </div>
  );
}
