import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function navClass(active, target) {
  return `text-sm font-semibold transition-colors hover:text-slate-900 ${
    active === target ? 'text-slate-900' : 'text-slate-700'
  }`
}

function HeaderNav({ activeItem, onSignOut }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = () => {
    setMenuOpen(false)
    onSignOut()
    navigate('/')
  }

  return (
    <header className="relative border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
            <iconify-icon icon="lucide:calendar-check" className="text-[22px]" />
          </div>
          <div>
            <p
              className="text-sm font-semibold tracking-wide text-emerald-900/90"
              style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
            >
              DayTrackr
            </p>
            <p className="text-xs text-slate-600">Attendance + tasks</p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <iconify-icon icon={menuOpen ? 'lucide:x' : 'lucide:menu'} className="text-[20px]" />
        </button>
      </div>

      <nav className="hidden items-center gap-4 md:flex">
        <Link to="/dashboard" className={navClass(activeItem, 'dashboard')}>
          Dashboard
        </Link>
        <Link to="/tasks" className={navClass(activeItem, 'tasks')}>
          Tasks
        </Link>
        <button
          type="button"
          className="ml-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-100"
          onClick={handleSignOut}
        >
          <iconify-icon icon="lucide:log-out" className="text-[16px]" />
          Sign out
        </button>
      </nav>

      {menuOpen ? (
        <nav className="mt-4 grid gap-2 border-t border-slate-200 pt-4 md:hidden">
          <Link
            to="/dashboard"
            className={`rounded-xl px-3 py-3 text-sm font-semibold ${navClass(activeItem, 'dashboard')}`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/tasks"
            className={`rounded-xl px-3 py-3 text-sm font-semibold ${navClass(activeItem, 'tasks')}`}
            onClick={() => setMenuOpen(false)}
          >
            Tasks
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200 transition-colors hover:bg-emerald-100"
            onClick={handleSignOut}
          >
            <iconify-icon icon="lucide:log-out" className="text-[16px]" />
            Sign out
          </button>
        </nav>
      ) : null}
    </header>
  )
}

export default HeaderNav
