import ItemGrid from './ItemGrid'
import BasicLineChart from './Graph'

export default function Dashboard({ className }) {
    return (
        <div className={className}>
            Dashboard
            <ItemGrid />
        </div>
    );
}