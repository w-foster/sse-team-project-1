import { Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar/SideBar';
import { useSessionInfo } from '../SessionInfoContext';


export default function NormalPage({ itemList, favourites, removeFavourite }) {
    const currentUserId = useSessionInfo();
    console.log("Current User:", JSON.stringify(currentUserId, null, 2));

    return (
        <>
            <SideBar 
                itemList={itemList}
                favourites={favourites}
                removeFavourite={removeFavourite}
            />

            <Outlet />
        </>
    );
}