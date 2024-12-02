import AlchemyTable from '../components/Alchemy/AlchemyTable';

export default function AlchemyPage({ favourites, addFavourite, removeFavourite }) {


    return (
        <div className="debug-main-content">
            <AlchemyTable 
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite}
            /> 
        </div>
    );
}