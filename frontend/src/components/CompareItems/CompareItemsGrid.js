import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import clsx from 'clsx';


const statIcons = {
  'stabAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/dagger.23b640d2.png',
  'slashAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/scimitar.9ddfeb9e.png',
  'crushAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/warhammer.bf1e6866.png',
  'magicAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/magic.ea5daf44.png',
  'rangedAttack': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged.bee4115c.png',
  'stabDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/dagger.23b640d2.png',
  'slashDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/scimitar.9ddfeb9e.png',
  'crushDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/warhammer.bf1e6866.png',
  'magicDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/magic.ea5daf44.png',
  'rangedDefence': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged.bee4115c.png',
  'strength': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/strength.588608dd.png',
  'rangedStrength': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/ranged_strength.b19597e6.png',
  'magicDamage': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/magic_strength.3bfc40c9.png',
  'prayer': 'https://tools.runescape.wiki/osrs-dps/_next/static/media/prayer.2f027df7.png',
}


const permaColumns = [
  { field: 'icon', 
    headerName: 'Icon', 
    width: 60,
    editable: false, 
    sortable: false, 
    renderCell: (params) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%', // Ensures it fills the cell height
          width: '100%', // Ensures it fills the cell width
        }}
      >
        {params.value ? (
          <img
            src={params.value}
            alt="Icon"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain', // Prevents distortion
            }}
            onError={(e) => {
              e.target.style.display = 'none'; // Hide the image if it fails to load
            }}
          />
        ) : (
          <span>No Icon</span>
        )}
      </div>
    ),
  },
  { field: 'name', headerName: 'Name', width: 250, editable: false },
  buildStatColumn('stabAttack', 'Stab Attack'),
  buildStatColumn('slashAttack', 'Slash Attack'),
  buildStatColumn('crushAttack', 'Crush Attack'),
  buildStatColumn('magicAttack', 'Magic Attack'),
  buildStatColumn('rangedAttack', 'Ranged Attack'),
  buildStatColumn('stabDefence', 'Stab Defence'),
  buildStatColumn('slashDefence', 'Slash Defence'),
  buildStatColumn('crushDefence', 'Crush Defence'),
  buildStatColumn('magicDefence', 'Magic Defence'),
  buildStatColumn('rangedDefence', 'Ranged Defence'),
  buildStatColumn('strength', 'Strength'),
  buildStatColumn('rangedStrength', 'Ranged Strength'),
  buildStatColumn('magicDamage', 'Magic Damage'),
  buildStatColumn('prayer', 'Prayer'),
  {
    field: 'gp',
    headerName: 'GP',
    type: 'number',
    width: 90,
    editable: true,
    valueFormatter: (value) => {
      if (value == null) {
        return '-';
      }
      return getPriceString(value);
    },
  },
];


const extraColumns = {
  'meleeOffence': [
    buildStatCostColumn('gpPerStabAttack', 'GP/Stab'),
    buildStatCostColumn('gpPerCrushAttack', 'GP/Crush'),
    buildStatCostColumn('gpPerSlashAttack', 'GP/Slash'),
    buildStatCostColumn('gpPerStrength', 'GP/Strength'),
  ],
  'rangedOffence': [
    buildStatCostColumn('gpPerRangedAttack', 'GP/Ranged'),
    buildStatCostColumn('gpPerRangedStrength', 'GP/Ranged Str'),
  ],
  'magicOffence': [
    buildStatCostColumn('gpPerMagicAttack', 'GP/Magic Attack'),
    buildStatCostColumn('gpPerMagicDamage', 'GP/Magic Damage'),
  ],
  'defence': [
    buildStatCostColumn('gpPerStabDefence', 'GP/Stab Def'),
    buildStatCostColumn('gpPerCrushDefence', 'GP/Crush Def'),
    buildStatCostColumn('gpPerSlashDefence', 'GP/Slash Def'),
    buildStatCostColumn('gpPerMagicDefence', 'GP/Magic Def'),
    buildStatCostColumn('gpPerRangedDefence', 'GP/Ranged Def'),
  ],
};



function getPriceString(gp) {
  let price = ''
  if (gp <= 0) {
    price += '-'
  }
  else if (gp >= 1 && gp < 1000) {
    price += gp;
  } else if (gp >= 1000 && gp < 1000000) {
    price += (gp / 1000).toFixed(0) + 'k';
  } else if (gp >= 1000000 && gp < 1000000000) {
    price += (gp / 1000000).toFixed(1) + 'm';
  } else {
    price += (gp / 1000000000).toFixed(1) + 'b';
  }
  return price;
}

function gpPer(stat, gp) {
  if (!gp || !stat || stat <= 0) return null;
  return Math.round(gp / stat);
}

function buildStatCostColumn(newField, newHeaderName) {
  return {
    field: newField,
    headerName: newHeaderName,
    type: 'number',
    width: 90,
    editable: true,
    valueFormatter: (value) => {
      if (value == null) {
        return '-';
      }
      return getPriceString(value);
    },
  };
}

function buildStatColumn(newField, newHeaderName) {
  return { 
    field: newField, 
    type: 'number', 
    width: 54, 
    editable: false,
    valueFormatter: (value) => {
      let result = ''
      if (value > 0) {
        result += '+';
      }
      result += value;
      return result;
    },
    cellClassName: (params) =>
      clsx({
        'cell-negative': params.value < 0,
        'cell-positive': params.value > 0,
    }),
    renderHeader: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={statIcons[newField]} // Dynamically fetch the icon
          alt={newHeaderName}
          style={{ objectFit: 'contain' }}
        />
      </div>
    ),
  };
}



export default function CompareItemsGrid({ darkMode, allSlotStats, activeSlot, activeStatCategory }) {
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

  console.log("Active slot", activeSlot);
  console.log("Active cols", activeStatCategory);
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