import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Toaster, toast } from 'sonner'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TaskBoardPage from './pages/TaskBoardPage.jsx'
import { getMyAttendance, markAttendance } from './lib/attendanceApi'
import { createTask, deleteTaskById, getTasks, updateTaskById } from './lib/taskApi'

const AUTH_STORAGE_KEY = 'daytrackr_auth'

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
  }
]

function ProtectedRoute({ isAuthed, children }) {
  if (!isAuthed) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!saved) return null

    try {
      return JSON.parse(saved)
    } catch {
      return null
    }
  })
  const [attendance, setAttendance] = useState({ isPresent: false, time: '' })
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)

  const mapApiTaskToUiTask = (task) => ({
    id: task?._id || Date.now(),
    title: task?.title || 'Untitled task',
    description: task?.description || '',
    completed: task?.status === 'completed',
  })

  useEffect(() => {
    if (!user?.token) {
      setAttendance({ isPresent: false, time: '' })
      return
    }

    let cancelled = false

    const loadAttendance = async () => {
      try {
        const response = await getMyAttendance(user.token)
        const records = Array.isArray(response?.data) ? response.data : []
        const today = new Date().toISOString().slice(0, 10)
        const todaysRecords = records.filter((item) => item?.date === today)

        if (!todaysRecords.length) {
          if (!cancelled) {
            setAttendance({ isPresent: false, time: '' })
          }
          return
        }

        const latestRecord = todaysRecords.reduce((latest, current) => {
          const latestTime = Date.parse(latest?.createdAt || 0)
          const currentTime = Date.parse(current?.createdAt || 0)
          return currentTime > latestTime ? current : latest
        }, todaysRecords[0])

        const markedTime = latestRecord?.createdAt
          ? new Date(latestRecord.createdAt).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })
          : 'Marked'

        if (!cancelled) {
          setAttendance({ isPresent: true, time: markedTime })
        }
      } catch {
        if (!cancelled) {
          setAttendance({ isPresent: false, time: '' })
          toast.error('Could not load attendance history.')
        }
      }
    }

    loadAttendance()

    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (!user?.token) {
      setTasks(initialTasks)
      return
    }

    let cancelled = false

    const loadTasks = async () => {
      try {
        const response = await getTasks(user.token)
        const taskList = Array.isArray(response?.data) ? response.data : []
        const mappedTasks = taskList.map(mapApiTaskToUiTask)

        if (!cancelled) {
          setTasks(mappedTasks)
        }
      } catch {
        if (!cancelled) {
          toast.error('Could not load tasks.')
        }
      }
    }

    loadTasks()

    return () => {
      cancelled = true
    }
  }, [user])

  const taskSummary = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length

    return {
      total,
      completed,
      pending: total - completed,
    }
  }, [tasks])

  const addTask = async (title, description) => {
    if (!title.trim()) return false
    if (!user?.token) {
      toast.error('Session missing. Please login again.')
      return false
    }

    try {
      setIsCreatingTask(true)
      const response = await createTask(user.token, {
        title: title.trim(),
        description: description.trim(),
      })

      const newTask = response?.data
      setTasks((prev) => [
        mapApiTaskToUiTask(newTask || { title, description, status: 'pending' }),
        ...prev,
      ])

      toast.success(response?.message || 'Task created successfully')
      return true
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create task.')
      return false
    } finally {
      setIsCreatingTask(false)
    }
  }

  const updateTask = async (taskId, nextTitle, nextDescription, nextCompleted, options = {}) => {
    if (!user?.token) {
      toast.error('Session missing. Please login again.')
      return false
    }

    const currentTask = tasks.find((item) => item.id === taskId)
    if (!currentTask) {
      toast.error('Task not found locally.')
      return false
    }

    const payload = {
      title: (nextTitle ?? currentTask.title).trim(),
      description: (nextDescription ?? currentTask.description).trim(),
      status: (nextCompleted ?? currentTask.completed) ? 'completed' : 'pending',
    }

    try {
      const response = await updateTaskById(user.token, taskId, payload)
      const updatedTask = response?.data

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? mapApiTaskToUiTask(
                updatedTask || {
                  _id: task.id,
                  title: payload.title,
                  description: payload.description,
                  status: payload.status,
                }
              )
            : task
        )
      )

      if (!options.silentSuccess) {
        toast.success(response?.message || 'Task updated successfully')
      }
      return true
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update task.')
      return false
    }
  }

  const deleteTask = async (taskId) => {
    if (!user?.token) {
      toast.error('Session missing. Please login again.')
      return false
    }

    try {
      const response = await deleteTaskById(user.token, taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      toast.success(response?.message || 'Task deleted successfully')
      return true
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete task.')
      return false
    }
  }

  const toggleTask = async (taskId) => {
    const currentTask = tasks.find((item) => item.id === taskId)
    if (!currentTask) return
    await updateTask(taskId, undefined, undefined, !currentTask.completed, { silentSuccess: true })
  }

  const markPresent = async () => {
    if (attendance.isPresent || isMarkingAttendance) return
    if (!user?.token) {
      toast.error('Session missing. Please login again.')
      return
    }

    try {
      setIsMarkingAttendance(true)
      const response = await markAttendance(user.token)
      const createdAt = response?.data?.createdAt
      const markedAt = createdAt
        ? new Date(createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        : new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

      setAttendance({
        isPresent: true,
        time: markedAt,
      })

      toast.success(response?.message || `Attendance marked at ${markedAt}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not mark attendance.')
    } finally {
      setIsMarkingAttendance(false)
    }
  }

  const handleAuthSuccess = (authPayload) => {
    setUser(authPayload)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload))
    }
  }

  const signOut = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        closeButton
        duration={2600}
        toastOptions={{
          classNames: {
            toast: 'daytrackr-toast',
            title: 'daytrackr-toast-title',
            description: 'daytrackr-toast-description',
            success: 'daytrackr-toast-success',
            error: 'daytrackr-toast-error',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<AuthPage onAuthSuccess={handleAuthSuccess} user={user} />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthed={Boolean(user)}>
                <DashboardPage
                  user={user}
                  attendance={attendance}
                  onMarkPresent={markPresent}
                  isMarkingAttendance={isMarkingAttendance}
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
                  isCreatingTask={isCreatingTask}
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
    </>
  )
}

export default App
