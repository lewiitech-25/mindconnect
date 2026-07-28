import { FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa'

const moodConfig = {
  Happy: { emoji: '😀', colorClass: 'border-yellow-200 bg-yellow-50/50 text-yellow-700' },
  Good: { emoji: '🙂', colorClass: 'border-emerald-200 bg-emerald-50/50 text-emerald-700' },
  Okay: { emoji: '😐', colorClass: 'border-blue-200 bg-blue-50/50 text-blue-700' },
  Stressed: { emoji: '😟', colorClass: 'border-orange-200 bg-orange-50/50 text-orange-700' },
  Sad: { emoji: '😢', colorClass: 'border-indigo-200 bg-indigo-50/50 text-indigo-700' }
}

export default function MoodCard({ mood, date, note }) {
  const config = moodConfig[mood] || { emoji: '📝', colorClass: 'border-slate-200 bg-slate-50 text-slate-700' }
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${config.colorClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl filter drop-shadow-sm select-none" role="img" aria-label={mood}>
            {config.emoji}
          </span>
          <div>
            <h4 className="font-poppins text-sm font-bold uppercase tracking-wider">{mood}</h4>
            <div className="flex items-center space-x-1 text-slate-500 text-xs mt-0.5">
              <FaCalendarAlt size={10} className="shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
      {note && (
        <div className="mt-3 text-slate-600 text-sm flex items-start space-x-2 border-t border-slate-100/50 pt-2.5">
          <FaQuoteLeft size={10} className="text-slate-400 mt-1 shrink-0" />
          <p className="italic leading-relaxed font-sans">{note}</p>
        </div>
      )}
    </div>
  )
}
