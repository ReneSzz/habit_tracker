import { Box, Modal, Typography } from '@mui/material';

interface AddHabitModalProps {
  open: boolean;
  onClose: () => void;
  habitTitle: string;
  setHabitTitle: (title: string) => void;
  onAdd: () => void;
}

const SUGGESTIONS = [
  'Meditate',
  'Drink 2L water',
  'No phone before bed',
  'Journal',
  'Cold shower',
  'Stretch',
];

export default function AddHabitModal({ open, onClose, habitTitle, setHabitTitle, onAdd }: AddHabitModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 440,
        backgroundColor: '#141414',
        borderRadius: '16px',
        border: '0.5px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        outline: 'none',
      }}>

        <Box sx={{ padding: '24px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#fff' }}>
              New habit
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', mt: 0.5 }}>
              Build a streak starting today
            </Typography>
          </Box>
          <Box
            onClick={onClose}
            sx={{
              width: 28, height: 28,
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 18,
              '&:hover': { background: 'rgba(255,255,255,0.1)' },
            }}
          >
            ×
          </Box>
        </Box>

        <Box sx={{ padding: '20px 24px' }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', mb: 1 }}>
            Habit name
          </Typography>
          <Box
            component="input"
            value={habitTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHabitTitle(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') onAdd(); }}
            placeholder="e.g. Morning run, Read 20 pages..."
            sx={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '12px 14px',
              color: '#fff',
              fontSize: 15,
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              mb: 2.5,
              '&::placeholder': { color: 'rgba(255,255,255,0.2)' },
              '&:focus': {
                borderColor: 'rgba(255,65,81,0.5)',
                background: 'rgba(255,65,81,0.04)',
              },
            }}
          />

          <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', mb: 1 }}>
            Suggestions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', mb: 2.5 }}>
            {SUGGESTIONS.map((s) => (
              <Box
                key={s}
                onClick={() => setHabitTitle(s)}
                sx={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  background: habitTitle === s ? 'rgba(255,65,81,0.15)' : 'rgba(255,255,255,0.05)',
                  border: habitTitle === s ? '0.5px solid rgba(255,65,81,0.4)' : '0.5px solid rgba(255,255,255,0.08)',
                  color: habitTitle === s ? '#FF4151' : 'rgba(255,255,255,0.45)',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': {
                    background: 'rgba(255,65,81,0.1)',
                    borderColor: 'rgba(255,65,81,0.3)',
                    color: '#FF4151',
                  },
                }}
              >
                {s}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ padding: '0 24px 24px', display: 'flex', gap: '10px' }}>
          <Box
            onClick={onClose}
            sx={{
              flex: 1, padding: '12px', borderRadius: '10px',
              border: '0.5px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)', fontSize: 14,
              cursor: 'pointer', textAlign: 'center',
              '&:hover': { background: 'rgba(255,255,255,0.04)' },
            }}
          >
            Cancel
          </Box>
          <Box
            onClick={onAdd}
            sx={{
              flex: 2, padding: '12px', borderRadius: '10px',
              background: '#FF4151', color: '#fff',
              fontSize: 14, fontWeight: 500,
              cursor: 'pointer', textAlign: 'center',
              transition: 'background 0.15s',
              '&:hover': { background: '#e0303f' },
            }}
          >
            Add habit
          </Box>
        </Box>

      </Box>
    </Modal>
  );
}
