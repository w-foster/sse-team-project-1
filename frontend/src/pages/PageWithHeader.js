import { Outlet } from 'react-router-dom';
import TitleBar from '../components/SearchBar/TitleBar';


export default function PageWithHeader({ itemList, favourites, addFavourite, removeFavourite}) {
    return (
        <>
            <TitleBar 
                itemList={itemList}
                favourites={favourites}
                addFavourite={addFavourite}
                removeFavourite={removeFavourite}
            />

            <Outlet />
        </>
    );
}