import { Box, Tooltip, Typography } from '@mui/material';

interface HeatMapProps {
  completionMap: Record<string, number>;
  totalHabits: number;
}

export default function HeatMap({ completionMap, totalHabits }: HeatMapProps) {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 0, 1);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: { date: Date; count: number }[][] = [];
  const monthLabels: { month: number; weekIndex: number }[] = [];
  const seenMonths = new Set<number>();

  let current = new Date(startDate);
  let weekIndex = 0;

  while (current <= today) {
    const week: { date: Date; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toLocaleDateString('en-CA');
      const isBeforeStart = current < new Date(today.getFullYear(), 0, 1);
      const count = current <= today && !isBeforeStart ? completionMap[dateStr] || 0 : -1;
      week.push({ date: new Date(current), count });
      const month = current.getMonth();
      if (current.getDate() <= 7 && !seenMonths.has(month)) {
        seenMonths.add(month);
        monthLabels.push({ month, weekIndex });
      }
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    weekIndex++;
  }

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function getColor(count: number) {
    if (count <= 0) return 'rgba(255,255,255,0.06)';
    const ratio = Math.min(count / Math.max(totalHabits, 1), 1);
    if (ratio <= 0.25) return 'rgba(255,65,81,0.25)';
    if (ratio <= 0.5) return 'rgba(255,65,81,0.5)';
    if (ratio <= 0.75) return 'rgba(255,65,81,0.75)';
    return '#FF4151';
  }

  return (
    <Box sx={{ backgroundColor: '#141414', borderRadius: '12px', padding: '20px', overflowX: 'auto', mt: 3 }}>
      <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 2 }}>
       
      </Typography>

      <Box sx={{ display: 'flex', marginLeft: '28px', marginBottom: '6px', position: 'relative', height: '16px' }}>
        {monthLabels.map(({ month, weekIndex: wi }) => (
          <Typography key={month} sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', position: 'absolute', left: wi * 15, whiteSpace: 'nowrap' }}>
            {monthNames[month]}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: '4px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: '6px' }}>
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
            <Box key={i} sx={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', height: '12px', lineHeight: '12px', width: '18px' }}>
              {label}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: '3px' }}>
          {weeks.map((week, wi) => (
            <Box key={wi} sx={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {week.map((cell, di) => (
                <Tooltip
                  key={di}
                  title={
                    cell.count < 0
                      ? ''
                      : cell.count === 0
                      ? `${cell.date.toLocaleDateString('en-CA')} — no completions`
                      : `${cell.date.toLocaleDateString('en-CA')} — ${cell.count} habit${cell.count !== 1 ? 's' : ''} completed`
                  }
                  placement="top"
                  arrow
                >
                  <Box sx={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: cell.count < 0 ? 'rgba(255,255,255,0.03)' : getColor(cell.count),
                    cursor: 'default',
                    '&:hover': { opacity: 0.8 },
                    transition: 'opacity 0.1s',
                  }} />
                </Tooltip>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: 1.5, justifyContent: 'flex-end' }}>
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Less</Typography>
        {['rgba(255,255,255,0.06)', 'rgba(255,65,81,0.25)', 'rgba(255,65,81,0.5)', 'rgba(255,65,81,0.75)', '#FF4151'].map((bg, i) => (
          <Box key={i} sx={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: bg }} />
        ))}
        <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>More</Typography>
      </Box>
    </Box>
  );
}
