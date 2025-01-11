import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

export default function ChangeColumnButtons({ handleChangeColumns, columnCategories, activeCategory }) {
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
        {Object.entries(columnCategories).map(([category, camelCategory], index) => (
          <Button 
            key={index}
            onClick={() => handleChangeColumns(category)}
            variant={(activeCategory === camelCategory) ? 'disabled' : 'outlined'}
          >
            {category}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}