# DayTrackr Frontend

A responsive React frontend for a daily productivity workflow that combines **attendance tracking** and **task management** in one place.

This project was built as an assignment and includes:
- Authentication (register/login)
- Protected routes
- Attendance marking for the current day
- Task CRUD (create, read, update, delete)
- Task filtering and sorting
- Toast feedback and form validation

## Live Purpose
DayTrackr helps a user start the day by marking attendance, then planning and completing tasks through a clean dashboard and task board.

## Tech Stack
- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 4
- Sonner (toast notifications)
- Iconify (icon web component)

## Project Structure

```text
src/
  components/
    AttendanceCard.jsx
    BackgroundDecor.jsx
    HeaderNav.jsx
    TaskCard.jsx
  lib/
    apiClient.js
    authApi.js
    attendanceApi.js
    taskApi.js
  pages/
    AuthPage.jsx
    DashboardPage.jsx
    TaskBoardPage.jsx
  App.jsx
  main.jsx
```

## Core Features

### 1) Authentication
- User can register with name, email, password.
- User can login with email and password.
- Basic client-side validation is implemented:
  - Valid email format
  - Password length (minimum 8)
  - Confirm password match (register flow)
- Auth state is persisted in `localStorage` using `daytrackr_auth`.

### 2) Protected Routes
- `/dashboard` and `/tasks` are protected.
- If not authenticated, user is redirected to `/` (auth page).

### 3) Attendance Tracking
- Loads attendance history for the logged-in user.
- Detects if attendance is already marked for the current date.
- Allows marking attendance once and displays marked time.

### 4) Task Management
- Fetches task list from backend.
- Create new tasks.
- Edit existing task title/description/status.
- Toggle completion status.
- Delete tasks.
- Shows task summary (total/completed/pending).
- Supports filter (`all`, `open`, `done`) and sort (`newest`, `alphabetical`).

### 5) UX and Feedback
- Toast messages for API success/error states.
- Responsive layout for auth, dashboard, and task board.
- Clean dashboard cards and quick navigation.

## Routing
- `/` -> Authentication page
- `/dashboard` -> Dashboard with attendance + task overview
- `/tasks` -> Full task board with add/edit/delete/filter/sort

## Environment Variables
Create a `.env` file in the project root:

```env
VITE_BASE_URL=https://api.anonx.space/api
```

`VITE_BASE_URL` should point to the backend API base URL.

## API Endpoints Used
The frontend expects the following backend routes:

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Attendance
- `POST /attendance/mark`
- `GET /attendance/me`

### Tasks
- `POST /task`
- `GET /task`
- `PUT /task/:taskId`
- `DELETE /task/:taskId`

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Running backend API compatible with the endpoints above

### Installation

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Assumptions
- Backend returns JSON responses with a `success` flag/message and optional `data`.
- Auth responses include a token used as Bearer token in protected requests.
- Task objects include `_id`, `title`, `description`, and `status` (`pending` or `completed`).

## Error Handling
- Missing API URL (`VITE_BASE_URL`) throws a clear startup/runtime error.
- Network failures and non-2xx API responses show readable messages.
- UI prevents repeated attendance marking while request is in progress.

## Assignment Notes
- The app focuses on practical, real-world frontend behavior: validation, protected navigation, async API integration, and feedback states.
- Code is modularized into pages, reusable components, and API helper modules.
- Design is responsive and optimized for readability and daily workflow usage.

## Future Improvements
- Add unit/integration tests.
- Add due dates and priorities for tasks.
- Add attendance calendar/history view.
- Add role-based auth and session expiry handling.

## Author
- Shubham Singh
