import { useParams } from 'react-router-dom';
import Graph from '../components-new/PerItemComponents/Graph';

export default function PerItemPage({ itemList }) {
    const { itemId } = useParams();
    return (
        <div>
            <h1>Per Item Page</h1>
            <h2>Item ID: {itemId}</h2>
            <Graph itemId={itemId} itemList={itemList} />
        </div>
    );
}