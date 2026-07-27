import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  FaRegCheckCircle,
  FaSearch
} from 'react-icons/fa'
import MoodCard from '../components/MoodCard'

export default function CounselorDashboard() {
  const [user, setUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [activeTab, setActiveTab] = useState('All')
  const [selectedStudentMoods, setSelectedStudentMoods] = useState(null)
  const [activeStudentName, setActiveStudentName] = useState('')
  const [clinicalNotesModal, setClinicalNotesModal] = useState(null)
  const [clinicalNoteText, setClinicalNoteText] = useState('')
  const [isOnline, setIsOnline] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('studentUser')
    if (!storedUser) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(storedUser)
    if (parsed.role !== 'counselor' && parsed.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    setUser(parsed)

    // Load all student appointments across the system
    const loadAllAppointments = () => {
      const allAppts = []
      // Add default mock student appointments for counselor view
      const demoAppts = [
        {
          id: 'APT-849201',
          studentName: 'Alex Mercer',
          studentId: 'ST-94821',
          studentEmail: 'student@university.edu',
          counselorName: parsed.name || 'Dr. Jane Smith',
          date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          dayName: 'Today',
          timeSlot: '2:00 PM',
          mode: 'Online Video',
          notes: 'Exam stress and midterms exhaustion. Seeking grounding techniques.',
          status: 'Confirmed'
        },
        {
          id: 'APT-739102',
          studentName: 'Sarah Jenkins',
          studentId: 'ST-39102',
          studentEmail: 'sarah@university.edu',
          counselorName: parsed.name || 'Dr. Jane Smith',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          dayName: 'Tomorrow',
          timeSlot: '11:00 AM',
          mode: 'In Person',
          notes: 'Academic burnout and sleep insomnia consultation.',
          status: 'Confirmed'
        },
        {
          id: 'APT-628104',
          studentName: 'Marcus Vance',
          studentId: 'ST-10928',
          studentEmail: 'marcus@university.edu',
          counselorName: parsed.name || 'Dr. Jane Smith',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          dayName: 'Yesterday',
          timeSlot: '9:00 AM',
          mode: 'Online Video',
          notes: 'Follow up on cognitive reframing exercises.',
          status: 'Completed',
          clinicalNote: 'Recommended 5-4-3-2-1 grounding exercises and Pomodoro 25/5 study splits. Student reported lower anxiety.'
        }
      ]

      // Merge with student booked local appointments if any
      const existingUsers = localStorage.getItem('registeredUsers')
      const users = existingUsers ? JSON.parse(existingUsers) : []
      users.forEach((u) => {
        const studentAppts = localStorage.getItem(`appointments_${u.email}`)
        if (studentAppts) {
          const parsedAppts = JSON.parse(studentAppts)
          parsedAppts.forEach((a) => {
            if (!demoAppts.some((d) => d.id === a.id)) {
              demoAppts.unshift({ ...a, studentName: u.name, studentId: u.studentId, studentEmail: u.email })
            }
          })
        }
      })

      setAppointments(demoAppts)
    }

    loadAllAppointments()
  }, [navigate])

  const handleUpdateStatus = (id, newStatus) => {
    const updated = appointments.map((a) => {
      if (a.id === id) {
        return { ...a, status: newStatus }
      }
      return a
    })
    setAppointments(updated)
  }

  const handleViewStudentMoods = (email, studentName) => {
    setActiveStudentName(studentName)
    const stored = localStorage.getItem(`moods_${email}`)
    if (stored) {
      setSelectedStudentMoods(JSON.parse(stored))
    } else {
      // Sample mock moods for Sarah or Marcus
      setSelectedStudentMoods([
        { mood: 'Stressed', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Sleepless night preparing for finals.' },
        { mood: 'Sad', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Feeling physically tired and unmotivated.' },
        { mood: 'Okay', date: new Date().toISOString(), note: 'Attending counseling session today.' }
      ])
    }
  }

  const handleSaveClinicalNote = () => {
    if (!clinicalNotesModal) return
    const updated = appointments.map((a) => {
      if (a.id === clinicalNotesModal.id) {
        return { ...a, clinicalNote: clinicalNoteText, status: 'Completed' }
      }
      return a
    })
    setAppointments(updated)
    setClinicalNotesModal(null)
    setClinicalNoteText('')
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

  return (
    <div className="min-h-screen bg-slate-50 pl-0 md:pl-64 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <FaUserMd />
          </div>
          <div>
            <h2 className="font-poppins text-sm font-bold text-text-custom leading-tight">{user.name}</h2>
            <p className="text-[10px] text-slate-500">Counselor Workspace Portal</p>
          </div>
        </div>

        {/* Availability Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
          <span>{isOnline ? 'Available (Online)' : 'Busy (Offline)'}</span>
        </button>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-md space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Clinical Consultation Center</span>
          <h1 className="font-poppins text-2xl font-bold">Student Consultation Queue</h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Review booked student sessions, inspect student emotional logs, conduct telehealth meetings, and log clinical recommendations.
          </p>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Sessions</span>
            <div className="text-2xl font-extrabold text-text-custom mt-1">{appointments.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-emerald-600 uppercase">Confirmed Queue</span>
            <div className="text-2xl font-extrabold text-emerald-600 mt-1">
              {appointments.filter((a) => a.status === 'Confirmed').length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-blue-600 uppercase">Completed Today</span>
            <div className="text-2xl font-extrabold text-blue-600 mt-1">
              {appointments.filter((a) => a.status === 'Completed').length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-amber-600 uppercase">High Stress Flagged</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">2</div>
          </div>
        </div>

        {/* Queue Table Control */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2">
              {['All', 'Confirmed', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search filter */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaSearch size={11} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-8 pr-3 text-xs text-text-custom outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Appointment Items List */}
          <div className="space-y-3.5">
            {filteredAppts.length > 0 ? (
              filteredAppts.map((appt) => (
                <div
                  key={appt.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-200 hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/60 pb-2.5">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {appt.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2">
                          <span>{appt.studentName}</span>
                          <span className="text-[10px] font-mono text-slate-400">({appt.studentId})</span>
                        </h4>
                        <p className="text-[10px] text-slate-500">{appt.studentEmail}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border uppercase ${
                          appt.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-slate-400" />
                      <span>Date: <strong>{appt.date}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-slate-400" />
                      <span>Time: <strong>{appt.timeSlot}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appt.mode === 'Online Video' ? <FaVideo className="text-primary" /> : <FaMapMarkerAlt className="text-secondary" />}
                      <span>Mode: <strong>{appt.mode}</strong></span>
                    </div>
                  </div>

                  {/* Student Reason */}
                  {appt.notes && (
                    <div className="p-3 rounded-lg bg-white border border-slate-100 text-xs text-slate-600 italic">
                      "Reason: {appt.notes}"
                    </div>
                  )}

                  {/* Existing Clinical Note */}
                  {appt.clinicalNote && (
                    <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-800 space-y-1">
                      <strong className="block text-[10px] font-bold uppercase text-emerald-600">Clinical Recommendation Note:</strong>
                      <p>{appt.clinicalNote}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between border-t border-slate-100/60 pt-3">
                    <button
                      onClick={() => handleViewStudentMoods(appt.studentEmail, appt.studentName)}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
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
                        className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <FaStickyNote className="text-slate-400" />
                        <span>Add Clinical Note</span>
                      </button>

                      {appt.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                          className="inline-flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
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
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                No matching student sessions found in the consultation queue.
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Modal: View Student Shared Mood History */}
      {selectedStudentMoods && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl border border-slate-100 max-h-[80vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-poppins font-bold text-text-custom text-base flex items-center space-x-2">
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
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-bold text-text-custom text-sm">
                Log Clinical Note - {clinicalNotesModal.studentName}
              </h3>
              <button onClick={() => setClinicalNotesModal(null)} className="text-slate-400 hover:text-slate-600">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Counselor Assessment & Recommendations</label>
              <textarea
                value={clinicalNoteText}
                onChange={(e) => setClinicalNoteText(e.target.value)}
                placeholder="Enter clinical advice, suggested exercises, or follow-up timelines..."
                rows="4"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-text-custom outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setClinicalNotesModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClinicalNote}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary/95 shadow-sm"
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
