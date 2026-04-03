# Habit Tracker

A full-stack habit tracking app built with Next.js and Firebase. Track your daily habits, monitor streaks, visualize your completion history, and stay consistent.

**[Live Demo](https://habittracker-theta.vercel.app/)**


## Features

- **Authentication** — Secure email/password signup and login with Firebase Auth and protected routes
- **Habit management** — Create, complete, and delete habits with real-time Firestore sync
- **Daily reset** — Habits automatically reset each day, ready for a new streak
- **Streak tracking** — Consecutive day algorithm that calculates current and best streaks across a completion history
- **Weekly completion rate** — Tracks what percentage of habits you completed over the last 7 days
- **12-month heatmap** — GitHub-style contribution graph showing daily completion intensity across all habits
- **Dark theme** — Clean, minimal dark UI built with Material UI
---

## User Login Authentication
![login](https://github.com/user-attachments/assets/996f8dee-bd66-4369-aa54-982de5b97258)



## Habit Completion and Undo 
![ezgif-301c83c4833f3615](https://github.com/user-attachments/assets/7c54ec12-ea1e-4048-ac7f-2a751618c0d8)





## Habit Deletion and Creation
![add delete](https://github.com/user-attachments/assets/a0759a97-1448-4eff-a25c-2ac69dff3410)



---

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

When a habit is marked complete, a document is written to the `completions` subcollection using today's date as the document ID. Preventing duplicate entries for the same day.

On load, the streak algorithm:

1. Fetches all completion documents for each habit
2. Sorts dates in descending order
3. Checks if the most recent completion was today or yesterday (a streak is considered alive if completed yesterday but not yet today)
4. Walks backwards through dates — if two consecutive entries are exactly 1 day apart, the streak increments. If the gap is larger, it stops.



## License

MIT
