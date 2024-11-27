import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export default function ItemGrid() {
  // Define mock rows (data for the grid)
  const [rows, setRows] = useState([
    { id: 1, icon: 'https://upload.wikimedia.org/wikipedia/en/a/ad/Jinx-artwork-lol.png', name: 'JianKai', AvgHighPrice: 200, AvgLowPrice: 150, Change: '5%', favorite: false },
    { id: 2, icon: 'https://w7.pngwing.com/pngs/401/554/png-transparent-league-of-legends-video-game-riot-games-desktop-league-of-legends-fictional-character-legend-action-figure-thumbnail.png', name: 'Yash', AvgHighPrice: 300, AvgLowPrice: 250, Change: '-2%', favorite: false },
    { id: 3, icon: 'data:image/jpeg;base64,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',name: 'Sheesh', AvgHighPrice: 400, AvgLowPrice: 350, Change: '10%', favorite: false },
    { id: 4, icon: 'data:image/jpeg;base64,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',name: 'Kev dawg', AvgHighPrice: 10000000, AvgLowPrice: 100000, Change: '10%', favorite: false },
  ]);

  // Function to handle toggling favorites
  const handleToggleFavorite = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, favorite: !row.favorite } : row
      )
    );
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
            onClick={() => handleToggleFavorite(params.row.id)}
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
    { field: 'AvgHighPrice', headerName: 'High', width: 150 },
    { field: 'AvgLowPrice', headerName: 'Low', width: 150 },
    { field: 'Change', headerName: 'Percentage Change', width: 150 },
    { field: 'Change', headerName: 'Percentage Change', width: 150 },
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
                {item.name} - High Price: {item.AvgHighPrice}, Low Price: {item.AvgLowPrice}
              </li>
            ))}
          </ul>
        )}
      </div> */}

    </div>
  );
}
