import { Box, Typography } from '@mui/material';
import { JournalEntry } from '../hooks/useJournal';

interface JournalPanelProps {
  mobile ?: boolean;
  journalEntries: JournalEntry[];
  journalText: string;
  setJournalText: (text: string) => void;
  selectedMood: 'good' | 'okay' | 'rough';
  setSelectedMood: (mood: 'good' | 'okay' | 'rough') => void;
  onSave: () => void;
  onDelete: (entryId: string) => void;
}

const MOOD_COLORS = {
  good: '#FF4151',
  okay: '#FFA500',
  rough: 'rgba(255,255,255,0.2)',
};

const MAX_CHARS = 500;
const LINE_COUNT = 6;

function formatEntryDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTodayFull(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function JournalPanel({
  mobile,
  journalEntries,
  journalText,
  setJournalText,
  selectedMood,
  setSelectedMood,
  onSave,
  onDelete,
}: JournalPanelProps) {
  return (
   <Box sx={{
  width: mobile ? '100%' : '400px',
  paddingRight: '25px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: mobile ? 'visible' : 'hidden',
}}>

      <Typography sx={{
        fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5,
      }}>
        Today's journal
      </Typography>

      {/* Mood selector */}
      <Box sx={{ display: 'flex', gap: '5px', mb: 1.5 }}>
        {(['good', 'okay', 'rough'] as const).map((mood) => (
          <Box
            key={mood}
            onClick={() => setSelectedMood(mood)}
            sx={{
              padding: '4px 10px', borderRadius: '20px',
              border: selectedMood === mood
                ? '0.5px solid rgba(255,65,81,0.3)'
                : '0.5px solid rgba(255,255,255,0.08)',
              background: selectedMood === mood
                ? 'rgba(255,65,81,0.12)'
                : 'rgba(255,255,255,0.04)',
              color: selectedMood === mood ? '#FF4151' : 'rgba(255,255,255,0.35)',
              fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
              textTransform: 'capitalize',
            }}
          >
            {mood}
          </Box>
        ))}
      </Box>

      {/* Paper */}
      <Box sx={{
        background: '#0d0d0c',
        borderRadius: '10px',
        border: '0.5px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        mb: 1.5,
      }}>
        {/* Date header */}
        <Box sx={{ padding: '10px 14px 0' }}>
          <Typography sx={{
            fontSize: 10, color: 'rgba(255,255,255,0.18)',
            
          }}>
            {formatTodayFull()}
          </Typography>
        </Box>
        <Box sx={{ height: '0.5px', background: 'rgba(255,255,255,0.05)', margin: '10px 0 0' }} />

        {/* Ruled lines + textarea */}
        <Box sx={{ position: 'relative', height: `${LINE_COUNT * 28}px`, padding: '0 14px' }}>
          {Array.from({ length: LINE_COUNT }).map((_, i) => (
            <Box key={i} sx={{
              position: 'absolute',
              left: 14, right: 14,
              top: (i + 1) * 28 - 1,
              height: '0.5px',
              background: 'rgba(255,255,255,0.04)',
            }} />
          ))}
          <Box
            component="textarea"
            value={journalText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (e.target.value.length <= MAX_CHARS) setJournalText(e.target.value);
            }}
            placeholder="Write about your day..."
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              width: '100%', height: '100%',
              background: 'none', border: 'none', outline: 'none',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 12.5, lineHeight: '28px',
              padding: '0 14px', resize: 'none',
               zIndex: 2,
              '&::placeholder': { color: 'rgba(255,255,255,0.15)'},
            }}
          />
        </Box>

        {/* Footer */}
        <Box sx={{
          padding: '8px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '0.5px solid rgba(255,255,255,0.04)',
        }}>
          <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>
            {journalText.length} / {MAX_CHARS}
          </Typography>
          <Box
            onClick={onSave}
            sx={{
              fontSize: 11, color: '#FF4151',
              border: '0.5px solid rgba(255,65,81,0.3)',
              borderRadius: '6px', padding: '4px 12px',
              cursor: 'pointer', transition: 'all 0.15s',
              '&:hover': { background: 'rgba(255,65,81,0.08)' },
            }}
          >
            Save entry
          </Box>
        </Box>
      </Box>

      {/* Past entries */}
      <Typography sx={{
        fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5,
      }}>
        Past entries
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', flex: 1 }}>
        {journalEntries.length === 0 ? (
          <Typography sx={{
            fontSize: 12, color: 'rgba(255,255,255,0.2)',
            padding: '8px 0' 
          }}>
            No entries yet
          </Typography>
        ) : (
          journalEntries.map((entry) => (
            <Box
  key={entry.id}
  sx={{
    background: '#141414', borderRadius: '7px',
    padding: '9px 11px',
    border: '0.5px solid transparent', transition: 'all 0.15s',
    '&:hover': {
      borderColor: 'rgba(255,255,255,0.06)',
      '& .delete-btn': { opacity: 1 },
    },
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: 0.5 }}>
    <Box sx={{
      width: 5, height: 5, borderRadius: '50%',
      backgroundColor: MOOD_COLORS[entry.mood] || MOOD_COLORS.rough,
      flexShrink: 0,
    }} />
    <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', flex: 1 }}>
      {formatEntryDate(entry.id)}
    </Typography>
    <Box
      className="delete-btn"
      onClick={(e) => {
        e.stopPropagation();
        onDelete(entry.id);
      }}
      sx={{
        opacity: 0, transition: 'opacity 0.15s',
        fontSize: 10, color: 'rgba(255,65,81,0.6)',
        cursor: 'pointer', padding: '0 2px',
        '&:hover': { color: '#FF4151' },
      }}
    >
      delete
    </Box>
  </Box>
              <Typography sx={{
                fontSize: 11, color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {entry.content}
              </Typography>
            </Box>
          ))
        )}
      </Box>

    </Box>
  );
}