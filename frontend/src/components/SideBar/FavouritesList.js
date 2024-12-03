import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemButton, IconButton, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function FavouritesList({ itemList, favourites, removeFavourite }) {
  // Create mapping item ID - item Name
  const idToNameMap = React.useMemo(() => {
    const map = new Map();
    itemList.forEach((item) => {
      map.set(Number(item.id), item.name);
    });
    return map;
  }, [itemList]);

  // Navigation setup
  const navigate = useNavigate();

  const handleClick = (itemId) => {
    if (itemId) {
      navigate(`/items/${itemId}`);
    }
  };

  return (
    <div className="max-w-xs mx-auto">
      <List>
        {favourites.map((itemId) => {
          const itemName = idToNameMap.get(Number(itemId)) || `Item ID: ${itemId}`;
          return (
            <ListItem key={itemId} className="flex justify-between items-center">
              <ListItemButton
                onClick={() => handleClick(itemId)}
                className="text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                <Typography variant="body1">{itemName}</Typography>
              </ListItemButton>
              <IconButton
                aria-label="Delete"
                size="small"
                color="error"
                onClick={() => removeFavourite(itemId)}
              >
                <Delete />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
