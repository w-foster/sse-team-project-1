import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts';

// Helper function to get the nearest 5-minute mark
const getNearestFiveMinuteMark = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.floor(minutes / 5) * 5; // Round down to the nearest multiple of 5
  now.setMinutes(roundedMinutes);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
};

// Helper function to generate the time series in 5-minute intervals
const generateTimeSeries = (intervalCount, intervalMinutes = 5) => {
  const nearestMark = getNearestFiveMinuteMark();
  return Array.from({ length: intervalCount }, (_, index) => {
    const time = new Date(nearestMark);
    time.setMinutes(nearestMark.getMinutes() - index * intervalMinutes); // Subtract intervals
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as HH:mm
  });
};

// React Component to display the chart
export default function BasicLineChart({ selectedItemID }) {
    const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/react"
    : "https://runescape-tracker.impaas.uk/react";
    //const url = "http://127.0.0.1:5000/react"

    const [priceData, setPriceData] = useState(null); // Store fetched price data
    const [error, setError] = useState(null); // Error handling state
  
    // Fetch price data when the selectedItemID changes
    useEffect(() => {
      const fetchPriceData = async () => {
        try {
          // Call Flask API with the selected item ID
          const response = await fetch(`${url}/api/price?item_id=${selectedItemID}`);
          
          // Check if the response is successful
          if (!response.ok) {
            throw new Error('Failed to fetch price data');
          }
  
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error); // If error in response, throw an error
          }
  
          setPriceData(data); // Update state with the fetched data
          setError(null); // Reset error state
        } catch (err) {
          setError(err.message || 'Error fetching price data'); // Handle errors
          setPriceData(null); // Reset price data in case of error
        }
      };
  
      // Only fetch data if selectedItemID is defined
      if (selectedItemID) {
        fetchPriceData();
      }
    }, [selectedItemID]); // Trigger effect when selectedItemID changes
  
    // Check for errors or no data
    if (error) {
      return <p>{error}</p>;
    }
  
    // If no data, return a loading message
    if (!priceData) {
      return <p>Loading...</p>;
    }
  
  // Generate xAxisData (time series) in 5-minute intervals
  const intervalCount = priceData.time_series.length; // Match the length of your existing data
  const xAxisData = generateTimeSeries(intervalCount).reverse(); // Reverse to match the correct order

  // Assuming the price data contains series data for the chart
  const seriesDataHighPrice = (priceData.avgHighPrice || []).slice().reverse();
  const seriesDataLowPrice = (priceData.avgLowPrice || []).slice().reverse();
  const seriesDataHighVolume = (priceData.highPriceVolume || []).slice().reverse();
  const seriesDataLowVolume = (priceData.lowPriceVolume || []).slice().reverse();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {/* LineChart for price */}
        <LineChart
          xAxis={[{ data: xAxisData, scaleType: 'band', label: 'Time' }]}
          yAxis={[{ label: 'Price' }]}
          series={[
            { data: seriesDataHighPrice, label: 'High Price', yAxisIndex: 0, line: { color: '#42a5f5' } },
            { data: seriesDataLowPrice, label: 'Low Price', yAxisIndex: 0, line: { color: '#66bb6a' } }
          ]}
          width={1400}
          height={600}
        />

        {/* BarChart for volume */}
        <BarChart
          xAxis={[
            { data: xAxisData, label: 'Time', scaleType: 'band' }
          ]}
          yAxis={[
            { label: 'Volume' }
          ]}
          series={[
            { data: seriesDataHighVolume, label: 'High Volume', stack: 'total', color: '#ff7043' },
            { data: seriesDataLowVolume, label: 'Low Volume', stack: 'total', color: '#ffb74d' }
          ]}
          width={1200}
          height={600}
        />
      </div>
    </>
  );
}