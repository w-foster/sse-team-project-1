import FavouritesList from './FavouritesList';
import SignInButton from './SignInButton';
import { useNavigate } from 'react-router-dom';
import { useSessionInfo } from '../../SessionInfoContext';

export default function SideBar({ itemList, favourites, removeFavourite }) {
    const { userId } = useSessionInfo();
    console.log(JSON.stringify(userId, null, 2));
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/signin');
    }

    return (
        <div className="bg-white dark:bg-slate-800 border-[4px] border-red-500 fixed top-[10vh] left-0 w-[20vw] h-[calc(100vh-10vh)] bg-[#f4f4f4] p-5 box-border overflow-y-auto z-10">
            <div className="flex flex-col items-center justify-center space-y-4">
                {userId &&
                    <>
                    <h2 className="text-slate-900 dark:text-white">Favourites</h2>
                    <FavouritesList 
                        itemList={itemList}
                        favourites={favourites}
                        removeFavourite={removeFavourite}
                    />
                    </>
                }
                {!userId &&
                    <SignInButton handleClick={handleClick} />
                }   
            </div>   
        </div>
    );
}