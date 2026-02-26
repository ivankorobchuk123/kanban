# Rec: Tasks

A responsive kanban-style task management application built with React, TypeScript, Redux Toolkit, and FSD architecture.

## Features

- Add, edit, and remove tasks
- Add and delete columns
- Move tasks between columns (drag & drop)
- Reorder columns (drag & drop)
- Mark tasks as complete/incomplete
- Assign tasks to users
- Add comments to tasks
- Archive completed or canceled tasks
- Toggle visibility of completed tasks per column
- Select multiple tasks for bulk actions (delete, complete, incomplete, move)
- Select all tasks in a column
- Search tasks by name (with fuzzy match)
- Filter columns by status
- Edit task text inline

## Tech Stack

- React 19
- TypeScript 5.9 (strict)
- Redux Toolkit 2
- Vite 7
- i18next + react-i18next
- @atlaskit/pragmatic-drag-and-drop
- SCSS Modules
- Vitest

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Type-check + production build
npm run preview      # Preview production build
npm test             # Run tests (single run)
npm run test:watch   # Run tests in watch mode
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
```

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Docker

```bash
# Build image
docker build -t rec-man .

# Run on port 3000
docker run -p 3000:80 rec-man
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure (FSD)

```
src/
├── app/           # Redux store, providers, slices, selectors
├── pages/         # Route-level pages
├── widgets/       # Composite UI (TaskBoard, Column, Card, HeaderBoard)
├── features/      # User interactions (search, filter, addTask, addColumn)
├── entities/      # Business entities (Task)
└── shared/        # UI components, utilities, hooks, i18n config
```
