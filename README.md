# Habit Tracker

A full-stack habit tracking app built with Next.js and Firebase. Track your daily habits, monitor streaks, visualize your completion history, and stay consistent.

**[Live Demo](https://habittracker-theta.vercel.app/)**
![ezgif-2e798b6ff8ba61f5](https://github.com/user-attachments/assets/c596dad8-f9ba-4963-971d-c4c0ac552d6e)

---


---

## Features

- **Authentication** — Secure email/password signup and login with Firebase Auth and protected routes
- **Habit management** — Create, complete, and delete habits with real-time Firestore sync
- **Daily reset** — Habits automatically reset each day, ready for a new streak
- **Streak tracking** — Consecutive day algorithm that calculates current and best streaks across a completion history
- **Weekly completion rate** — Tracks what percentage of habits you completed over the last 7 days
- **12-month heatmap** — GitHub-style contribution graph showing daily completion intensity across all habits
- **Dark theme** — Clean, minimal dark UI built with Material UI

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript |
| UI | Material UI (MUI), Inter font |
| Backend / Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Deployment | Vercel |


Each habit stores its completion history as a subcollection. This allows the streak algorithm to walk backwards through dates and calculate consecutive completion streaks without storing redundant data on the habit document itself.

## How Streak Tracking Works

When a habit is marked complete, a document is written to the `completions` subcollection using today's date as the document ID. This naturally prevents duplicate entries for the same day.

On load, the streak algorithm:

1. Fetches all completion documents for each habit
2. Sorts dates in descending order
3. Checks if the most recent completion was today or yesterday (a streak is considered alive if completed yesterday but not yet today)
4. Walks backwards through dates — if two consecutive entries are exactly 1 day apart, the streak increments. If the gap is larger, it stops.



- [ ] Per-habit heatmap view
- [ ] Push notifications / reminders
- [ ] Habit categories and filtering
- [ ] Export completion history as CSV
- [ ] Mobile app (React Native)

## License

MIT
