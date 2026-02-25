# Todo Board

A responsive kanban-style todo list application built with React, TypeScript, Redux Toolkit, and FSD architecture.

## Features

- Add, edit, and remove tasks
- Add and delete columns
- Move tasks between columns (drag & drop)
- Mark tasks as complete/incomplete
- Select multiple tasks for bulk actions (delete, complete, incomplete, move)
- Select all tasks in a column
- Search tasks by name (with fuzzy match)
- Filter by completion status (all, completed, incomplete)
- Edit task text inline
- Persist data in localStorage
- Responsive design for desktop and mobile

## Tech Stack

- React 19
- TypeScript
- Redux Toolkit
- Vite
- i18next (react-i18next)
- @atlaskit/pragmatic-drag-and-drop

## Running locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

## Project structure (FSD)

```
src/
├── app/           # App config, store, providers
├── pages/         # Page components
├── widgets/       # Composite UI (TaskBoard, Column)
├── features/      # User interactions (search, filter, bulk-actions)
├── entities/      # Business entities (Task)
└── shared/        # UI components, utilities, config
```

## Demo

Deploy to Vercel/Netlify for a live demo.
