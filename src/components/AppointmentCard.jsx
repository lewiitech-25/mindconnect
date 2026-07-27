import { FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, FaUserMd, FaTimes } from 'react-icons/fa'

export default function AppointmentCard({ appointment, onCancel }) {
  const { id, counselorName, date, timeSlot, mode, status } = appointment

  const getModeIcon = () => {
    return mode === 'Online Video' ? (
      <span className="inline-flex items-center space-x-1 text-primary bg-primary/5 px-2.5 py-1 rounded-lg text-xs font-semibold">
        <FaVideo size={10} />
        <span>Online</span>
      </span>
    ) : (
      <span className="inline-flex items-center space-x-1 text-secondary bg-secondary/5 px-2.5 py-1 rounded-lg text-xs font-semibold">
        <FaMapMarkerAlt size={10} />
        <span>In Person</span>
      </span>
    )
  }

  return (
    <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header - Counselor Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-primary">
              <FaUserMd className="text-xl" />
            </div>
            <div>
              <h4 className="font-poppins font-semibold text-text-custom leading-tight">{counselorName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Licensed Counselor</p>
            </div>
          </div>

          <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 uppercase tracking-wide">
            {status || 'Confirmed'}
          </span>
        </div>

        {/* Date and Time Info */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <div className="flex items-center space-x-2 text-slate-600 text-xs">
            <FaCalendarAlt className="text-slate-400 shrink-0" size={12} />
            <span className="font-medium text-slate-700">{date}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 text-xs">
            <FaClock className="text-slate-400 shrink-0" size={12} />
            <span className="font-medium text-slate-700">{timeSlot}</span>
          </div>
        </div>
      </div>

      {/* Mode & Actions */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-5">
        {getModeIcon()}

        {onCancel && (
          <button
            onClick={() => onCancel(id)}
            className="inline-flex items-center space-x-1 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <FaTimes size={10} />
            <span>Cancel Session</span>
          </button>
        )}
      </div>
    </div>
  )
}
