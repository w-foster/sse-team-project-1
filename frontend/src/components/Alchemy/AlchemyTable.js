import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export default function AlchemyTable({ favourites, addFavourite, removeFavourite }) {
  const navigate = useNavigate(); // initialise navigate func
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:5000"
      : "https://runescape-tracker.impaas.uk";

      const priceData = await fetch(`${url}/api/items`, { method: 'GET' })
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching price data:', error));

      const highAlchData = await fetch(`${url}/api/high-alch`, { method: 'GET' })
        .then((response) => response.json())
        .catch((error) => console.error('Error fetching high alch data:', error));

      // // Standardize IDs to numbers
      // const standardizedPriceData = priceData.map((item) => ({
      //   ...item,
      //   id: Number(item.id), // Ensure ID is a number
      // }));

      // const standardizedHighAlchData = highAlchData.map((item) => ({
      //   ...item,
      //   id: Number(item.id), // Ensure ID is a number
      // }));

      // Merge data
      const merged = priceData.map(item => {
        const matchingItem = highAlchData.find(obj => Number(obj.id) === Number(item.id));
        const highalch = matchingItem?.highalch;
        const high = item.high;
        const low = item.low;
        const high_margin = highalch - high
        const low_margin = highalch - low

        return { ...item, ...(matchingItem || {}) , high_margin, low_margin }; // Merge attributes
      });

      // console.log(standardizedPriceData);
      // console.log(standardizedHighAlchData);
      const merged_data = merged;
      //console.log(merged_data);
      setRows(merged);
    };
    
    fetchData();
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
          <IconButton onClick={(event) => {
              event.stopPropagation();
              handleToggleFavorite(params.row.id, isFavorite);
            }} 
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
        
        <img src={params.row.icon} alt={params.row.name} style={{ width: 30, height: 30, objectFit: 'contain' }} />
 
      ),
      sortable: false,
      filterable: false,
    },
    
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'highalch', headerName: 'High Alch', width: 150 },
    { field: 'high', headerName: 'High Price', width: 150 },
    { field: 'high_margin', headerName: 'High Margin', width: 150 },
    { field: 'low', headerName: 'Low Price', width: 150 },
    { field: 'low_margin', headerName: 'Low Margin', width: 150 },

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
