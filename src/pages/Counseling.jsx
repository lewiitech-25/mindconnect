import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserMd, FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, FaCheckCircle, FaUserCheck } from 'react-icons/fa'

const counselors = [
  {
    id: 1,
    name: 'Dr. Jane Smith',
    specialty: 'Clinical Psychologist (Anxiety & CBT)',
    description: 'Over 12 years supporting students with academic panic, grounding, and cognitive restructuring.',
    avatarColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 2,
    name: 'Dr. John Doe',
    specialty: 'Licensed Clinical Counselor (Stress & Burnout)',
    description: 'Expert in stress management, sleep hygiene, and creating work-life boundaries during college.',
    avatarColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 3,
    name: 'Dr. Karen Vance',
    specialty: 'Academic Wellness Advisor (Life Transitions)',
    description: 'Helping students handle adjustment fatigue, homesickness, and interpersonal relationships.',
    avatarColor: 'bg-purple-100 text-purple-700'
  }
]

const availableTimeSlots = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']

// Generate next week's Monday, Tuesday, Wednesday for realistic options
const getUpcomingDays = () => {
  const days = []
  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let current = new Date()

  // Find upcoming Mon, Tue, Wed
  for (let i = 1; i <= 7; i++) {
    const nextDay = new Date(Date.now() + i * 24 * 60 * 60 * 1000)
    const dayName = weekdayNames[nextDay.getDay()]
    if (['Monday', 'Tuesday', 'Wednesday'].includes(dayName)) {
      days.push({
        dayName,
        dateString: nextDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
      })
    }
  }
  return days.sort((a, b) => new Date(a.dateString) - new Date(b.dateString))
}

export default function Counseling() {
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(1)
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [sessionMode, setSessionMode] = useState('Online Video')
  const [notes, setNotes] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const upcomingDays = getUpcomingDays()

  useEffect(() => {
    const storedUser = localStorage.getItem('studentUser')
    if (!storedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(storedUser))
  }, [navigate])

  const handleBooking = () => {
    if (!selectedCounselor || !selectedDay || !selectedTimeSlot) return

    const newAppointment = {
      id: 'APT-' + Math.floor(100000 + Math.random() * 900000),
      counselorId: selectedCounselor.id,
      counselorName: selectedCounselor.name,
      date: selectedDay.dateString,
      dayName: selectedDay.dayName,
      timeSlot: selectedTimeSlot,
      mode: sessionMode,
      notes: notes.trim(),
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    }

    const key = `appointments_${user.email}`
    const stored = localStorage.getItem(key)
    const current = stored ? JSON.parse(stored) : []
    const updated = [newAppointment, ...current]
    localStorage.setItem(key, JSON.stringify(updated))

    setSuccess(true)
    
    // Dispatch storage-update event to sync with other open screens/tabs
    window.dispatchEvent(new Event('storage-update'))

    setTimeout(() => {
      setSuccess(false)
      navigate('/appointments')
    }, 2000)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-mesh-light bg-dot-pattern pl-0 md:pl-64 transition-all duration-300 page-transition-enter">
      {/* Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <h2 className="font-poppins text-lg font-bold text-text-custom">Book Counselor Consultation</h2>
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>Step {step} of 3</span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Page title */}
        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-text-custom">Schedule a Counseling Session</h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Book private, confidential consultations with clinical psychologist specialists or academic advisors. Sessions are free for registered students.
          </p>
        </div>

        {/* Success Page Overlay */}
        {success && (
          <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-lg animate-in zoom-in-95 duration-200 max-w-md mx-auto space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
              <FaCheckCircle className="text-4xl animate-bounce" />
            </div>
            <h3 className="font-poppins text-xl font-bold text-text-custom">Session Booked!</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Your appointment with <strong>{selectedCounselor?.name}</strong> on {selectedDay?.dateString} at {selectedTimeSlot} has been secured. Redirecting you to your schedule...
            </p>
          </div>
        )}

        {/* Wizard Forms */}
        {!success && (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-6">
            
            {/* Progress indicators */}
            <div className="flex items-center space-x-2 border-b border-slate-50 pb-4">
              <button
                onClick={() => setStep(1)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  step === 1 ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                1. Select Counselor
              </button>
              <span className="text-slate-300">/</span>
              <button
                onClick={() => selectedCounselor && setStep(2)}
                disabled={!selectedCounselor}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  step === 2 ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50'
                }`}
              >
                2. Choose Time & Date
              </button>
              <span className="text-slate-300">/</span>
              <button
                onClick={() => selectedCounselor && selectedDay && selectedTimeSlot && setStep(3)}
                disabled={!selectedCounselor || !selectedDay || !selectedTimeSlot}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  step === 3 ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 disabled:opacity-50'
                }`}
              >
                3. Session Mode & Notes
              </button>
            </div>

            {/* STEP 1: Counselor Choice */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="font-poppins font-bold text-sm text-text-custom">Available Clinical Advisors</h3>
                <div className="space-y-4">
                  {counselors.map((c) => {
                    const active = selectedCounselor?.id === c.id
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCounselor(c)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-4 hover:shadow-sm ${
                          active
                            ? 'bg-primary/5 border-primary shadow-sm'
                            : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className={`h-11 w-11 rounded-full shrink-0 flex items-center justify-center font-bold text-lg border border-slate-100 ${c.avatarColor}`}>
                          <FaUserMd />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-poppins font-bold text-sm text-text-custom">{c.name}</h4>
                            {active && (
                              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                                <FaUserCheck />
                                <span>Selected</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-primary">{c.specialty}</p>
                          <p className="text-xs text-slate-500 leading-normal pt-1">{c.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-50">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedCounselor}
                    className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all ${
                      selectedCounselor
                        ? 'bg-primary hover:bg-primary/95 cursor-pointer shadow-primary/10'
                        : 'bg-slate-300 shadow-none cursor-not-allowed'
                    }`}
                  >
                    Next Step (Time Selection)
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Time Selection */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Date select */}
                <div className="space-y-3">
                  <h3 className="font-poppins font-bold text-sm text-text-custom">Select Appointment Day</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {upcomingDays.map((day, i) => {
                      const active = selectedDay?.dateString === day.dateString
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            active
                              ? 'bg-primary/5 border-primary text-primary scale-[1.02] shadow-sm'
                              : 'border-slate-100 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-200 text-slate-700'
                          }`}
                        >
                          <FaCalendarAlt size={16} className="text-slate-400 mb-2" />
                          <span className="text-xs font-bold uppercase">{day.dayName}</span>
                          <span className="text-[10px] text-slate-500 mt-1">{day.dateString}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time select */}
                {selectedDay && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-poppins font-bold text-sm text-text-custom">Select Available Time Slot</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {availableTimeSlots.map((time) => {
                        const active = selectedTimeSlot === time
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTimeSlot(time)}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              active
                                ? 'bg-primary/5 border-primary text-primary font-bold shadow-sm'
                                : 'border-slate-100 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-200 text-slate-600 text-xs font-medium'
                            }`}
                          >
                            <FaClock className="inline mr-1 text-slate-400" size={10} />
                            <span>{time}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedDay || !selectedTimeSlot}
                    className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all ${
                      selectedDay && selectedTimeSlot
                        ? 'bg-primary hover:bg-primary/95 cursor-pointer shadow-primary/10'
                        : 'bg-slate-300 shadow-none cursor-not-allowed'
                    }`}
                  >
                    Next Step (Details)
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: Details & Booking */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Session Mode Selector */}
                <div className="space-y-3">
                  <h3 className="font-poppins font-bold text-sm text-text-custom">Select Session Mode</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    <button
                      type="button"
                      onClick={() => setSessionMode('Online Video')}
                      className={`p-4 rounded-xl border flex items-center space-x-3 text-left transition-all ${
                        sessionMode === 'Online Video'
                          ? 'bg-primary/5 border-primary text-primary shadow-sm'
                          : 'border-slate-100 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <FaVideo />
                      </div>
                      <div>
                        <span className="block font-bold text-xs">Telehealth (Online Video)</span>
                        <span className="text-[10px] text-slate-500">Secure link sent to email</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSessionMode('In Person')}
                      className={`p-4 rounded-xl border flex items-center space-x-3 text-left transition-all ${
                        sessionMode === 'In Person'
                          ? 'bg-secondary/5 border-secondary text-secondary shadow-sm'
                          : 'border-slate-100 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="h-9 w-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <span className="block font-bold text-xs">In Person (On Campus)</span>
                        <span className="text-[10px] text-slate-500">Student Clinic, Block C</span>
                      </div>
                    </button>

                  </div>
                </div>

                {/* Brief notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Reason for visit (Optional & Confidential)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly share what you would like to discuss (e.g. stress management, coping with test anxiety, work-life balance...)"
                    rows="3"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-xs text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>

                {/* Final summary list */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <h4 className="font-poppins font-bold text-xs text-text-custom border-b border-slate-200/50 pb-1.5 uppercase tracking-wide">Booking Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>Counselor: <strong className="text-text-custom">{selectedCounselor?.name}</strong></div>
                    <div>Mode: <strong className="text-text-custom">{sessionMode}</strong></div>
                    <div>Date: <strong className="text-text-custom">{selectedDay?.dateString} ({selectedDay?.dayName})</strong></div>
                    <div>Time: <strong className="text-text-custom">{selectedTimeSlot}</strong></div>
                  </div>
                </div>

                {/* Nav buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <button
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBooking}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Confirm & Book Session
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  )
}
