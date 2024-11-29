import FavouritesList from './FavouritesList';
import SignInButton from './SignInButton';
import { useNavigate } from 'react-router-dom';
import { useSessionInfo } from '../../SessionInfoContext';

export default function SideBar({ itemList, favourites, removeFavourite }) {
    const currentUserId = useSessionInfo();
    console.log(JSON.stringify(currentUserId, null, 2));
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/signin');
    }

    return (
        <div className="debug-sidebar">
            {currentUserId &&
                <>
                <h2>Favourites</h2>
                <FavouritesList 
                    itemList={itemList}
                    favourites={favourites}
                    removeFavourite={removeFavourite}
                />
                </>
            }
            {!currentUserId &&
                <SignInButton handleClick={handleClick} />
            }      
        </div>
    );
}