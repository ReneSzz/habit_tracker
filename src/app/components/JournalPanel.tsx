import { Box, Typography } from '@mui/material';
import { JournalEntry } from '../hooks/useJournal';

interface JournalPanelProps {
  journalEntries: JournalEntry[];
  journalText: string;
  setJournalText: (text: string) => void;
  selectedMood: 'good' | 'okay' | 'rough';
  setSelectedMood: (mood: 'good' | 'okay' | 'rough') => void;
  onSave: () => void;
}

const MOOD_COLORS = {
  good: '#FF4151',
  okay: '#FFA500',
  rough: 'rgba(255,255,255,0.2)',
};

const MAX_CHARS = 500;

function formatEntryDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function JournalPanel({
  journalEntries,
  journalText,
  setJournalText,
  selectedMood,
  setSelectedMood,
  onSave,
}: JournalPanelProps) {
  return (
    <Box sx={{
      width: '390px',
      flexShrink: 0,
      borderLeft: '0.5px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '20px',
    }}>

      <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
        Today's journal
      </Typography>

      {/* Mood selector */}
      <Box sx={{ display: 'flex', gap: '5px', mb: 1.5 }}>
        {(['good', 'okay', 'rough'] as const).map((mood) => (
          <Box
            key={mood}
            onClick={() => setSelectedMood(mood)}
            sx={{
              padding: '4px 10px',
              borderRadius: '20px',
              border: selectedMood === mood
                ? '0.5px solid rgba(255,65,81,0.3)'
                : '0.5px solid rgba(255,255,255,0.08)',
              background: selectedMood === mood
                ? 'rgba(255,65,81,0.12)'
                : 'rgba(255,255,255,0.04)',
              color: selectedMood === mood ? '#FF4151' : 'rgba(255,255,255,0.35)',
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.15s',
              textTransform: 'capitalize',
            }}
          >
            {mood}
          </Box>
        ))}
      </Box>

      {/* Text area */}
      <Box
        component="textarea"
        value={journalText}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (e.target.value.length <= MAX_CHARS) setJournalText(e.target.value);
        }}
        placeholder="How was your day..."
        sx={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          padding: '10px',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 12,
          lineHeight: 1.6,
          resize: 'none',
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          height: '110px',
          '&::placeholder': { color: 'rgba(255,255,255,0.2)' },
          '&:focus': { borderColor: 'rgba(255,65,81,0.3)' },
        }}
      />

      {/* Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
        <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
          {journalText.length} / {MAX_CHARS}
        </Typography>
        <Box
          onClick={onSave}
          sx={{
            fontSize: 11, color: '#FF4151',
            background: 'none',
            border: '0.5px solid rgba(255,65,81,0.3)',
            borderRadius: '6px', padding: '4px 12px',
            cursor: 'pointer', transition: 'all 0.15s',
            '&:hover': { background: 'rgba(255,65,81,0.08)' },
          }}
        >
          Save
        </Box>
      </Box>

      {/* Past entries */}
      <Typography sx={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5 }}>
        Past entries
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', flex: 1 }}>
        {journalEntries.length === 0 ? (
          <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', padding: '8px 0' }}>
            No entries yet
          </Typography>
        ) : (
          journalEntries.map((entry) => (
            <Box
              key={entry.id}
              sx={{
                background: '#141414',
                borderRadius: '7px',
                padding: '9px 11px',
                cursor: 'pointer',
                transition: 'background 0.15s',
                '&:hover': { background: '#1a1a1a' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: 0.5 }}>
                <Box sx={{
                  width: 5, height: 5, borderRadius: '50%',
                  backgroundColor: MOOD_COLORS[entry.mood] || MOOD_COLORS.rough,
                  flexShrink: 0,
                }} />
                <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                  {formatEntryDate(entry.id)}
                </Typography>
              </Box>
              <Typography sx={{
                fontSize: 11, color: 'rgba(255,255,255,0.5)',
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
