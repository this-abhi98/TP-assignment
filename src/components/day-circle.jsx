export const DayCircle = ({ active, label }) => (
  <div
    className={`
      grid h-9 w-9 place-items-center rounded-full text-sm font-semibold
      transition duration-200 ease-out
      ${
        active
          ? 'bg-slate-950 text-white shadow-md shadow-slate-900/20 ring-4'
          : 'bg-slate-100 text-slate-500 hover:bg-white hover:text-slate-950 hover:shadow-sm hover:ring-1 hover:ring-slate-200'
      }
    `}
  >
    {label}
  </div>
)
