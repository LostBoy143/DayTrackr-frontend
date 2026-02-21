function AttendanceCard({ isPresent, time }) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        isPresent ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={isPresent ? 'text-sm text-emerald-900/70' : 'text-sm text-amber-900/70'}>
            Today&apos;s attendance
          </p>
          <h3
            className={isPresent ? 'mt-2 text-2xl font-extrabold text-emerald-900' : 'mt-2 text-2xl font-extrabold text-amber-900'}
            style={{ fontFamily: "'Cabinet Grotesk', Satoshi, ui-sans-serif" }}
          >
            {isPresent ? 'Marked present' : 'Not marked'}
          </h3>
          <p className={isPresent ? 'mt-2 text-sm text-emerald-800' : 'mt-2 text-sm text-amber-800'}>
            {isPresent ? `Marked at ${time}` : 'Check-in pending'}
          </p>
        </div>
        <div
          className={`grid h-20 w-20 place-items-center rounded-2xl ${
            isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          <iconify-icon
            icon={isPresent ? 'lucide:check-circle-2' : 'lucide:circle-dashed'}
            className="text-[40px]"
          />
        </div>
      </div>
    </div>
  )
}

export default AttendanceCard
