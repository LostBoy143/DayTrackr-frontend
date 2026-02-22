import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import BackgroundDecor from '../components/BackgroundDecor.jsx'
import { loginUser, registerUser } from '../lib/authApi'

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
}

function AuthPage({ onAuthSuccess, user }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [touched, setTouched] = useState({})
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    remember: true,
  })
  const [alert, setAlert] = useState({ kind: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate, user])

  const requiredFields = mode === 'login' ? ['email', 'password'] : ['name', 'email', 'password', 'confirm']

  const fieldState = useMemo(
    () => ({
      name: !touched.name
        ? { status: 'idle', message: 'This helps personalize your dashboard.' }
        : values.name.trim().length >= 2
          ? { status: 'success', message: 'Looks good.' }
          : { status: 'error', message: 'Please enter your name (at least 2 characters).' },
      email: !touched.email
        ? { status: 'idle', message: "We'll never share your email." }
        : isEmail(values.email)
          ? { status: 'success', message: 'Email looks valid.' }
          : { status: 'error', message: 'Enter a valid email address (e.g., you@company.com).' },
      password: !touched.password
        ? { status: 'idle', message: 'Use at least 8 characters.' }
        : values.password.trim().length >= 8
          ? { status: 'success', message: 'Strong enough.' }
          : { status: 'error', message: 'Password must be at least 8 characters.' },
      confirm: !touched.confirm
        ? { status: 'idle', message: 'Type the same password again.' }
        : !values.confirm.trim()
          ? { status: 'error', message: 'Please re-enter your password.' }
          : values.confirm === values.password
            ? { status: 'success', message: 'Passwords match.' }
            : { status: 'error', message: 'Passwords do not match.' },
    }),
    [touched, values]
  )

  const hasError = requiredFields.some((field) => fieldState[field].status === 'error')
  const anyTouched = requiredFields.some((field) => touched[field])

  const submit = async (event) => {
    event.preventDefault()
    const nextTouched = {}
    requiredFields.forEach((field) => {
      nextTouched[field] = true
    })
    setTouched((prev) => ({ ...prev, ...nextTouched }))

    const hasFormError = requiredFields.some((field) => {
      if (field === 'name') return values.name.trim().length < 2
      if (field === 'email') return !isEmail(values.email)
      if (field === 'password') return values.password.trim().length < 8
      if (field === 'confirm') return values.confirm !== values.password || !values.confirm.trim()
      return false
    })

    if (hasFormError) {
      setAlert({ kind: 'error', message: 'Please fix the highlighted fields and try again.' })
      return
    }

    try {
      setIsSubmitting(true)
      const response =
        mode === 'login'
          ? await loginUser({
              email: values.email.trim(),
              password: values.password,
            })
          : await registerUser({
              name: values.name.trim(),
              email: values.email.trim(),
              password: values.password,
            })

      const authData = response?.data || {}
      const fallbackName = values.email.trim().split('@')[0] || 'User'

      onAuthSuccess({
        userId: authData.userId,
        name: authData.name || (mode === 'register' ? values.name.trim() : fallbackName),
        email: values.email.trim(),
        token: authData.token,
      })

      setAlert({
        kind: 'success',
        message:
          response?.message ||
          (mode === 'login' ? 'Logged in successfully.' : 'Account created successfully.'),
      })
      toast.success(
        mode === 'login'
          ? `Welcome back, ${authData.name || fallbackName}`
          : `Account created for ${authData.name || values.name.trim()}`
      )

      navigate('/dashboard')
    } catch (error) {
      setAlert({
        kind: 'error',
        message:
          error instanceof Error
            ? error.message
            : mode === 'login'
              ? 'Login failed. Please try again.'
              : 'Registration failed. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (status) =>
    `mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition ${
      status === 'error'
        ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-200'
        : status === 'success'
          ? 'border-emerald-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200'
          : 'border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200'
    }`

  const iconName = (status) => {
    if (status === 'error') return 'lucide:alert-circle'
    if (status === 'success') return 'lucide:check-circle-2'
    return ''
  }

  return (
    <div
      className="min-h-screen bg-[#f7f5ef] text-slate-900"
      style={{ fontFamily: "Satoshi, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}
    >
      <BackgroundDecor />

      <main className="relative mx-auto flex min-h-screen max-w-[1200px] items-stretch px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="grid w-full grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          <section className="relative hidden overflow-hidden rounded-3xl border border-emerald-100 bg-white/70 p-6 shadow-sm md:flex md:flex-col md:p-8 lg:p-10">
            <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-emerald-200/45 blur-2xl" />
            <div className="absolute -left-24 bottom-8 h-64 w-64 rounded-full bg-amber-200/35 blur-2xl" />

            <header className="relative">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-700 text-white shadow-sm">
                  <iconify-icon icon="lucide:calendar-check" className="text-[22px]" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wide text-emerald-900/90" style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}>
                    DayTrackr
                  </p>
                  <p className="text-xs text-slate-600">Attendance + tasks, in one place</p>
                </div>
              </div>

              <h1
                className="mt-6 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl"
                style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
              >
                A calmer way to start (and finish) your day.
              </h1>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-700">
                Mark attendance once a day, then keep your tasks tidy with a simple, personal board. That&apos;s it.
              </p>
            </header>

            <img
              src="/Team-goals-bro.svg"
              alt="Team working on shared goals illustration"
              className="relative mt-16 h-[220px] w-full object-contain sm:mt-20 sm:h-[260px] lg:mt-24 lg:h-[300px]"
            />
          </section>

          <section className="relative flex items-center">
            <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}>
                      {mode === 'login' ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {mode === 'login'
                        ? 'Sign in to mark attendance and keep tasks moving.'
                        : 'A calm, simple space to track your day - attendance plus tasks.'}
                    </p>
                  </div>

                  <div className="w-full rounded-2xl bg-emerald-50 p-1 ring-1 ring-emerald-100 sm:w-auto">
                    <div className="grid grid-cols-2 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login')
                          setTouched({})
                          setAlert({ kind: '', message: '' })
                        }}
                        className={`inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold leading-none sm:gap-2 sm:px-4 ${
                          mode === 'login'
                            ? 'bg-white text-emerald-950 shadow-sm ring-1 ring-emerald-200'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <iconify-icon icon="lucide:log-in" className="text-[16px]" />
                        Sign in
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('register')
                          setTouched({})
                          setAlert({ kind: '', message: '' })
                        }}
                        className={`inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold leading-none sm:gap-2 sm:px-5 ${
                          mode === 'register'
                            ? 'bg-white text-emerald-950 shadow-sm ring-1 ring-emerald-200'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <iconify-icon icon="lucide:user-plus" className="text-[16px]" />
                        Create
                      </button>
                    </div>
                  </div>
                </div>

                {alert.message ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      alert.kind === 'error'
                        ? 'border-rose-200 bg-rose-50 text-rose-900'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    }`}
                  >
                    {alert.message}
                  </div>
                ) : null}

                <form className="space-y-5" noValidate onSubmit={submit}>
                  {mode === 'register' ? (
                    <div>
                      <label htmlFor="name" className="text-sm font-semibold text-slate-800">
                        Full name
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          value={values.name}
                          onChange={(event) =>
                            setValues((prev) => ({ ...prev, name: event.target.value }))
                          }
                          onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                          placeholder="e.g., Sam Rivera"
                          className={inputClass(fieldState.name.status)}
                        />
                        {iconName(fieldState.name.status) ? (
                          <iconify-icon
                            icon={iconName(fieldState.name.status)}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600"
                          />
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{fieldState.name.message}</p>
                    </div>
                  ) : null}

                  <div>
                    <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(event) =>
                          setValues((prev) => ({ ...prev, email: event.target.value }))
                        }
                        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                        placeholder="you@company.com"
                        className={inputClass(fieldState.email.status)}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{fieldState.email.message}</p>
                  </div>

                  <div>
                    <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={(event) =>
                        setValues((prev) => ({ ...prev, password: event.target.value }))
                      }
                      onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                      placeholder="At least 8 characters"
                      className={inputClass(fieldState.password.status)}
                    />
                    <p className="mt-1 text-xs text-slate-500">{fieldState.password.message}</p>
                  </div>

                  {mode === 'register' ? (
                    <div>
                      <label htmlFor="confirm" className="text-sm font-semibold text-slate-800">
                        Confirm password
                      </label>
                      <input
                        id="confirm"
                        name="confirm"
                        type="password"
                        value={values.confirm}
                        onChange={(event) =>
                          setValues((prev) => ({ ...prev, confirm: event.target.value }))
                        }
                        onBlur={() => setTouched((prev) => ({ ...prev, confirm: true }))}
                        placeholder="Re-enter your password"
                        className={inputClass(fieldState.confirm.status)}
                      />
                      <p className="mt-1 text-xs text-slate-500">{fieldState.confirm.message}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          id="remember"
                          name="remember"
                          type="checkbox"
                          checked={values.remember}
                          onChange={(event) =>
                            setValues((prev) => ({ ...prev, remember: event.target.checked }))
                          }
                          className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-200"
                        />
                        <label htmlFor="remember" className="text-sm text-slate-700">
                          Remember me
                        </label>
                      </div>

                      <a href="#" className="w-fit text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-500">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={(anyTouched && hasError) || isSubmitting}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition ${
                      (anyTouched && hasError) || isSubmitting
                        ? 'cursor-not-allowed bg-emerald-200 text-emerald-900/70'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200'
                    }`}
                  >
                    {isSubmitting ? 'Creating account...' : mode === 'login' ? 'Sign in' : 'Create account'}
                    <iconify-icon icon="lucide:arrow-right" className="text-[18px]" />
                  </button>

                  <div className="pt-1">
                    <p className="text-xs font-semibold tracking-wide text-slate-500">Quick links</p>
                    <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                      <Link
                        to="/dashboard"
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-500"
                      >
                        <iconify-icon icon="lucide:layout-dashboard" className="text-[16px]" />
                        Dashboard
                      </Link>
                      <Link
                        to="/tasks"
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-500"
                      >
                        <iconify-icon icon="lucide:kanban" className="text-[16px]" />
                        Task Board
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AuthPage
