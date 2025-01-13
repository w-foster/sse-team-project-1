import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';




export default function UpgradesList({ 
  darkMode, allSlotStats, activeStatCategory, permaColumns, gpPer, extraColumns, 
  setups, activeEquipmentSetup, statTypes, statToUpgrade
}) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  
  
  useEffect(() => {
    const extraCols = extraColumns[activeStatCategory] || [];
    setColumns([...permaColumns, ...extraCols]);
  }, [activeStatCategory]);

  // Update rows
  useEffect(() => {
    // Flatten all items across all slots and filter them
    const upgrades = Object.values(allSlotStats)
    .flat()
    .filter((item) => {
        const equippedItem = setups[activeEquipmentSetup][item.equipment?.slot];
        // Only include items that meet the condition
        if (item.equipment?.[statToUpgrade] > 0 && equippedItem && 
            item.equipment?.[statToUpgrade] >= equippedItem.equipment?.[statToUpgrade]) {
            for (let i = 0; i < statTypes.length; i++) {
                if (item.equipment?.[statTypes[i]] > equippedItem.equipment?.[statTypes[i]]) {
                    return true;
                }
            }
        }
    });
    console.log("UPGRADES", upgrades);
    // Prepare rows by flattening `equipment` attributes
    const preparedRows = upgrades.map((item) => {
        const price = item.has_price_data ? Math.round((item.high_price + item.low_price) / 2) : null;
        const activeSetup = setups[activeEquipmentSetup];
        const equippedItem = activeSetup[item.equipment?.slot];
        const equippedPrice = equippedItem?.has_price_data ? Math.round((equippedItem.high_price + equippedItem.low_price) / 2) : null;
      
        // Calculate differences
        const priceDifference = price && equippedPrice ? price - equippedPrice : null;
      
        const statDifferences = {
          stabAttack: equippedItem ? item.equipment?.attack_stab - equippedItem.equipment?.attack_stab : 0,
          slashAttack: equippedItem ? item.equipment?.attack_slash - equippedItem.equipment?.attack_slash : 0,
          crushAttack: equippedItem ? item.equipment?.attack_crush - equippedItem.equipment?.attack_crush : 0,
          magicAttack: equippedItem ? item.equipment?.attack_magic - equippedItem.equipment?.attack_magic : 0,
          rangedAttack: equippedItem ? item.equipment?.attack_ranged - equippedItem.equipment?.attack_ranged : 0,
          stabDefence: equippedItem ? item.equipment?.defence_stab - equippedItem.equipment?.defence_stab : 0,
          slashDefence: equippedItem ? item.equipment?.defence_slash - equippedItem.equipment?.defence_slash : 0,
          crushDefence: equippedItem ? item.equipment?.defence_crush - equippedItem.equipment?.defence_crush : 0,
          magicDefence: equippedItem ? item.equipment?.defence_magic - equippedItem.equipment?.defence_magic : 0,
          rangedDefence: equippedItem ? item.equipment?.defence_ranged - equippedItem.equipment?.defence_ranged : 0,
          strength: equippedItem ? item.equipment?.melee_strength - equippedItem.equipment?.melee_strength : 0,
          rangedStrength: equippedItem ? item.equipment?.ranged_strength - equippedItem.equipment?.ranged_strength : 0,
          magicDamage: equippedItem ? item.equipment?.magic_damage - equippedItem.equipment?.magic_damage : 0,
          prayer: equippedItem ? item.equipment?.prayer - equippedItem.equipment?.prayer : 0,
        };
      
        return {
          id: item.id, // Ensure `id` is unique
          icon: item.icon,
          name: item.name,
          ...statDifferences,
          gp: priceDifference,
          gpPerStabAttack: statDifferences.stabAttack !== 0 ? gpPer(statDifferences.stabAttack, priceDifference) : null,
          gpPerSlashAttack: statDifferences.slashAttack !== 0 ? gpPer(statDifferences.slashAttack, priceDifference) : null,
          gpPerCrushAttack: statDifferences.crushAttack !== 0 ? gpPer(statDifferences.crushAttack, priceDifference) : null,
          gpPerMagicAttack: statDifferences.magicAttack !== 0 ? gpPer(statDifferences.magicAttack, priceDifference) : null,
          gpPerRangedAttack: statDifferences.rangedAttack !== 0 ? gpPer(statDifferences.rangedAttack, priceDifference) : null,
          gpPerStabDefence: statDifferences.stabDefence !== 0 ? gpPer(statDifferences.stabDefence, priceDifference) : null,
          gpPerSlashDefence: statDifferences.slashDefence !== 0 ? gpPer(statDifferences.slashDefence, priceDifference) : null,
          gpPerCrushDefence: statDifferences.crushDefence !== 0 ? gpPer(statDifferences.crushDefence, priceDifference) : null,
          gpPerMagicDefence: statDifferences.magicDefence !== 0 ? gpPer(statDifferences.magicDefence, priceDifference) : null,
          gpPerRangedDefence: statDifferences.rangedDefence !== 0 ? gpPer(statDifferences.rangedDefence, priceDifference) : null,
          gpPerStrength: statDifferences.strength !== 0 ? gpPer(statDifferences.strength, priceDifference) : null,
          gpPerRangedStrength: statDifferences.rangedStrength !== 0 ? gpPer(statDifferences.rangedStrength, priceDifference) : null,
          gpPerMagicDamage: statDifferences.magicDamage !== 0 ? gpPer(statDifferences.magicDamage, priceDifference) : null,
          gpPerPrayer: statDifferences.prayer !== 0 ? gpPer(statDifferences.prayer, priceDifference) : null,
        };
    });
      

    setRows(preparedRows);
  }, [setups, activeEquipmentSetup, allSlotStats, statToUpgrade]);

  return (
    <Box style={{ 
      display: 'flex', 
      flexDirection: 'column',
      '--cell-negative-bg': !darkMode ? '#671d1d' : '#e69393', // red
      '--cell-positive-bg': !darkMode ? '#0a4d0a' : '#76e376', // green
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        sx={{
          '& .cell-negative': {
            color: 'var(--cell-negative-bg)',
          },
          '& .cell-positive': {
            color: 'var(--cell-positive-bg)',
          },
        }}
      />
    </Box>
  );
}