import AlchemyTable from '../components/Alchemy/AlchemyTable';
import { mainContainer } from '../utils/tailwindClasses';

export default function AlchemyPage({ favourites, addFavourite, removeFavourite }) {
    return (
        <div class={mainContainer}>
            <AlchemyTable 
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite}
            /> 
        </div>
    );
}