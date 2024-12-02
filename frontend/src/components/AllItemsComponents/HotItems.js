import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';


export default function HotItemGrid({}) {
    // Init navigate func
    const navigate = useNavigate();
    // Define mock rows (data for the grid)
    const [rows, setRows] = useState([]);
  
    useEffect(() => {
      const url =
        process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:5000"
          : "https://runescape-tracker.impaas.uk";
      fetch(`${url}/api/hotitems`, { method: "GET" })
        .then((response) => response.json())
        .then((fetchedData) => {
          console.log("Fetched data:", fetchedData); // Log the fetchedData
          setRows(fetchedData); // Update the state
        })
        .catch((error) => console.error("Error fetching data:", error));
    }, []);
  
    // Define the grid columns
    const columns = [
      {
        field: "icon",
        headerName: "Icon",
        width: 30, // Adjusted smaller width for compactness
        renderCell: (params) => (

            <img
                src={params.row.icon}
                alt={params.row.name}
                style={{ width: 30, height: 30, objectFit: "contain" }} // Smaller icon size
            />

        ),
        sortable: false,
        filterable: false,
      },
      { field: "id", headerName: "ID", width: 40 }, // Smaller width for compact layout
      { field: "name", headerName: "Name", width: 100 }, // Adjusted width
      { field: "avg_price", headerName: "Price", width: 50 }, // Narrow column
      { field: "avg_vol", headerName: "Vol", width: 50 }, // Narrow column
    ];
  

    // Handler for clicking on a row and being redirected
    const handleRowClick = (params) => {
        const itemId = params.row.id;
        navigate(`/items/${itemId}`);
    };

    return (
      <div>
        {/* Data Grid */}
        <div style={{ height: '300px', width: '400px', margin: 'auto' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            density="compact" // Compact layout
            sx={{
              fontSize: "0.75rem", // Smaller font size for a compact look
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "0.8rem", // Smaller column header font size
                padding: "4px", // Less padding for column headers
              },
              "& .MuiDataGrid-cell": {
                padding: "4px", // Less padding for cells
              },
            }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    );
  }
  