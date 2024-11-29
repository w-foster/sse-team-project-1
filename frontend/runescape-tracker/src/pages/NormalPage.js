import { Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar/SideBar';


export default function NormalPage({ itemList, favourites, removeFavourite }) {
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