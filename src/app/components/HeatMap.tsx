import { useState } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

interface HeatMapProps {
  completionMap: Record<string, number>;
  completionNamesMap: Record<string, string[]>;
  totalHabits: number;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function HeatMap({ completionMap, completionNamesMap, totalHabits }: HeatMapProps) {
  // 0 = current month, 1 = last month, and so on
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-CA');

  const viewMonth = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = viewMonth.getDay(); // 0 = Sunday

  // null = empty spacer cell before the 1st of the month
  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function getColor(count: number) {
    if (count <= 0) return 'rgba(255,255,255,0.06)';
    const ratio = Math.min(count / Math.max(totalHabits, 1), 1);
    if (ratio <= 0.25) return 'rgba(255,65,81,0.25)';
    if (ratio <= 0.5) return 'rgba(255,65,81,0.5)';
    if (ratio <= 0.75) return 'rgba(255,65,81,0.75)';
    return '#FF4151';
  }

  const navButtonSx = {
    color: 'rgba(255,255,255,0.6)',
    width: 28,
    height: 28,
    fontSize: 18,
    lineHeight: 1,
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
    '&.Mui-disabled': { color: 'rgba(255,255,255,0.15)' },
  };

  return (
    <Box
      sx={{
        backgroundColor: '#141414',
        borderRadius: '12px',
        padding: '20px',
        mt: 3,
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 360,
        overflow: 'hidden',
      }}
    >
      {/* Month header with navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton
          size="small"
          aria-label="Previous month"
          onClick={() => setMonthOffset((o) => o + 1)}
          sx={navButtonSx}
        >
          ‹
        </IconButton>
        <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
          {monthLabel}
        </Typography>
        <IconButton
          size="small"
          aria-label="Next month"
          disabled={monthOffset === 0}
          onClick={() => setMonthOffset((o) => Math.max(o - 1, 0))}
          sx={navButtonSx}
        >
          ›
        </IconButton>
      </Box>

      {/* Weekday labels */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', mb: '4px' }}>
        {WEEKDAYS.map((label, i) => (
          <Box
            key={i}
            sx={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}
          >
            {label}
          </Box>
        ))}
      </Box>

      {/* Day grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {cells.map((date, i) => {
          if (!date) return <Box key={`blank-${i}`} />;

          const dateStr = date.toLocaleDateString('en-CA');
          const isFuture = date > today && dateStr !== todayStr;
          const count = isFuture ? -1 : completionMap[dateStr] || 0;
          const names = completionNamesMap[dateStr];

          const tooltipContent = isFuture ? (
            ''
          ) : !names || names.length === 0 ? (
            `${dateStr}: no completions`
          ) : (
            <Box>
              <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>
                {dateStr}
              </Typography>
              {names.map((name) => (
                <Box
                  key={name}
                  sx={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '1px 0' }}
                >
                  <Box
                    sx={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      backgroundColor: '#FF4151',
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ fontSize: 11, color: '#fff' }}>{name}</Typography>
                </Box>
              ))}
            </Box>
          );

          return (
            <Tooltip key={dateStr} placement="top" arrow title={tooltipContent}>
              <Box
                sx={{
                  aspectRatio: '1 / 1',
                  borderRadius: '4px',
                  backgroundColor: isFuture ? 'rgba(255,255,255,0.03)' : getColor(count),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: isFuture ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.55)',
                  cursor: 'default',
                  transition: 'opacity 0.1s',
                  '&:hover': { opacity: 0.8 },
                  outline: dateStr === todayStr ? '1px solid rgba(233,230,230,0.35)' : 'none',
                  outlineOffset: '1px',
                }}
              >
                {date.getDate()}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: 2, justifyContent: 'flex-end' }}>
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Less</Typography>
        {[
          'rgba(255,255,255,0.06)',
          'rgba(255,65,81,0.25)',
          'rgba(255,65,81,0.5)',
          'rgba(255,65,81,0.75)',
          '#FF4151',
        ].map((bg, i) => (
          <Box key={i} sx={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: bg }} />
        ))}
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>More</Typography>
      </Box>
    </Box>
  );
}