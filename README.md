# StudyLoop

StudyLoop is an independent local study app inspired by common evidence-based study workflows. It is a clean implementation: it does not contain AcedIt source code, private account data, or AcedIt branding or artwork.

## Run locally

1. Install Node.js 20 or newer.
2. Open a terminal in this folder and run `node server.mjs` (or `npm.cmd start` in PowerShell).
3. Open <http://127.0.0.1:4173>.

There are no package dependencies to install. Study activity is saved in this browser on this computer. There is no account or cloud sync in this local edition.

## AI setup

Open **Settings → AI connection**, enter an Anthropic API key and model name, then save it. The key is held only in the local Node server's memory. It is never written to browser storage or a project file, and is cleared when the server stops. The default model is `claude-sonnet-4-6`; change it to any model available to your Anthropic account.

When you explicitly ask an AI tool to run, the selected prompt and any notes/answer you include are sent from this local server to Anthropic using your key. The provider may charge your account. Do not paste private or copyrighted material unless you have permission to process it with the provider.

Without a key, all non-AI study tools continue to work; AI actions explain how to connect one. Use the **Forget key** control to clear a configured key before closing the server.

## Included workflows

- Study dashboard, subjects and goals
- Pomodoro focus timer
- Active recall, spaced repetition, blurting, revision sessions and mind maps
- Notes-to-quiz and notes-to-flashcards generation
- AI study coach, explainers, essay planning, marking checklist, precision help and teach-back
- Daily planner, SAC tracking, progress and review history
- Local streaks, XP, and a private study circle view

This app is a learning prototype, not an official VCAA marking service or a replacement for teacher feedback. Generated feedback can be wrong.
