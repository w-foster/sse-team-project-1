import FavouritesList from './FavouritesList';
import SignInForm from './SignInForm'

export default function SideBar({ className, favourites, removeFavourite }) {
    return (
        <div className={className}>
            <h1>SIDEBAR</h1>
            <FavouritesList 
                favourites={favourites}
                removeFavourite={removeFavourite} />
            
        </div>
    );
}