import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useMemo, useState } from 'react'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TaskBoardPage from './pages/TaskBoardPage.jsx'

const initialTasks = [
  {
    id: 1,
    title: 'Send status update to Maya',
    description: 'Share current sprint progress and blockers.',
    completed: false,
  },
  {
    id: 2,
    title: 'Book dentist appointment',
    description: 'Pick any free slot after 6 PM.',
    completed: false,
  },
  {
    id: 3,
    title: 'Draft product outline',
    description: '',
    completed: false,
  },
  {
    id: 4,
    title: 'Review pull requests',
    description: 'Prioritize urgent comments first.',
    completed: true,
  },
]

function ProtectedRoute({ isAuthed, children }) {
  if (!isAuthed) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const [user, setUser] = useState(null)
  const [attendance, setAttendance] = useState({ isPresent: false, time: '' })
  const [tasks, setTasks] = useState(initialTasks)

  const taskSummary = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length

    return {
      total,
      completed,
      pending: total - completed,
    }
  }, [tasks])

  const addTask = (title, description) => {
    if (!title.trim()) return

    setTasks((prev) => [
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        completed: false,
      },
      ...prev,
    ])
  }

  const updateTask = (taskId, nextTitle, nextDescription) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: nextTitle.trim(),
              description: nextDescription.trim(),
            }
          : task
      )
    )
  }

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    )
  }

  const markPresent = () => {
    const now = new Date()
    setAttendance({
      isPresent: true,
      time: now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    })
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<AuthPage onAuthSuccess={setUser} user={user} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthed={Boolean(user)}>
              <DashboardPage
                user={user}
                attendance={attendance}
                onMarkPresent={markPresent}
                tasks={tasks}
                taskSummary={taskSummary}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onSignOut={signOut}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute isAuthed={Boolean(user)}>
              <TaskBoardPage
                attendance={attendance}
                tasks={tasks}
                taskSummary={taskSummary}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateTask={updateTask}
                onSignOut={signOut}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
