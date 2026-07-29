import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

import {
  getCounselorAppointments,
  saveAppointmentClinicalNote,
  updateAppointmentStatus
} from '../firebase/appointmentService'

import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimes,
  FaSmile,
  FaStickyNote,
  FaSearch
} from 'react-icons/fa'
import MoodCard from '../components/MoodCard'

export default function CounselorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] =
    useState(true)
  const [appointmentError, setAppointmentError] =
    useState('')
  const { profile: user } = useAuth()
  const [activeTab, setActiveTab] = useState('All')
  const [selectedStudentMoods, setSelectedStudentMoods] = useState(null)
  const [activeStudentName, setActiveStudentName] = useState('')
  const [clinicalNotesModal, setClinicalNotesModal] = useState(null)
  const [clinicalNoteText, setClinicalNoteText] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
  if (!user?.uid) {
    return
  }

  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true)
      setAppointmentError('')

      const counselorAppointments =
        await getCounselorAppointments(user.uid)

      setAppointments(counselorAppointments)
    } catch (error) {
      console.error(
        'Failed to load counsellor appointments:',
        error
      )

      setAppointmentError(
        'Unable to load your appointments. Please refresh the page.'
      )
    } finally {
      setLoadingAppointments(false)
    }
  }

  loadAppointments()
}, [user?.uid])


  const handleUpdateStatus = async (
  id,
  newStatus
) => {
  try {
    await updateAppointmentStatus(id, newStatus)

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: newStatus
            }
          : appointment
      )
    )
  } catch (error) {
    console.error(
      'Failed to update appointment status:',
      error
    )

    alert(
      'Unable to update the appointment status.'
    )
  }
}

  const handleViewStudentMoods = (email, studentName) => {
    setActiveStudentName(studentName)
    const stored = localStorage.getItem(`moods_${email}`)
    if (stored) {
      setSelectedStudentMoods(JSON.parse(stored))
    } else {
      setSelectedStudentMoods([
        { mood: 'Stressed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Sleepless night preparing for finals.' },
        { mood: 'Sad', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Feeling physically tired and unmotivated.' },
        { mood: 'Okay', date: new Date().toISOString(), note: 'Attending counseling session today.' }
      ])
    }
  }

  const handleSaveClinicalNote = async () => {
  if (!clinicalNotesModal) {
    return
  }

  try {
    await saveAppointmentClinicalNote(
      clinicalNotesModal.id,
      clinicalNoteText.trim()
    )

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === clinicalNotesModal.id
          ? {
              ...appointment,
              clinicalNote:
                clinicalNoteText.trim(),
              status: 'Completed'
            }
          : appointment
      )
    )

    setClinicalNotesModal(null)
    setClinicalNoteText('')
  } catch (error) {
    console.error(
      'Failed to save clinical note:',
      error
    )

    alert('Unable to save the clinical note.')
  }
}

  const filteredAppts = appointments.filter((a) => {
    if (activeTab === 'Confirmed' && a.status !== 'Confirmed') return false
    if (activeTab === 'Completed' && a.status !== 'Completed') return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        a.studentName.toLowerCase().includes(q) ||
        a.studentId.toLowerCase().includes(q) ||
        a.notes.toLowerCase().includes(q)
      )
    }
    return true
  })

  if (!user) return null

  if (loadingAppointments) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />

        <p className="text-xs font-semibold text-slate-500">
          Loading appointments...
        </p>
      </div>
    </div>
  )
}
{appointmentError && (
  <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
    {appointmentError}
  </div>
)}


  return (
    <div className="min-h-screen bg-mesh-light bg-dot-pattern transition-all duration-300 page-transition-enter text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg border border-emerald-200">
            <FaUserMd />
          </div>
          <div>
            <h2 className="font-poppins text-sm font-extrabold text-slate-900 leading-tight">{user.name}</h2>
            <p className="text-[11px] font-bold text-slate-600">Counselor Workspace Portal</p>
          </div>
        </div>

        {/* Availability Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 text-slate-600 border-slate-300'
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
          <span>{isOnline ? 'Available (Online)' : 'Busy (Offline)'}</span>
        </button>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl space-y-2 border border-slate-800">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Clinical Consultation Center</span>
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold">Student Consultation Queue</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            Review booked student sessions, inspect student emotional logs, conduct telehealth meetings, and log clinical recommendations.
          </p>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Total Sessions</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{appointments.length}</div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md">
            <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">Confirmed Queue</span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">
              {appointments.filter((a) => a.status === 'Confirmed').length}
            </div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md">
            <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">Completed Today</span>
            <div className="text-3xl font-extrabold text-blue-600 mt-1">
              {appointments.filter((a) => a.status === 'Completed').length}
            </div>
          </div>
          <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-md">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">High Stress Flagged</span>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">2</div>
          </div>
        </div>

        {/* Queue Table Control */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2">
              {['All', 'Confirmed', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search filter */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaSearch size={12} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or ID..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Appointment Items List */}
          <div className="space-y-4">
            {filteredAppts.length > 0 ? (
              filteredAppts.map((appt) => (
                <div
                  key={appt.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm">
                        {appt.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-poppins font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                          <span>{appt.studentName}</span>
                          <span className="text-[11px] font-mono text-slate-600">({appt.studentId})</span>
                        </h4>
                        <p className="text-xs font-semibold text-slate-600">{appt.studentEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase border ${
                          appt.status === 'Completed'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-800 font-semibold">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-slate-500" />
                      <span>Date: <strong className="text-slate-900">{appt.date}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-slate-500" />
                      <span>Time: <strong className="text-slate-900">{appt.timeSlot}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appt.mode === 'Online Video' ? <FaVideo className="text-primary" /> : <FaMapMarkerAlt className="text-secondary" />}
                      <span>Mode: <strong className="text-slate-900">{appt.mode}</strong></span>
                    </div>
                  </div>

                  {/* Student Reason */}
                  {appt.notes && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-medium italic">
                      "Reason: {appt.notes}"
                    </div>
                  )}

                  {/* Existing Clinical Note */}
                  {appt.clinicalNote && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <strong className="block text-[10px] font-extrabold uppercase text-emerald-800">Clinical Recommendation Note:</strong>
                      <p className="font-medium">{appt.clinicalNote}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <button
                      onClick={() => handleViewStudentMoods(appt.studentEmail, appt.studentName)}
                      className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-primary hover:text-primary/80 transition-colors"
                    >
                      <FaSmile />
                      <span>Review Shared Mood History</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setClinicalNotesModal(appt)
                          setClinicalNoteText(appt.clinicalNote || '')
                        }}
                        className="inline-flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
                      >
                        <FaStickyNote className="text-slate-500" />
                        <span>Add Clinical Note</span>
                      </button>

                      {appt.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                          className="inline-flex items-center space-x-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md"
                        >
                          <FaCheckCircle />
                          <span>Mark Complete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-300 rounded-2xl text-slate-500 font-medium text-xs">
                No matching student sessions found in the consultation queue.
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Modal: View Student Shared Mood History */}
      {selectedStudentMoods && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[80vh] flex flex-col justify-between text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-poppins font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <FaSmile className="text-primary" />
                <span>Confidential Mood History - {activeStudentName}</span>
              </h3>
              <button
                onClick={() => setSelectedStudentMoods(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-2 flex-1 max-h-[50vh]">
              {selectedStudentMoods.map((m, i) => (
                <MoodCard key={i} mood={m.mood} date={m.date} note={m.note} />
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex justify-end">
              <button
                onClick={() => setSelectedStudentMoods(null)}
                className="rounded-xl bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-300"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Clinical Recommendation Note */}
      {clinicalNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-extrabold text-slate-900 text-sm">
                Log Clinical Note - {clinicalNotesModal.studentName}
              </h3>
              <button onClick={() => setClinicalNotesModal(null)} className="text-slate-400 hover:text-slate-600">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-slate-700">Counselor Assessment & Recommendations</label>
              <textarea
                value={clinicalNoteText}
                onChange={(e) => setClinicalNoteText(e.target.value)}
                placeholder="Enter clinical advice, suggested exercises, or follow-up timelines..."
                rows="4"
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setClinicalNotesModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClinicalNote}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-primary text-white hover:bg-primary/95 shadow-md"
              >
                Save & Complete Session
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
