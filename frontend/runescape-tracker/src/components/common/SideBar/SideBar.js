import FavouritesList from './FavouritesList';
import SignInForm from './SignInForm'

export default function SideBar({ className, onClickItem, favourites, removeFavourite }) {
    return (
        <div className={className}>
            <h2>Favourites</h2>
            <FavouritesList 
                favourites={favourites}
                removeFavourite={removeFavourite}
                onClickItem={onClickItem} />
            
        </div>
    );
}