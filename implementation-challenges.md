# Challenges Feature - Frontend Implementation Plan

## Stack
React 19, TypeScript, Vite, TanStack Query, React Router, Zustand, Tailwind v4, Axios

## Requirements
- Text-based challenges, 4 weeks × 7 days
- Routes: /weeks, /weeks/:id, /challenges/:id, /attempts/:id, leaderboard, dashboard updates
- Daily unlock logic reflected from API
- Start attempt, autosave answer, submit, poll/view result
- Leaderboard weekly/all-time, progress/streak/badges
- Auth required for attempts

## Phases
1. API types & client methods (weeks, challenges, attempts, scoring, leaderboard)
2. Routes & navigation (replace ComingSoon for challenge with proper routes)
3. Weeks/calendar page
4. Week detail with challenges list (locked/unlocked, status)
5. Challenge detail page (start, answer form by type)
6. Attempt result/status page with polling
7. Leaderboard page
8. Dashboard updates (progress/streak/badges)
9. UI polish, loading/error states

## Change Log

[Start]
Thought: Added API client methods for challenges feature.
---
Thought: Created challenges pages (weeks, week detail, challenge detail with start/answer/submit, attempt status with polling, leaderboard).
---
Thought: Updated router to add challenges routes and point /challenge to weeks page. Added imports.
---
Thought: TypeScript compiles cleanly.
---
