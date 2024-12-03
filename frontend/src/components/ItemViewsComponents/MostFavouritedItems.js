import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import './styles/MostFavouritedItems.css';

export default function MostFavouritedItems({ idToNameMap }) {
    const url = process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:5000"
        : "https://runescape-tracker.impaas.uk";

    const [chartData, setChartData] = useState([]); // Data formatted for the BarChart

    // Function to generate icon URL
    const addIcon = (itemId) => `https://services.runescape.com/m=itemdb_rs/obj_sprite.gif?id=${itemId}`;

    useEffect(() => {
        async function fetchItemViews(num_of_items) {
            try {
                const response = await fetch(`${url}/api/most_favourited?num_of_items=${num_of_items}`);
                const data = await response.json();

                const formattedData = data.map(item => ({
                    itemName: idToNameMap.get(Number(item.item_id)) || "Unknown Item", // Full name for Y-axis
                    totalFavs: item.total_fav, // Data for bars
                    icon: addIcon(item.item_id), // Icon URL for tooltip
                }));
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching popular items:", error);
            }
        }
        fetchItemViews(10);
    }, [url, idToNameMap]); // Include dependencies

    const chartSetting = {
        xAxis: [
            {
                label: 'Favourites',
            },
        ],
        width: 600, // Adjust width
        height: 400, // Adjust height
    };

    return (
            <div>
                <h1>Most Favourited Items (Real Time)</h1>
                {chartData.length > 0 ? (
                    <BarChart
                        dataset={chartData}
                        yAxis={[
                            {
                                scaleType: 'band',
                                dataKey: 'itemName',
                                paddingOuter: 0.5, // Add outer padding
                                paddingInner: 0.5, // Space between bars
                                tickSize: 10, // Adjust the tick size if needed
                                tickLabelStyle: {
                                    textAnchor: 'end', // Align text properly
                                    fontSize: 12, // Adjust font size
                                },
                                labelFormatter: (value) => value, // Ensure full text is rendered
                            },
                        ]}
                        series={[
                            {
                                dataKey: 'totalFavs',
                                label: 'Total Favourites',
                                tooltip: ({ dataPoint }) => `${dataPoint.itemName}`, // Tooltip shows name
                            },
                        ]}
                        layout="horizontal" // Horizontal bar layout
                        {...chartSetting}
                        width={window.innerWidth * 0.7}
                        height={window.innerHeight * 0.65}
                        margin={{ left: 150 }}
                    />
                ) : (
                    <p>Loading favourited items...</p>
                )}
            </div>

    );
    
}