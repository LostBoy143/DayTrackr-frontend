import { Link } from 'react-router-dom'
import AttendanceCard from '../components/AttendanceCard.jsx'
import BackgroundDecor from '../components/BackgroundDecor.jsx'
import HeaderNav from '../components/HeaderNav.jsx'
import TaskCard from '../components/TaskCard.jsx'

function DashboardPage({
  user,
  attendance,
  onMarkPresent,
  taskSummary,
  tasks,
  onToggleTask,
  onDeleteTask,
  onSignOut,
}) {
  const recentTasks = tasks.slice(0, 3)

  return (
    <div
      className="min-h-screen bg-[#f7f5ef] text-slate-900"
      style={{ fontFamily: "Satoshi, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}
    >
      <BackgroundDecor />

      <header className="relative mx-auto max-w-[1200px] px-4 pt-4 sm:px-6 sm:pt-6 lg:px-10 lg:pt-8">
        <HeaderNav activeItem="dashboard" onSignOut={onSignOut} />
      </header>

      <main className="relative mx-auto max-w-[1200px] px-4 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-5 lg:px-10 lg:pb-12 lg:pt-6">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10">
          <section className="lg:col-span-7">
            <div className="rounded-3xl border border-emerald-100 bg-white/70 p-5 shadow-sm sm:p-7 lg:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p
                    className="text-sm font-semibold tracking-wide text-emerald-900/90"
                    style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
                  >
                    Dashboard
                  </p>
                  <h1
                    className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl"
                    style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
                  >
                    Welcome, {user?.name || 'Sam'}
                  </h1>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-700">
                    Today&apos;s plan at a glance - mark attendance once, then keep tasks moving.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2
                      className="text-xl font-extrabold text-slate-900"
                      style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
                    >
                      Today&apos;s attendance
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Status updates here help keep your day consistent.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onMarkPresent}
                    disabled={attendance.isPresent}
                    className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition sm:w-auto ${
                      attendance.isPresent
                        ? 'cursor-not-allowed bg-emerald-200 text-emerald-900/70'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200'
                    }`}
                  >
                    Mark present
                  </button>
                </div>

                <div className="mt-5">
                  <AttendanceCard isPresent={attendance.isPresent} time={attendance.time} />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2
                      className="text-xl font-extrabold text-slate-900"
                      style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
                    >
                      Task overview
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      A compact summary of what&apos;s on your plate today.
                    </p>
                  </div>

                  <Link
                    to="/tasks"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-100 transition hover:bg-emerald-100 sm:w-auto"
                  >
                    <iconify-icon icon="lucide:layout-list" className="text-[18px]" />
                    Open Task Board
                  </Link>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold tracking-wide text-slate-500">TOTAL</p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">{taskSummary.total}</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
                    <p className="text-xs font-semibold tracking-wide text-emerald-900/70">COMPLETED</p>
                    <p className="mt-1 text-2xl font-extrabold text-emerald-950">
                      {taskSummary.completed}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
                    <p className="text-xs font-semibold tracking-wide text-amber-900/70">PENDING</p>
                    <p className="mt-1 text-2xl font-extrabold text-amber-950">{taskSummary.pending}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-800">Recent tasks</h3>
                  <div className="mt-3 grid gap-3">
                    {recentTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={onToggleTask}
                        onDelete={onDeleteTask}
                        onSave={() => {}}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="space-y-4 lg:sticky lg:top-6">
              <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white/70 p-5 shadow-sm sm:p-6 lg:p-7">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/45 blur-2xl" />
                <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-amber-200/35 blur-2xl" />

                <div className="relative">
                  <h2
                    className="text-xl font-extrabold text-slate-900"
                    style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
                  >
                    Today&apos;s focus
                  </h2>
                  <p className="mt-1 text-sm text-slate-700">
                    A small nudge: aim for one meaningful completion before lunch.
                  </p>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100">
                          <iconify-icon icon="lucide:sun" className="text-[20px]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Morning block</p>
                          <p className="mt-0.5 text-sm leading-snug text-slate-600">
                            Pick one priority task and clear it.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-100">
                          <iconify-icon icon="lucide:coffee" className="text-[20px]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Break reminder</p>
                          <p className="mt-0.5 text-sm leading-snug text-slate-600">
                            Stand up after 60-90 minutes of focus.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-lime-50 text-lime-800 ring-1 ring-lime-100">
                          <iconify-icon icon="lucide:moon" className="text-[20px]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Wrap-up</p>
                          <p className="mt-0.5 text-sm leading-snug text-slate-600">
                            Close loops: update tasks before you log off.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                      onClick={onSignOut}
                    >
                      <iconify-icon icon="lucide:log-out" className="text-[18px]" />
                      Sign out
                    </button>
                    <Link
                      to="/tasks"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                    >
                      <iconify-icon icon="lucide:settings" className="text-[18px]" />
                      Open tasks
                    </Link>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Tip: Consistency beats intensity - one small win daily compounds.
                  </p>
                </div>
              </div>

              <div className="text-center text-xs text-slate-500">
                <p>
                  © <span className="font-medium">{new Date().getFullYear()}</span> DayTrackr. Built for
                  one user, one day at a time.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
