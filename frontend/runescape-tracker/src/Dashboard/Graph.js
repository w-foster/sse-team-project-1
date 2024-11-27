import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

// Accept props to allow the parent component to pass data
export default function BasicLineChart({ selectedItemID }) {
    // pass selectedItemID to get x and y series of data

  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[{ data: [1, 2, 3, 5, 8, 10] }]}
      width={500}
      height={300}
    />
  );
}