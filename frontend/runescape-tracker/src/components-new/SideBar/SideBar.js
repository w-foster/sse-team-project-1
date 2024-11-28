import FavouritesList from './FavouritesList';

export default function SideBar({ itemList, favourites, removeFavourite }) {

    return (
        <div>
            <h2>Favourites</h2>
            <FavouritesList 
                itemList={itemList}
                favourites={favourites}
                removeFavourite={removeFavourite}
            />
        </div>
    );
}