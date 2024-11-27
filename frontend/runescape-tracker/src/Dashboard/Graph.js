import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

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
  
    // Assuming the price data contains x-axis and series data for the chart
    const xAxisData = priceData.time_series || [];
    const seriesData = priceData.avgHighPrice || []; // Example series data
  
    return (
      <LineChart
        xAxis={[{ data: xAxisData }]}
        series={[{ data: seriesData }]}
        width="80%"
        height={300}
      />
    );
  }