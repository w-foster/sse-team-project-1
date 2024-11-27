import FavouritesList from './FavouritesList';
import SignInForm from './SignInForm'

export default function SideBar({ className, favourites, removeFavourite }) {
    return (
        <div className={className}>
            <h1>SIDEBAR</h1>
            {favourites.map((f) => (
                <p>{f}</p>
            ))}
            <FavouritesList 
                favourites={favourites}
                removeFavourite={removeFavourite} />
            <SignInForm />
        </div>
    );
}