import React, { useEffect, useState } from 'react';
import { LineChart, BarChart } from '@mui/x-charts';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';

const getNearestTimeMark = (interval = '5m') => {
  const now = new Date();
  
  if (interval === '1h') {
    // Round to the nearest hour
    now.setHours(now.getHours());
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
  } else if (interval === '24h') {
    // Round to the nearest day (midnight)
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
  } else {
    // Round to the nearest 5-minute mark
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
        // For 1 hour intervals, create an array of hours from midnight
        time.setHours(nearestMark.getHours() - i);
        time.setMinutes(0); // Reset minutes and seconds to get full hour
        time.setSeconds(0);
        time.setMilliseconds(0);
        break;
      case '24h':
        // For 24 hours, subtract days
        time.setDate(nearestMark.getDate() - i);
        break;
      case '5m':
      default:
        // For 5 minute intervals, subtract minutes
        time.setMinutes(nearestMark.getMinutes() - i * 5);
        break;
    }

    // Format time as HH:mm for 5m and 1h, or Date for 24h
    if (interval === '5m' || interval === '1h') {
      timeSeries.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric' }));
    } else if (interval === '24h') {
      timeSeries.push(time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    }
  }

  return timeSeries.reverse(); // Reverse to have the most recent time first
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

        setPriceData(data);
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

  // Assuming priceData is an array of 3 objects with 'time' and 'price' for each interval (5m, 1h, 24h)
  const seriesData5m = priceData[0]; // Data for "5m" interval
  const seriesData1h = priceData[1]; // Data for "1h" interval
  const seriesData24h = priceData[2]; // Data for "24h" interval

  // Determine intervalCount based on the selected interval
  const getIntervalCount = () => {
    switch (interval) {
      case '1h':
        return seriesData1h.time_series.length;
      case '24h':
        return seriesData24h.time_series.length;
      case '5m':
      default:
        return seriesData5m.time_series.length;
    }
  };

  const intervalCount = getIntervalCount();
  const xAxisData = generateTimeSeries(intervalCount, interval); // Removed the extra reverse()

  // Select the series data based on the selected interval
  const getSeriesData = () => {
    switch (interval) {
      case '1h':
        return {
          highPrice: (seriesData1h.avgHighPrice || []).reverse(),
          lowPrice: (seriesData1h.avgLowPrice || []).reverse(),
          highVolume: (seriesData1h.highPriceVolume || []).reverse(),
          lowVolume: (seriesData1h.lowPriceVolume || []).reverse(),
        };
      case '24h':
        return {
          highPrice: (seriesData24h.avgHighPrice || []).reverse(),
          lowPrice: (seriesData24h.avgLowPrice || []).reverse(),
          highVolume: (seriesData24h.highPriceVolume || []).reverse(),
          lowVolume: (seriesData24h.lowPriceVolume || []).reverse(),
        };
      case '5m':
      default:
        return {
          highPrice: (seriesData5m.avgHighPrice || []).reverse(),
          lowPrice: (seriesData5m.avgLowPrice || []).reverse(),
          highVolume: (seriesData5m.highPriceVolume || []).reverse(),
          lowVolume: (seriesData5m.lowPriceVolume || []).reverse(),
        };
    }
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleIntervalChange = (event, newInterval) => {
    setInterval(newInterval);
  };

  const { highPrice, lowPrice, highVolume, lowVolume } = getSeriesData();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <h2>{itemName}</h2>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="chart type"
        >
          <ToggleButton value="price" aria-label="price chart">
            <FormatAlignLeftIcon /> Price
          </ToggleButton>
          <ToggleButton value="volume" aria-label="volume chart">
            <FormatAlignCenterIcon /> Volume
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
            width={1400}
            height={600}
          />
        ) : (
          <BarChart
            xAxis={[{ data: xAxisData, label: 'Time', scaleType: 'band' }]}
            yAxis={[{ label: 'Volume' }]}
            series={[
              { data: highVolume, label: 'High Volume', stack: 'total', color: '#ff7043' },
              { data: lowVolume, label: 'Low Volume', stack: 'total', color: '#ffb74d' }
            ]}
            width={1400}
            height={600}
          />
        )}
      </div>
    </>
  );
}
