import { useParams } from 'react-router-dom';
import Graph from '../components/PerItemComponents/Graph';
import MovingTextBar from '../components/PerItemComponents/MovingTextBar';

export default function PerItemPage({ itemList, idToNameMap }) {
    const { itemId } = useParams();
    return (
        <div className="debug-main-content">
            <h2>{idToNameMap.get(Number(itemId))}</h2>
            <Graph itemId={itemId} itemList={itemList} />
            <MovingTextBar itemId={itemId} />
        </div>
    );
}