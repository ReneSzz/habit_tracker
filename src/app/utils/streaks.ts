export function calculateStreak(completions: string[]): number {
  if (completions.length === 0) return 0;

  const sorted = [...new Set(completions)].sort().reverse();
  const today = new Date().toLocaleDateString('en-CA');
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toLocaleDateString('en-CA');

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].split('-').map(Number);
    const curr = sorted[i].split('-').map(Number);
    const prevDate = new Date(prev[0], prev[1] - 1, prev[2]);
    const currDate = new Date(curr[0], curr[1] - 1, curr[2]);
    const diff = Math.round(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
export function calculateAllTimeBest(completions: string[]): number {
  if (completions.length === 0) return 0;

  const sorted = [...new Set(completions)].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].split('-').map(Number);
    const curr = sorted[i].split('-').map(Number);
    const prevDate = new Date(prev[0], prev[1] - 1, prev[2]);
    const currDate = new Date(curr[0], curr[1] - 1, curr[2]);
    const diff = Math.round(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}
export function calculateWeeklyRate(completions: string[]): number {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-CA'));
  }
  const completionSet = new Set(completions);
  const completed = days.filter((d) => completionSet.has(d)).length;
  return Math.round((completed / 7) * 100);
}
