import React from 'react';
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
        <div className="fixed top-[10vh] left-0 w-[20vw] h-[calc(100vh-10vh)] p-5 box-border overflow-y-auto z-10
        bg-secondaryLightBackground dark:bg-secondaryDarkBackground
        text-primaryLight dark:text-primaryDark 
        border-solid border border-accentDarkBackground">
            <div className="flex flex-col items-center justify-center space-y-4 pt-8">
                {userId &&
                    <>
                    <h2 className="text-2xl"><strong>Favourites</strong></h2>
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