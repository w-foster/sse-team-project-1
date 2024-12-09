
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


export default function SelectedItemList({ selectedItems, handleClickDelete, idToNameMap }) {
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);


  return (
    <div style={{ }}>
        <List dense={dense}>
            {selectedItems.map((itemId, index) => {
                const itemName = idToNameMap.get(Number(itemId));
                return (
                    <ListItem
                        key={index}
                        secondaryAction={
                        <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleClickDelete(itemId)}>
                            <DeleteIcon />
                        </IconButton>
                        }
                    >
                        <ListItemAvatar>
                        <Avatar>
                            <p>{itemName.charAt(0)}{itemName.charAt(1)}</p>
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                        primary={itemName}
                        secondary={secondary ? 'Secondary text' : null}
                        />
                    </ListItem>
                );
            })}
        </List>
    </div>
  );
}