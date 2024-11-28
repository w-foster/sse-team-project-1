import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export default function ItemGrid({ favourites, addFavourite, removeFavourite }) {
  const navigate = useNavigate(); // initialise navigate func
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const url = process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:5000"
      : "https://runescape-tracker.impaas.uk";
    fetch(`${url}/api/items`, { method: 'GET' })
      .then((response) => response.json())
      .then((fetchedData) => {
        setRows(fetchedData); // Update the state with fetched data
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    setRows((prevRows) => {
      const favouriteSet = new Set(favourites.map((id) => Number(id)));
      return prevRows.map((row) => ({
        ...row,
        favorite: favouriteSet.has(Number(row.id)),
      }));
    });
  }, [favourites]);

  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      if (isFavorite) {
        await removeFavourite(id);
      } else {
        await addFavourite(id);
      }
    } catch (error) {
      console.error('Error toggling favourite', error);
    }
  };

  const columns = [
    {
      field: 'favorite',
      headerName: 'Favorite',
      width: 100,
      renderCell: (params) => {
        const isFavorite = params.row.favorite;
        return (
          <IconButton onClick={() => handleToggleFavorite(params.row.id, isFavorite)} color="primary">
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
          <img src={params.row.icon} alt={params.row.name} style={{ width: 30, height: 30, objectFit: 'contain' }} />
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


  // Handler for clicking on a row and being redirected
  const handleRowClick = (params) => {
    const itemId = params.row.id;
    navigate(`/items/${itemId}`);
  };

  return (
    <div style={{ width: '100%', height: 400 }}> {/* Set fixed height for grid container */}
      {/* Data Grid with pagination and no autoHeight */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}  // Set to show 5 rows per page
        pageSizeOptions={[5, 10, 20]}  // Allow the user to choose between 5, 10, or 20 items per page
        pagination
        density="compact"
        getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
