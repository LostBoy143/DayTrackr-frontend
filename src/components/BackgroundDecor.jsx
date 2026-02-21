function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-lime-200/25 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] [background-size:18px_18px] opacity-30" />
    </div>
  )
}

export default BackgroundDecor
