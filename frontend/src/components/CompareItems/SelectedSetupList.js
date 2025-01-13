import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';


const slotColumn = { field: 'slot', 
    headerName: 'Slot', 
    width: 80,
    editable: false, 
};

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


export default function SelectedSetupList({ 
    darkMode, setups, activeEquipmentSetup, permaColumns, extraColumns, 
    activeCategory, gpPer, handleClickDeleteItem 
}) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  
  useEffect(() => {
    const extraCols = extraColumns[activeCategory] || [];
    setColumns([slotColumn, ...permaColumns, ...extraCols]);
    console.log('EXTRA COLS:', extraCols);
    console.log('COLS:', columns);
  }, [activeCategory]);

  let emptyRowCounter = 0;  // MUI requires unique IDs on rows
  // Create an empty row dynamically
  function createEmptyRow(slotName) {
    return columns.reduce((row, column) => {
      row[column.field] = null; 
      return row;
    }, { id: `empty-${emptyRowCounter++}`, slot: slotName });
  }

  // Update rows based on activeSlot
  useEffect(() => {
    // Prepare rows by flattening `equipment` attributes
    const preparedRows = Object.entries(setups[activeEquipmentSetup]).map(([slotName, item]) => {
      const slotNameFormatted = slotName.charAt(0).toUpperCase() + slotName.slice(1);
      if (!item) return createEmptyRow(slotNameFormatted);
      const price = item.has_price_data ? Math.round((item.high_price + item.low_price) / 2) : null;
      return {
        id: item.id, // Ensure `id` is unique
        slot: (item.equipment?.slot ? slotNameFormatted : 0),
        icon: item.icon,
        name: item.name,
        stabAttack: item.equipment?.attack_stab || 0,
        slashAttack: item.equipment?.attack_slash || 0,
        crushAttack: item.equipment?.attack_crush || 0,
        magicAttack: item.equipment?.attack_magic || 0,
        rangedAttack: item.equipment?.attack_ranged || 0,
        stabDefence: item.equipment?.defence_stab || 0,
        slashDefence: item.equipment?.defence_slash || 0,
        crushDefence: item.equipment?.defence_crush || 0,
        magicDefence: item.equipment?.defence_magic || 0,
        rangedDefence: item.equipment?.defence_ranged || 0,
        strength: item.equipment?.melee_strength || 0,
        rangedStrength: item.equipment?.ranged_strength || 0,
        magicDamage: item.equipment?.magic_damage || 0,
        prayer: item.equipment?.prayer || 0,
        gp: price,
        gpPerStabAttack: gpPer(item.equipment.attack_stab, price),
        gpPerSlashAttack: gpPer(item.equipment.attack_slash, price), 
        gpPerCrushAttack: gpPer(item.equipment.attack_crush, price),
        gpPerMagicAttack: gpPer(item.equipment.attack_magic, price),
        gpPerRangedAttack: gpPer(item.equipment.attack_ranged, price),
        gpPerStabDefence: gpPer(item.equipment.defence_stab, price),
        gpPerSlashDefence: gpPer(item.equipment.defence_slash, price),
        gpPerCrushDefence: gpPer(item.equipment.defence_crush, price),
        gpPerMagicDefence: gpPer(item.equipment.defence_magic, price),
        gpPerRangedDefence: gpPer(item.equipment.defence_ranged, price),
        gpPerStrength: gpPer(item.equipment.melee_strength, price),
        gpPerRangedStrength: gpPer(item.equipment.ranged_strength, price),
        gpPerMagicDamage: gpPer(item.equipment.magic_damage, price),
        gpPerPrayer: gpPer(item.equipment.prayer, price),
      };
    })
    
    // Initialize totals object
    const totals = { id: 'totals-row', name: 'Totals' };

    // Sum up numeric fields
    columns.reduce((_, column) => {
    const { field } = column;

    if (field === 'icon' || field === 'slot') {
        totals[field] = null; // Skip non-numeric fields
    } 
    else if (field === 'name') {
        totals[field] = 'TOTAL';
    }
    else if (!field.startsWith('gpPer')) {
        totals[field] = preparedRows.reduce((sum, row) => sum + (row[field] || 0), 0);
    }
    return totals; // Returning totals is optional since it's already modified
    }, totals);

    // Calculate gpPer fields based on totals
    const allExtraCols = Object.values(extraColumns).flat();
    const allColumns = [slotColumn, ...permaColumns, ...allExtraCols];
    allColumns.forEach((column) => {
    const { field } = column;

    if (field.startsWith('gpPer')) {
        // Extract the base stat field from gpPer (e.g., 'gpPerStabAttack' -> 'stabAttack')
        const baseField = field.replace('gpPer', '').charAt(0).toLowerCase() + field.replace('gpPer', '').slice(1);

        if (totals.gp) {
        // Use the totals values to calculate gpPer fields
        totals[field] = gpPer(totals[baseField], totals.gp);
        } else {
        totals[field] = null; // Fallback for missing dat
        }
    }
    });

    setRows([...preparedRows, totals]);
  }, [activeEquipmentSetup, setups]);

  return (
    <Box style={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      '--cell-negative-bg': darkMode ? '#671d1d' : '#e69393', // red
      '--cell-positive-bg': darkMode ? '#0a4d0a' : '#76e376', // green
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
         // Automatically adjusts height to fit all rows
         // Hides the pagination and footer controls
        sx={{
          '& .cell-negative': {
            backgroundColor: 'var(--cell-negative-bg)',
          },
          '& .cell-positive': {
            backgroundColor: 'var(--cell-positive-bg)',
          },
        }}
      />
    </Box>
  );
  
}