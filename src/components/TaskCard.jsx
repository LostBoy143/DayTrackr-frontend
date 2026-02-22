import { useState } from 'react'

function TaskCard({ task, onToggle, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)

  const saveEdit = async () => {
    if (!editTitle.trim()) return
    const saved = await Promise.resolve(onSave(task.id, editTitle, editDescription))
    if (saved === false) return
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="space-y-3">
          <input
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
          />
          <input
            value={editDescription}
            onChange={(event) => setEditDescription(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
            placeholder="Optional description"
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:w-auto"
              onClick={() => {
                setEditTitle(task.title)
                setEditDescription(task.description)
                setIsEditing(false)
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 sm:w-auto"
              onClick={saveEdit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex flex-1 items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-emerald-700 focus:ring-emerald-200"
          />
          <div className="min-w-0 flex-1">
            <p
              className={`break-words text-sm font-semibold ${
                task.completed ? 'text-slate-500 line-through' : 'text-slate-900'
              }`}
            >
              {task.title}
            </p>
            {task.description ? (
              <p className={`mt-1 break-words text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                {task.description}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-50"
            onClick={() => setIsEditing(true)}
          >
            <iconify-icon icon="lucide:edit" className="text-[18px]" />
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-50"
            onClick={() => onDelete(task.id)}
          >
            <iconify-icon icon="lucide:trash-2" className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
