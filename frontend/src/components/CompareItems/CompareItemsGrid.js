import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';


export default function CompareItemsGrid({ 
  darkMode, allSlotStats, activeSlot, activeStatCategory, permaColumns, gpPer, extraColumns
}) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  
  useEffect(() => {
    const extraCols = extraColumns[activeStatCategory] || [];
    setColumns([...permaColumns, ...extraCols]);
  }, [activeStatCategory]);

  // Update rows based on activeSlot
  useEffect(() => {
    const slotItems = activeSlot === 'all'
      ? Object.values(allSlotStats).flat() // Combine all items if activeSlot is 'all'
      : allSlotStats[activeSlot] || []; // Use specific slot's items

    // Prepare rows by flattening `equipment` attributes
    const preparedRows = slotItems.map((item) => {
      const price = item.has_price_data ? Math.round((item.high_price + item.low_price) / 2) : null;
      return {
        id: item.id, // Ensure `id` is unique
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
    });

    setRows(preparedRows);
  }, [activeSlot, allSlotStats]);

  
  return (
    <Box style={{ 
      display: 'flex', 
      flexDirection: 'column',
      '--cell-negative-bg': darkMode ? '#671d1d' : '#e69393', // red
      '--cell-positive-bg': darkMode ? '#0a4d0a' : '#76e376', // green
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
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