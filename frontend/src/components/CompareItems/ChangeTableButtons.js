import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

export default function ChangeTableButtons({ handleChangeSlot, slotTypes, activeSlot }) {
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
        {Object.entries(slotTypes).map(([slot, camelSlot], index) => (
          <Button 
            key={index}
            onClick={() => handleChangeSlot(slot)}
            variant={(activeSlot === camelSlot) ? 'disabled' : 'outlined'}
          >
            {slot}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}