# StudyLoop

StudyLoop is an independent, local-first study app. It does not include AcedIt source code, account data, branding, or artwork.

## Run locally

1. Install Node.js 20 or newer.
2. Open a terminal in this folder and run `npm install` once.
3. Run `npm run dev` and open the local URL printed in the terminal.

The frontend uses React and Vite. Study records live in this browser on this computer. Use Settings to export or restore a JSON backup.

## Workflows

- Personal dashboard, profile, and subject hubs
- User-created flashcards, active recall, and spaced repetition
- User-created quizzes, self-marked attempts, and a mistake review queue
- Pomodoro timer, blurting sessions, and editable mind maps
- Assessment dates, scheduled sessions, weekly intentions, and session targets
- Progress summaries based on saved sessions and quiz results
- AI tool pages and provider-key fields as UI scaffolding only; no prompts or keys are saved or transmitted

## Project structure

- src/App.jsx: React application shell, sidebar, and global header
- src/main.jsx: React/Vite entry point
- src/controllers/studyloop-controller.js: page navigation and study interactions
- src/store.js: local state loading, normalization, and persistence
- src/views.js: feature-view exports
- src/views/: dashboard, study, planner, quiz, and AI-scaffold pages
- src/domain/reviews.js: spaced-repetition scheduling
- src/ui/dialogs.js: shared accessible form dialog
- vite.config.js: local development server and production build configuration

Course areas, assessment weights, study materials, and results are entered by the learner. The app does not ship sample learner records or claim official VCAA marks.
