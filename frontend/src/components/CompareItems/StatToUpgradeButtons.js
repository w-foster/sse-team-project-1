import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

export default function StatToUpgradeButtons({ handleChangeStatToUpgrade, statIcons, statToUpgrade }) {

  function formatString(input) {
    return input
      .split('_') // Split by underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join with spaces
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        {Object.entries(statIcons).map(([statType, statIcon], index) => (
          <Button 
            key={index}
            onClick={() => handleChangeStatToUpgrade(statType)}
            variant={(statToUpgrade === statType) ? 'disabled' : 'outlined'}
          >
            <img src={statIcon} alt={formatString(statType)}/>
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}