import { useState,useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export default function ItemGrid({ favourites, addFavourite, removeFavourite }) {
  // Define mock rows (data for the grid)
  const [rows, setRows] = useState([]);


  useEffect(() => {
    const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/react"
    : "https://runescape-tracker.impaas.uk/react";
    fetch(`${url}/api/items`, {method: 'GET'})
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data); // Log the data
        setRows(data); // Update the state
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  
  // Function to handle toggling favorites
  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      // Optimistic update for the UI (immediate)
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, favorite: !row.favorite } : row
        )
      );
      // Update DB
      if (isFavorite) {
        await removeFavourite(id);
      } else {
        await addFavourite(id);
      }
    } // Rollback if error
    catch (error) {
      setRows((prevRows) => 
        prevRows.map((row) => (
          row.id === id ? { ...row, favorite: isFavorite } : row
        )
      ));
      console.error('Error toggling favourite', error);
    }
  };

  // Define the grid columns
  const columns = [
    {
      field: 'favorite',
      headerName: 'Favorite',
      width: 100,
      renderCell: (params) => {
        const isFavorite = params.row.favorite;
        return (
          <IconButton
            onClick={() => handleToggleFavorite(params.row.id, isFavorite)}
            color="primary"
          >
            {isFavorite ? <StarIcon /> : <StarOutlineIcon />}
          </IconButton>
        );
      },
      sortable: false,
      filterable: false,
    },
    {
      field: 'icon',
      headerName: 'Icon',
      width: 100,
      renderCell: (params) => (
        <a href={params.row.icon} target="_blank" rel="noopener noreferrer">
          <img src={params.row.icon} alt={params.row.name} style={{ width: 50, height: 50, objectFit: 'contain' }} />
        </a>
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'id', headerName: 'Item ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'high', headerName: 'High', width: 150 },
    { field: 'low', headerName: 'Low', width: 150 },
    { field: 'margin_percentage', headerName: 'Margin Percentage', width: 150 },
  ];

  // Extract the favorite items for the favorites list
  // const favoriteItems = rows.filter((row) => row.favorite);

  return (
    <div>
      {/* Data Grid */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          density="compact"s
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </div>



      {/* <div style={{ marginTop: '20px' }}>
        <h2>Favorite Items</h2>
        {favoriteItems.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <ul>
            {favoriteItems.map((item) => (
              <li key={item.id}>
                {item.name} - High Price: {item.high}, Low Price: {item.low}
              </li>
            ))}
          </ul>
        )}
      </div> */}

    </div>
  );
}
