import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import { getUserProfile } from '../firebase/userService'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  FaSmile,
  FaCalendarAlt,
  FaBookOpen,
  FaPhoneAlt,
  FaLightbulb,
  FaUserMd,
  FaArrowRight,
  FaRegCheckCircle
} from 'react-icons/fa'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getMoods, addMood } from '../firebase/moodService'
import { getAppointments } from '../firebase/appointmentService'

// Register ChartJS elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const moodValues = { Happy: 5, Good: 4, Okay: 3, Stressed: 2, Sad: 1 }
const moodLabels = { 5: 'Happy 😀', 4: 'Good 🙂', 3: 'Okay 😐', 2: 'Stressed 😟', 1: 'Sad 😢' }

const mentalTips = [
  'Focus on what you can control. Let go of what you cannot.',
  'Take three deep diaphragmatic breaths when studying gets intense.',
  'A 10-minute walk outside can reset your stress and boost focus.',
  'Practice gratitude: write down 3 things you are thankful for today.',
  'Social connection reduces cortisol. Call a friend or study partner.',
  'Prioritize 7-8 hours of sleep. Your brain consolidates memories at night.'
]

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [moods, setMoods] = useState([])
  const [todayMood, setTodayMood] = useState(null)
  const [upcomingSession, setUpcomingSession] = useState(null)
  const [randomTip, setRandomTip] = useState('')
  const [quickMoodLogged, setQuickMoodLogged] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
  const dayIndex = new Date().getDate() % mentalTips.length
  setRandomTip(mentalTips[dayIndex])

  const unsubscribe = onAuthStateChanged(
    auth,
    async (currentUser) => {
      if (!currentUser) {
        navigate('/login')
        return
      }

      try {
        const profile = await getUserProfile(currentUser.uid)
        setUser(profile)

        const firebaseMoods = await getMoods(currentUser.uid)
        setMoods(firebaseMoods)

        const todayString = new Date().toDateString()

        const loggedToday = firebaseMoods.find(
          (mood) =>
            new Date(mood.date).toDateString() === todayString
        )

        setTodayMood(loggedToday || null)

        const firebaseAppointments =
          await getAppointments(currentUser.uid)

        const activeAppointment =
          firebaseAppointments.find(
            (appointment) =>
              appointment.status === 'Confirmed'
          )

        setUpcomingSession(activeAppointment || null)
      } catch (error) {
        console.error(
          'Failed to load dashboard data:',
          error
        )
      }
    }
  )

  return () => unsubscribe()
}, [navigate])

  const handleQuickMood = async (selectedMood) => {
  const currentUser = auth.currentUser

  if (!currentUser) {
    navigate('/login')
    return
  }

  try {
    await addMood(
      currentUser.uid,
      selectedMood,
      'Quick check-in from dashboard.'
    )

    const firebaseMoods = await getMoods(currentUser.uid)
    setMoods(firebaseMoods)

    const todayString = new Date().toDateString()

    const loggedToday = firebaseMoods.find(
      (m) => new Date(m.date).toDateString() === todayString
    )

    setTodayMood(loggedToday || null)
    setQuickMoodLogged(true)

    setTimeout(() => {
      setQuickMoodLogged(false)
    }, 3000)
  } catch (error) {
    console.error('Failed to save quick mood:', error)
    alert('Unable to save your mood. Please try again.')
  }
}

  const sortedMoods = [...moods]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7)

  const chartData = {
    labels: sortedMoods.map((m) =>
      new Date(m.date).toLocaleDateString(undefined, { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Mood Trend',
        data: sortedMoods.map((m) => moodValues[m.mood] || 3),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.35,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Mood: ${moodLabels[context.parsed.y] || 'Unknown'}`
        }
      }
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value) => {
            const emojis = { 5: '😀', 4: '🙂', 3: '😐', 2: '😟', 1: '😢' }
            return emojis[value] || ''
          }
        },
        grid: { color: '#f1f5f9' }
      },
      x: {
        grid: { display: false }
      }
    }
  }

  if (!user) return null

  return (
<div className="min-h-screen bg-mesh-light bg-dot-pattern transition-all duration-300 page-transition-enter">
      
      {/* Behance-Style Glass Header */}
      <header className="sticky top-0 z-30 h-16 glass-behance px-6 flex items-center justify-between border-b border-white/60">
        <div>
          <h2 className="font-poppins text-lg font-bold text-text-custom">Student Analytics Center</h2>
        </div>
        
        <div className="hidden lg:flex items-center space-x-2 bg-white/80 border border-primary/20 rounded-xl px-4 py-1.5 text-xs text-primary max-w-md truncate shadow-2xs">
          <FaLightbulb className="shrink-0 text-amber-500" />
          <span className="truncate italic">Tip: {randomTip}</span>
        </div>

        <div className="flex items-center space-x-3">
          <img
            src="/images/student_portrait_1.jpg"
            alt="Student profile"
            className="h-9 w-9 rounded-full object-cover border-2 border-primary/30 shadow-sm"
          />
          <span className="text-xs font-semibold text-text-custom hidden sm:inline">{user.name}</span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Behance Gradient Callout Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-blue-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl shadow-primary/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent)] pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">Student Portal</span>
            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              "You are stronger than you think. MindConnect is here to support you at every step of your college journey."
            </p>
          </div>
        </div>

        {/* Dashboard Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Mood Check-In Widget */}
          <div className="lg:col-span-2 rounded-3xl glass-behance-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-poppins font-bold text-text-custom text-sm flex items-center space-x-2">
                <FaSmile className="text-primary text-lg" />
                <span>Today's Mood Check-In</span>
              </h3>
              <Link to="/mood" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center space-x-1">
                <span>Detailed Journal</span>
                <FaArrowRight size={9} />
              </Link>
            </div>

            {todayMood ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 flex items-center justify-between animate-in fade-in duration-300">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl select-none" role="img" aria-label={todayMood.mood}>
                    {todayMood.mood === 'Happy' && '😀'}
                    {todayMood.mood === 'Good' && '🙂'}
                    {todayMood.mood === 'Okay' && '😐'}
                    {todayMood.mood === 'Stressed' && '😟'}
                    {todayMood.mood === 'Sad' && '😢'}
                  </span>
                  <div>
                    <h4 className="font-bold text-text-custom text-sm">Logged as {todayMood.mood}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-sm truncate italic">
                      "{todayMood.note}"
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center space-x-1 text-xs font-bold text-secondary bg-white border border-secondary/20 px-3 py-1.5 rounded-xl shadow-2xs">
                  <FaRegCheckCircle />
                  <span>Logged</span>
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-normal">
                  How are you feeling today? Tap to record your mood instantly on your dashboard:
                </p>
                <div className="grid grid-cols-5 gap-2.5 sm:gap-4">
                  {Object.keys(moodValues).map((m) => {
                    const emojis = { Happy: '😀', Good: '🙂', Okay: '😐', Stressed: '😟', Sad: '😢' }
                    return (
                      <button
                        key={m}
                        onClick={() => handleQuickMood(m)}
                        className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-primary/30 active:scale-95 transition-all shadow-2xs"
                      >
                        <span className="text-2xl filter drop-shadow-sm select-none">{emojis[m]}</span>
                        <span className="text-[10px] text-slate-700 font-bold mt-1.5">{m}</span>
                      </button>
                    )
                  })}
                </div>
                {quickMoodLogged && (
                  <p className="text-xs text-secondary font-bold text-center animate-pulse">
                    ✓ Mood recorded successfully!
                  </p>
                )}
              </div>
            )}

            {/* Mood History Chart */}
            <div className="pt-4">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Weekly Mood Trend Analytics</h4>
              <div className="h-56 relative w-full">
                {sortedMoods.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="absolute inset-0 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
                    Please log your mood to visualize trends.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column Cards */}
          <div className="space-y-6">
            
            {/* Upcoming Appointment Card */}
            <div className="rounded-3xl glass-behance-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-poppins font-bold text-text-custom text-sm flex items-center space-x-2">
                  <FaCalendarAlt className="text-secondary text-lg" />
                  <span>Upcoming Session</span>
                </h3>
                <Link to="/appointments" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center space-x-1">
                  <span>Manage</span>
                  <FaArrowRight size={9} />
                </Link>
              </div>

              {upcomingSession ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3.5 shadow-2xs">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-secondary border border-emerald-100">
                      <FaUserMd className="text-lg" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-custom text-sm">{upcomingSession.counselorName}</h4>
                      <p className="text-[10px] text-slate-500">Licensed Campus Counselor</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Date</span>
                      <span className="font-semibold text-slate-700">{upcomingSession.date}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Time</span>
                      <span className="font-semibold text-slate-700">{upcomingSession.timeSlot}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                  <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    No therapy or consultation sessions scheduled this week.
                  </p>
                  <Link
                    to="/counseling"
                    className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-xs font-bold text-white shadow-md shadow-secondary/15 hover:bg-secondary/90 transition-all"
                  >
                    Book Counselor
                  </Link>
                </div>
              )}
            </div>

            {/* Daily Tip Card */}
            <div className="rounded-3xl glass-behance-card p-6 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-poppins font-bold text-text-custom text-sm flex items-center space-x-2">
                  <FaLightbulb className="text-amber-500 text-base" />
                  <span>Tip of the Day</span>
                </h3>
              </div>
              <p className="text-slate-600 text-xs italic leading-relaxed pt-1">
                "{randomTip}"
              </p>
              <p className="text-[10px] text-slate-400 text-right font-semibold">
                - Campus Wellness Center
              </p>
            </div>

          </div>

        </div>

        {/* Quick Actions Shortcuts */}
        <div className="rounded-3xl glass-behance-card p-6 space-y-4">
          <h3 className="font-poppins font-bold text-text-custom text-sm">
            Quick Wellness Shortcuts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Link
              to="/mood"
              className="flex items-center space-x-3 rounded-2xl border border-slate-100 bg-white p-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all shadow-2xs"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FaSmile />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-custom">Mood Logs</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Record daily stress</p>
              </div>
            </Link>

            <Link
              to="/counseling"
              className="flex items-center space-x-3 rounded-2xl border border-slate-100 bg-white p-4 hover:border-secondary/30 hover:-translate-y-0.5 transition-all shadow-2xs"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <FaUserMd />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-custom">Book Counselor</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Confidential slots</p>
              </div>
            </Link>

            <Link
              to="/resources"
              className="flex items-center space-x-3 rounded-2xl border border-slate-100 bg-white p-4 hover:border-amber-300 hover:-translate-y-0.5 transition-all shadow-2xs"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500 border border-amber-100">
                <FaBookOpen />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-custom">Wellness Guides</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Clinician handbooks</p>
              </div>
            </Link>

            <Link
              to="/emergency"
              className="flex items-center space-x-3 rounded-2xl border border-red-100 bg-red-50/20 p-4 hover:bg-red-50/40 hover:-translate-y-0.5 transition-all shadow-2xs"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 border border-red-200 animate-pulse">
                <FaPhoneAlt />
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-600">Emergency Help</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Hotlines & Security</p>
              </div>
            </Link>

          </div>
        </div>

      </main>
    </div>
  )
}