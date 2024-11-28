import React, { useEffect, useState } from 'react';
import { LineChart, BarChart } from '@mui/x-charts';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const getNearestTimeMark = (interval = '5m') => {
  const now = new Date();
  
  if (interval === '1h') {
    now.setHours(now.getHours());
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
  } else if (interval === '24h') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
  } else {
    const minutes = now.getMinutes();
    const roundedMinutes = Math.floor(minutes / 5) * 5;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
  }
  
  return now;
};

const generateTimeSeries = (intervalCount, interval = '5m') => {
  const nearestMark = getNearestTimeMark(interval);
  const timeSeries = [];

  for (let i = 0; i < intervalCount; i++) {
    const time = new Date(nearestMark);
    
    switch (interval) {
      case '1h':
        time.setHours(nearestMark.getHours() - i);
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        break;
      case '24h':
        time.setDate(nearestMark.getDate() - i);
        break;
      case '5m':
      default:
        time.setMinutes(nearestMark.getMinutes() - i * 5);
        break;
    }

    if (interval === '5m') {
      timeSeries.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else if (interval === '1h') {
      timeSeries.push(time.toLocaleDateString([], { hour: '2-digit', minute: '2-digit', weekday: 'short' }));
    } else if (interval === '24h') {
      timeSeries.push(time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    }
  }

  return timeSeries.reverse();
};

export default function BasicLineChart({ selectedItemID, itemName }) {
  const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000/react"
    : "https://runescape-tracker.impaas.uk/react";

  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState(null);
  const [alignment, setAlignment] = useState('price'); // 'price' or 'volume'
  const [interval, setInterval] = useState('5m'); // Default to 5m interval

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(`${url}/api/price?item_id=${selectedItemID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        // Reverse data arrays once during fetch
        const reversedData = {
          '5m': {
            ...data[0],
            avgHighPrice: [...data[0].avgHighPrice].reverse(),
            avgLowPrice: [...data[0].avgLowPrice].reverse(),
            highPriceVolume: [...data[0].highPriceVolume].reverse(),
            lowPriceVolume: [...data[0].lowPriceVolume].reverse(),
          },
          '1h': {
            ...data[1],
            avgHighPrice: [...data[1].avgHighPrice].reverse(),
            avgLowPrice: [...data[1].avgLowPrice].reverse(),
            highPriceVolume: [...data[1].highPriceVolume].reverse(),
            lowPriceVolume: [...data[1].lowPriceVolume].reverse(),
          },
          '24h': {
            ...data[2],
            avgHighPrice: [...data[2].avgHighPrice].reverse(),
            avgLowPrice: [...data[2].avgLowPrice].reverse(),
            highPriceVolume: [...data[2].highPriceVolume].reverse(),
            lowPriceVolume: [...data[2].lowPriceVolume].reverse(),
          },
        };

        setPriceData(reversedData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching price data');
        setPriceData(null);
      }
    };

    if (selectedItemID) {
      fetchPriceData();
    }
  }, [selectedItemID]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!priceData) {
    return <p>Loading...</p>;
  }

  const seriesData = priceData[interval]; // Select series data for the chosen interval
  const xAxisData = generateTimeSeries(seriesData.time_series.length, interval);

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleIntervalChange = (event, newInterval) => {
    setInterval(newInterval);
  };

  const { avgHighPrice: highPrice, avgLowPrice: lowPrice, highPriceVolume: highVolume, lowPriceVolume: lowVolume } = seriesData;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '7%'}}>
        <h2>{itemName}</h2>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="chart type"
        >
          <ToggleButton value="price" aria-label="price chart">
            Price
          </ToggleButton>
          <ToggleButton value="volume" aria-label="volume chart">
            Volume
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={interval}
          exclusive
          onChange={handleIntervalChange}
          aria-label="time interval"
        >
          <ToggleButton value="5m" aria-label="5 minute interval">
            5m
          </ToggleButton>
          <ToggleButton value="1h" aria-label="1 hour interval">
            1h
          </ToggleButton>
          <ToggleButton value="24h" aria-label="24 hour interval">
            24h
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div>
        {alignment === 'price' ? (
          <LineChart
            xAxis={[{ data: xAxisData, scaleType: 'band', label: 'Time' }]}
            yAxis={[{ label: 'Price' }]}
            series={[
              { data: highPrice, label: 'High Price', yAxisIndex: 0, line: { color: '#42a5f5' } },
              { data: lowPrice, label: 'Low Price', yAxisIndex: 0, line: { color: '#66bb6a' } }
            ]}
            width={window.innerWidth * 0.8}
            height={window.innerHeight * 0.7}
          />
        ) : (
          <BarChart
            xAxis={[{ data: xAxisData, label: 'Time', scaleType: 'band' }]}
            yAxis={[{ label: 'Volume' }]}
            series={[
              { data: highVolume, label: 'High Volume', stack: 'total', color: '#ff7043' },
              { data: lowVolume, label: 'Low Volume', stack: 'total', color: '#ffb74d' }
            ]}
            width={window.innerWidth * 0.8}
            height={window.innerHeight * 0.7}
          />
        )}
      </div>
    </>
  );
}
