import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

export default function EquipmentSetupButtons({ activeEquipmentSetup, maxSetups, handleChangeEquipmentSetup }) {
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
        {Array.from({length: maxSetups}, (_, index) => (
          <Button 
            key={index}
            onClick={() => handleChangeEquipmentSetup(index)}
            variant={(activeEquipmentSetup === index) ? 'disabled' : 'outlined'}
          >
            Setup {index + 1}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}

