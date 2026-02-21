import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AttendanceCard from '../components/AttendanceCard.jsx'
import BackgroundDecor from '../components/BackgroundDecor.jsx'
import HeaderNav from '../components/HeaderNav.jsx'
import TaskCard from '../components/TaskCard.jsx'

function TaskBoardPage({
  attendance,
  tasks,
  taskSummary,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onSignOut,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  const visibleTasks = useMemo(() => {
    let list = [...tasks]

    if (filter === 'open') {
      list = list.filter((task) => !task.completed)
    } else if (filter === 'done') {
      list = list.filter((task) => task.completed)
    }

    if (sort === 'alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title))
    }

    return list
  }, [filter, sort, tasks])

  const addTask = () => {
    onAddTask(title, description)
    setTitle('')
    setDescription('')
  }

  return (
    <div
      className="min-h-screen bg-[#f7f5ef] text-slate-900"
      style={{ fontFamily: "Satoshi, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}
    >
      <BackgroundDecor />

      <header className="relative mx-auto max-w-[1200px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-10 lg:pt-8">
        <HeaderNav activeItem="tasks" onSignOut={onSignOut} />
      </header>

      <main className="relative mx-auto max-w-[1200px] px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5 lg:px-10 lg:pb-12 lg:pt-6">
        <section className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-emerald-100 bg-white/70 p-5 shadow-sm sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xs font-semibold tracking-wide text-emerald-900/80"
                    style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
                  >
                    Today&apos;s focus
                  </p>
                  <h1
                    className="mt-2 text-2xl font-extrabold leading-tight text-slate-900"
                    style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
                  >
                    Task Board
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    Keep tasks small, explicit, and finishable. Mark done when you&apos;re truly
                    finished.
                  </p>
                </div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
                  <iconify-icon icon="lucide:check-square" className="text-[22px]" />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-900">Attendance</p>
                <p className="mt-1 text-sm text-slate-600">Quick check-in before you start.</p>
                <div className="mt-4">
                  <AttendanceCard isPresent={attendance.isPresent} time={attendance.time} />
                </div>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
              <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    className="text-lg font-extrabold text-slate-900"
                    style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
                  >
                    Add a task
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">Capture it now. Edit details later.</p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <button
                    type="button"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:w-auto"
                    onClick={() => {
                      setTitle('')
                      setDescription('')
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:w-auto"
                    onClick={addTask}
                  >
                    Add task
                    <iconify-icon icon="lucide:arrow-right" className="text-[18px]" />
                  </button>
                </div>
              </header>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="sm:col-span-7">
                  <label htmlFor="new-task-title" className="text-sm font-semibold text-slate-800">
                    Title
                  </label>
                  <input
                    id="new-task-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g., Send status update to Maya"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                  />
                </div>
                <div className="sm:col-span-5">
                  <label htmlFor="new-task-notes" className="text-sm font-semibold text-slate-800">
                    Description (optional)
                  </label>
                  <input
                    id="new-task-notes"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Context, link, or next step"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 ring-1 ring-emerald-100">
                    <iconify-icon icon="lucide:circle" className="text-[16px] text-emerald-700" />
                    <span>{taskSummary.pending} open</span>
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                    <iconify-icon icon="lucide:check-circle-2" className="text-[16px] text-slate-700" />
                    <span>{taskSummary.completed} done</span>
                  </span>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <button
                    type="button"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:w-auto"
                    onClick={() =>
                      setFilter((prev) => (prev === 'all' ? 'open' : prev === 'open' ? 'done' : 'all'))
                    }
                  >
                    <iconify-icon icon="lucide:filter" className="text-[18px]" />
                    Filter: {filter}
                  </button>
                  <button
                    type="button"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:w-auto"
                    onClick={() =>
                      setSort((prev) => (prev === 'newest' ? 'alphabetical' : 'newest'))
                    }
                  >
                    <iconify-icon icon="lucide:arrow-up-down" className="text-[18px]" />
                    Sort: {sort}
                  </button>
                </div>
              </div>

              <hr className="my-6 border-slate-200" />

              <div className="space-y-3">
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                    onSave={onUpdateTask}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col items-start gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © <span className="font-medium">{new Date().getFullYear()}</span> DayTrackr. Built for one
                user, one day at a time.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-500"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}

export default TaskBoardPage
