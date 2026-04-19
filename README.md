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
<img width="800" height="450" alt="ezgif-1ab3e14fde7b1ec2" src="https://github.com/user-attachments/assets/09fa1bb6-f2fd-4b10-82c5-39603a14c3de" />





## Habit Deletion and Creation
<img width="800" height="450" alt="ezgif-16b5c389eabe932b" src="https://github.com/user-attachments/assets/4c12b2c3-5ef2-4870-afd1-1dabb1199c89" />


## Note taking
<img width="800" height="450" alt="ezgif-1b3b3c5b21c6fc00" src="https://github.com/user-attachments/assets/d981bd47-ac1d-4e2d-8aff-fadcf1138e3a" />


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
