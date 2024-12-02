import { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import './styles/ItemViews.css';

export default function ItemViews({ idToNameMap }) {
    const url = process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:5000"
        : "https://runescape-tracker.impaas.uk";

    const [chartData, setChartData] = useState([]); // Data formatted for the BarChart

    // Function to generate icon URL
    const addIcon = (itemId) => `https://services.runescape.com/m=itemdb_rs/obj_sprite.gif?id=${itemId}`;

    useEffect(() => {
        async function fetchItemViews(num_of_items) {
            try {
                const response = await fetch(`${url}/api/popular-items?num_of_items=${num_of_items}`);
                const data = await response.json();

                const formattedData = data.map(item => ({
                    itemName: idToNameMap.get(Number(item.item_id)) || "Unknown Item", // Full name for Y-axis
                    totalViews: item.total_views, // Data for bars
                    icon: addIcon(item.item_id), // Icon URL for tooltip
                }));
                setChartData(formattedData);
            } catch (error) {
                console.error("Error fetching popular items:", error);
            }
        }
        fetchItemViews(5);
    }, [url, idToNameMap]); // Include dependencies

    const chartSetting = {
        xAxis: [
            {
                label: 'Views',
            },
        ],
        width: 600, // Adjust width
        height: 400, // Adjust height
    };

    return (
        <div className='debug-main-content'>
            <div className="debug-graph-content">
                <h1>Most Popular Items (All Time)</h1>
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
                                dataKey: 'totalViews',
                                label: 'Total Views',
                                tooltip: ({ dataPoint }) => `${dataPoint.itemName}`, // Tooltip shows name
                            },
                        ]}
                        layout="horizontal" // Horizontal bar layout
                        {...chartSetting}
                    />
                ) : (
                    <p>Loading popular items...</p>
                )}
            </div>
        </div>
    );
    
}