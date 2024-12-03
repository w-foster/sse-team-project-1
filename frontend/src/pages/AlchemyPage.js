import AlchemyTable from '../components/Alchemy/AlchemyTable';
import { mainAlchemyContainer } from '../utils/tailwindClasses';

export default function AlchemyPage({ favourites, addFavourite, removeFavourite }) {


    return (
        <div class={mainAlchemyContainer}>
            <AlchemyTable 
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite}
            /> 
        </div>
    );
}