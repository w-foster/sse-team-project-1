import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicLineChart({ selectedItemID }) {
    // Define the data for x and y axes as variables
    const xAxisData = [1, 2, 3, 5, 8, 10];
    const seriesData = [1, 2, 3, 5, 8, 10];

    return (
        <LineChart
            xAxis={[{ data: xAxisData }]}
            series={[{ data: seriesData }]}
            width={500}
            height={300}
        />
    );
}
