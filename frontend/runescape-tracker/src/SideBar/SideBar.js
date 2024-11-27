import FavouritesList from './FavouritesList';
import SignInForm from './SignInForm'

export default function SideBar({ className, favourites }) {
    return (
        <div className={className}>
            <h1>SIDEBAR</h1>
            {favourites.map((f) => (
                <p>{f}</p>
            ))}
            <FavouritesList 
                favourites={favourites} />
            <SignInForm />
        </div>
    );
}