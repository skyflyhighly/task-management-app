# Task Manager Client

A React-based task management application built with Vite.

## Features

- Create, edit, and delete tasks
- Toggle task completion status
- Search tasks by title or description
- Filter tasks by status (All, Pending, Completed)
- Optimistic updates for instant UI feedback

## Prerequisites

- Node.js 18+
- [Task Server](../task-server) running on `http://localhost:3000`

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://127.0.0.1:5173`

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start development server     |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview production build     |
| `npm run lint`    | Run ESLint                   |
| `npm run cy:open` | Open Cypress test runner     |
| `npm run cy:run`  | Run Cypress tests headlessly |

## Testing

This project uses [Cypress](https://cypress.io) for end-to-end testing.

### Running E2E Tests

1. Start the backend server:

   ```bash
   cd ../task-server
   bin/rails server
   ```

2. Start the frontend dev server:

   ```bash
   npm run dev
   ```

3. Run Cypress tests:

   ```bash
   # Interactive mode
   npm run cy:open

   # Headless mode
   npm run cy:run
   ```

### Test Coverage

- Display and UI elements
- Task creation
- Task editing (double-click to edit)
- Task deletion
- Toggle completion status
- Filter by status
- Search functionality

## Project Structure

```
src/
├── api/            # API client for backend communication
├── components/     # Reusable UI components
│   ├── TaskFilter/ # Status filter and search input
│   ├── TaskForm/   # New task input form
│   ├── TaskItem/   # Individual task display
│   └── TaskList/   # Task list container
├── hooks/          # Custom React hooks
│   └── useTasks.js # Task state management
└── pages/          # Page components
    └── TasksPage/  # Main task manager page
```

## Tech Stack

- [React 19](https://react.dev)
- [Vite](https://vite.dev)
- [Cypress](https://cypress.io)
