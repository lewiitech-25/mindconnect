import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaCalendarCheck, FaCalendarPlus, FaInfoCircle } from 'react-icons/fa'
import AppointmentCard from '../components/AppointmentCard'

export default function Appointments() {
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('studentUser')
    if (!storedUser) {
      navigate('/login')
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    const loadAppts = () => {
      const stored = localStorage.getItem(`appointments_${parsedUser.email}`)
      setAppointments(stored ? JSON.parse(stored) : [])
    }
    loadAppts()

    window.addEventListener('storage-update', loadAppts)
    return () => window.removeEventListener('storage-update', loadAppts)
  }, [navigate])

  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this scheduled consultation?')) {
      const key = `appointments_${user.email}`
      const updated = appointments.filter((appt) => appt.id !== id)
      localStorage.setItem(key, JSON.stringify(updated))
      setAppointments(updated)
      
      // Dispatch storage-update event
      window.dispatchEvent(new Event('storage-update'))
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 pl-0 md:pl-64 transition-all duration-300">
      {/* Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <h2 className="font-poppins text-lg font-bold text-text-custom">Manage Consultations</h2>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-poppins text-2xl font-bold text-text-custom">Your Session Schedule</h1>
            <p className="text-xs text-slate-500 max-w-md">
              Review, manage, or cancel active counseling appointments. Ensure to join online sessions 5 minutes prior to start.
            </p>
          </div>

          <Link
            to="/counseling"
            className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-primary px-4.5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all duration-200 shrink-0 self-start sm:self-auto"
          >
            <FaCalendarPlus />
            <span>Book New Slot</span>
          </Link>
        </div>

        {/* Info card */}
        <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 flex items-start space-x-3 text-xs text-slate-600">
          <FaInfoCircle className="text-primary mt-0.5 shrink-0" size={14} />
          <div className="leading-relaxed">
            <strong>Attendance Guidelines:</strong> To maintain slot fairness for all campus students, cancellation must be made at least 12 hours in advance. Repeated no-shows may limit automated booking privileges.
          </div>
        </div>

        {/* Appointments List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5">
          <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
            <FaCalendarCheck className="text-secondary text-base" />
            <span>Scheduled Consultations</span>
          </h3>

          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  appointment={appt}
                  onCancel={handleCancelAppointment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl space-y-4">
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                You have no active therapy or advising consultations scheduled. Feel free to browse counselor bios and book a free session.
              </p>
              <Link
                to="/counseling"
                className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-white shadow-md shadow-secondary/15 hover:bg-secondary/90 transition-colors"
              >
                Schedule First Appointment
              </Link>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
