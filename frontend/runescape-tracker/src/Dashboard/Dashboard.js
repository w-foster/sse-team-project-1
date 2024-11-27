import ItemGrid from './ItemGrid'
import BasicLineChart from './Graph'

export default function Dashboard({ className, selectedItemID }) {
    return (
        <div className={className}>
            Dashboard
            <ItemGrid />
            <BasicLineChart selectedItemID={selectedItemID}/>
        </div>
    );
}