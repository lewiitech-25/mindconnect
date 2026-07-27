import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaInfoCircle
} from 'react-icons/fa'

import AppointmentCard from '../components/AppointmentCard'
import { auth } from '../firebase/config'
import {
  cancelAppointment,
  getAppointments
} from '../firebase/appointmentService'
import { getUserProfile } from '../firebase/userService'

export default function Appointments() {
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setLoading(false)
          navigate('/login')
          return
        }

        try {
          setLoading(true)
          setLoadError('')

          const [profile, firebaseAppointments] =
            await Promise.all([
              getUserProfile(currentUser.uid),
              getAppointments(currentUser.uid)
            ])

          setUser(profile)
          setAppointments(firebaseAppointments)
        } catch (error) {
          console.error(
            'Failed to load appointments:',
            error
          )

          setLoadError(
            'Unable to load your appointments. Please refresh the page and try again.'
          )
        } finally {
          setLoading(false)
        }
      }
    )

    return () => unsubscribe()
  }, [navigate])

  const handleCancelAppointment = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this scheduled consultation?'
    )

    if (!confirmed) {
      return
    }

    const currentUser = auth.currentUser

    if (!currentUser) {
      navigate('/login')
      return
    }

    try {
      setCancellingId(id)

      await cancelAppointment(currentUser.uid, id)

      setAppointments((currentAppointments) =>
        currentAppointments.filter(
          (appointment) => appointment.id !== id
        )
      )
    } catch (error) {
      console.error(
        'Failed to cancel appointment:',
        error
      )

      alert(
        'Unable to cancel the appointment. Please try again.'
      )
    } finally {
      setCancellingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 transition-all duration-300">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-4 border-slate-200 border-t-primary animate-spin" />

          <p className="text-xs font-semibold text-slate-500">
            Loading your consultations...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
  <div className="min-h-screen bg-mesh-light bg-dot-pattern transition-all duration-300 page-transition-enter">
    {/* Header Panel */}
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <div>
          <h2 className="font-poppins text-lg font-bold text-text-custom">
            Manage Consultations
          </h2>

          <p className="text-[10px] text-slate-400">
            Signed in as {user.name || user.email}
          </p>
        </div>
      </header>

      <main className="p-6 max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-poppins text-2xl font-bold text-text-custom">
              Your Session Schedule
            </h1>

            <p className="text-xs text-slate-500 max-w-md">
              Review or cancel your counselling appointments.
              Join online sessions at least five minutes before
              the scheduled start time.
            </p>
          </div>

          <Link
            to="/counseling"
            className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all duration-200 shrink-0 self-start sm:self-auto"
          >
            <FaCalendarPlus />

            <span>Book New Slot</span>
          </Link>
        </div>

        <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 flex items-start space-x-3 text-xs text-slate-600">
          <FaInfoCircle
            className="text-primary mt-0.5 shrink-0"
            size={14}
          />

          <div className="leading-relaxed">
            <strong>Attendance Guidelines:</strong>{' '}
            Cancellations should be made at least 12 hours in
            advance. Repeated missed sessions may affect future
            booking privileges.
          </div>
        </div>

        {loadError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-xs font-semibold text-red-600">
            {loadError}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5">
          <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
            <FaCalendarCheck className="text-secondary text-base" />

            <span>Scheduled Consultations</span>
          </h3>

          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={
                    cancellingId === appointment.id
                      ? 'opacity-60 pointer-events-none'
                      : ''
                  }
                >
                  <AppointmentCard
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                  />

                  {cancellingId === appointment.id && (
                    <p className="mt-2 text-center text-[10px] font-semibold text-slate-500">
                      Cancelling appointment...
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl space-y-4">
              <FaCalendarPlus className="mx-auto text-3xl text-slate-300" />

              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                You have no active counselling appointments.
                Browse the available counsellors and schedule
                your first session.
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