import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts';
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

    if (interval === '5m' || interval === '1h') {
      timeSeries.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric' }));
    } else if (interval === '24h') {
      timeSeries.push(time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    }
  }

  return timeSeries.reverse();
};

export default function MarketIndexChart() {
  const url = process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5000"
    : "https://runescape-tracker.impaas.uk";

  const [indexData, setIndexData] = useState(null);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState('5m'); // Default interval

  useEffect(() => {
    const fetchIndexData = async () => {
      try {
        const response = await fetch(`${url}/api/market-index`);
        if (!response.ok) {
          throw new Error('Failed to fetch index data');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        console.log(data)
        // Reverse data arrays once during fetch, similar to original logic
        const allIntervalsData = {
          '5m': {
            ...data[0],
            indexValues: [...data[0].indexValues]
          },
          '1h': {
            ...data[1],
            indexValues: [...data[1].indexValues]
          },
          '24h': {
            ...data[2],
            indexValues: [...data[2].indexValues]
          },
        };

        setIndexData(allIntervalsData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching index data');
        setIndexData(null);
      }
    };

    fetchIndexData();
  }, [url]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!indexData) {
    return <p>Loading...</p>;
  }

  const seriesData = indexData[interval];
  if (!seriesData || !seriesData.indexValues) {
    return <h3>No Index Data Available</h3>;
  }

  const xAxisData = generateTimeSeries(seriesData.indexValues.length, interval);

  const handleIntervalChange = (event, newInterval) => {
    if (newInterval) {
      setInterval(newInterval);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <h2>Market Index</h2>
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
        <LineChart
          xAxis={[{ data: xAxisData, scaleType: 'band', label: 'Time' }]}
          yAxis={[{ label: 'Index Value' }]}
          series={[
            { data: seriesData.indexValues, label: 'Market Index', yAxisIndex: 0, line: { color: '#42a5f5' } },
          ]}
          width={window.innerWidth * 0.75}
          height={window.innerHeight * 0.65}
        />
      </div>
    </>
  );
}
