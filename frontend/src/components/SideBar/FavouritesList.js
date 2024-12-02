import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import IconButton from '@mui/joy/IconButton';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import { Icon } from '@mui/material';



export default function FavouritesList({ itemList, favourites, removeFavourite }) {
    // Create mapping item ID - item Name
	const idToNameMap = React.useMemo(() => {
		const map = new Map();
		itemList.forEach((item) => {
			map.set(Number(item.id), item.name);
		});
		return map;
	}, []);

    // NEW NAVIGATION STUFF
    const navigate = useNavigate();

    const handleClick = (itemId) => {
        if (itemId) {
            navigate(`/items/${itemId}`); // Redirect to the item-specific route
        }
    };


  return (
    <List sx={{ maxWidth: 300 }}>
      {/*
      <ListItem
        startAction={
          <IconButton aria-label="Add" size="sm" variant="plain" color="neutral">
            <Add />
          </IconButton>
        }
      >
        <ListItemButton>Item 1</ListItemButton>
      </ListItem>
      */}
      
      {favourites.map((itemId) => {
        const itemName = idToNameMap.get(Number(itemId)) || `Item ID: ${itemId}`;
        return (
          <ListItem 
              key={itemId}
              endAction={
                  <IconButton 
                      aria-label="Delete" 
                      size="sm" 
                      color="danger"
                      onClick={() => removeFavourite(itemId)}
                  >
                      <Delete />
                  </IconButton>
              }
          >
              <ListItemButton
                onClick={() => handleClick(itemId)}
              >{itemName}</ListItemButton>
          </ListItem>
      )})}

    </List>
  );
}