import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
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
    const storedUser = localStorage.getItem('studentUser')
    if (!storedUser) {
      navigate('/login')
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    // Load Tip of the Day
    const dayIndex = new Date().getDate() % mentalTips.length
    setRandomTip(mentalTips[dayIndex])

    // Load Moods
    const loadData = () => {
      const storedMoods = localStorage.getItem(`moods_${parsedUser.email}`)
      const parsedMoods = storedMoods ? JSON.parse(storedMoods) : []
      setMoods(parsedMoods)

      // Check if logged today
      const todayString = new Date().toDateString()
      const loggedToday = parsedMoods.find(
        (m) => new Date(m.date).toDateString() === todayString
      )
      if (loggedToday) {
        setTodayMood(loggedToday)
      }

      // Load Appointments
      const storedAppts = localStorage.getItem(`appointments_${parsedUser.email}`)
      const appts = storedAppts ? JSON.parse(storedAppts) : []
      const activeAppt = appts.find((a) => a.status === 'Confirmed')
      setUpcomingSession(activeAppt || null)
    }

    loadData()

    // Setup an event listener for storage modifications (in case mood page changes it)
    window.addEventListener('storage-update', loadData)
    return () => window.removeEventListener('storage-update', loadData)
  }, [navigate])

  const handleQuickMood = (selectedMood) => {
    if (!user) return
    const newLog = {
      mood: selectedMood,
      date: new Date().toISOString(),
      note: 'Quick check-in from dashboard.'
    }

    const key = `moods_${user.email}`
    const storedMoods = localStorage.getItem(key)
    const currentMoods = storedMoods ? JSON.parse(storedMoods) : []
    
    // Replace today's log if it exists, otherwise push
    const todayStr = new Date().toDateString()
    const cleanedMoods = currentMoods.filter(m => new Date(m.date).toDateString() !== todayStr)
    const updated = [...cleanedMoods, newLog]
    
    localStorage.setItem(key, JSON.stringify(updated))
    setMoods(updated)
    setTodayMood(newLog)
    setQuickMoodLogged(true)
    setTimeout(() => setQuickMoodLogged(false), 3000)
    
    // Broadcast change
    window.dispatchEvent(new Event('storage-update'))
  }

  // Prep chart data
  const sortedMoods = [...moods]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7) // Last 7 logs

  const chartData = {
    labels: sortedMoods.map((m) =>
      new Date(m.date).toLocaleDateString(undefined, { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Mood Trend',
        data: sortedMoods.map((m) => moodValues[m.mood] || 3),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderWidth: 2.5,
        tension: 0.35,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 1.5,
        pointRadius: 4.5,
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
    <div className="min-h-screen bg-slate-50 pl-0 md:pl-64 transition-all duration-300">
      
      {/* Top Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <div>
          <h2 className="font-poppins text-lg font-bold text-text-custom">Student Center</h2>
        </div>
        
        {/* Dynamic Tip Shortcut */}
        <div className="hidden lg:flex items-center space-x-2 bg-primary/5 border border-primary/10 rounded-xl px-4 py-1.5 text-xs text-primary max-w-md truncate">
          <FaLightbulb className="shrink-0" />
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
        
        {/* Welcome Callout Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-6 sm:p-8 text-white shadow-md shadow-primary/15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent)]"></div>
          <div className="relative z-10 space-y-2">
            <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              "You are stronger than you think. MindConnect is here to support you at every step of your college journey."
            </p>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Mood Check-In Widget */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-poppins font-bold text-text-custom text-sm flex items-center space-x-2">
                <FaSmile className="text-primary text-lg" />
                <span>Today's Mood Status</span>
              </h3>
              <Link to="/mood" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center space-x-0.5">
                <span>Detailed Log</span>
                <FaArrowRight size={8} />
              </Link>
            </div>

            {todayMood ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 flex items-center justify-between animate-in fade-in duration-300">
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
                <span className="inline-flex items-center space-x-1 text-xs font-bold text-secondary bg-secondary/5 border border-secondary/10 px-2.5 py-1 rounded-lg">
                  <FaRegCheckCircle />
                  <span>Logged</span>
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-normal">
                  How are you feeling today? Tap to record your mood instantly on your dashboard:
                </p>
                <div className="grid grid-cols-5 gap-2 sm:gap-4">
                  {Object.keys(moodValues).map((m) => {
                    const emojis = { Happy: '😀', Good: '🙂', Okay: '😐', Stressed: '😟', Sad: '😢' }
                    return (
                      <button
                        key={m}
                        onClick={() => handleQuickMood(m)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-100 hover:border-slate-200 active:scale-95 transition-all"
                      >
                        <span className="text-2xl filter drop-shadow-sm select-none">{emojis[m]}</span>
                        <span className="text-[10px] text-slate-600 font-semibold mt-1">{m}</span>
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

            {/* Mood history line chart */}
            <div className="pt-4">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">Weekly Mood Trend</h4>
              <div className="h-56 relative w-full">
                {sortedMoods.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="absolute inset-0 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                    Please log your mood to visualize trends.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right column: Appointment & Tips */}
          <div className="space-y-6">
            
            {/* Upcoming Appointment */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <h3 className="font-poppins font-bold text-text-custom text-sm flex items-center space-x-2">
                  <FaCalendarAlt className="text-secondary text-lg" />
                  <span>Upcoming Appointment</span>
                </h3>
                <Link to="/appointments" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center space-x-0.5">
                  <span>Manage</span>
                  <FaArrowRight size={8} />
                </Link>
              </div>

              {upcomingSession ? (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-primary border border-slate-200">
                      <FaUserMd className="text-base" />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-custom text-sm">{upcomingSession.counselorName}</h4>
                      <p className="text-[10px] text-slate-500">Licensed Campus Counselor</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200/50 pt-3">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Date</span>
                      <span className="font-semibold text-slate-700">{upcomingSession.date}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Time Slot</span>
                      <span className="font-semibold text-slate-700">{upcomingSession.timeSlot}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl space-y-3">
                  <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    No therapy or consultation sessions scheduled this week.
                  </p>
                  <Link
                    to="/counseling"
                    className="inline-flex items-center justify-center rounded-xl bg-secondary px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-secondary/15 hover:bg-secondary/90 transition-all"
                  >
                    Book Counselor
                  </Link>
                </div>
              )}
            </div>

            {/* Tip of the Day card */}
            <div className="rounded-2xl border border-primary/10 bg-gradient-to-tr from-blue-50/40 to-slate-50 p-5 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-primary/5 rounded-bl-full flex items-center justify-center text-primary/15">
                <FaLightbulb className="text-3xl" />
              </div>
              <h3 className="font-poppins font-bold text-text-custom text-sm flex items-center space-x-2">
                <FaLightbulb className="text-primary text-base" />
                <span>Tip of the Day</span>
              </h3>
              <p className="text-slate-600 text-xs italic leading-relaxed pt-1.5">
                "{randomTip}"
              </p>
              <p className="text-[10px] text-slate-400 text-right font-medium">
                - Campus Wellness Center
              </p>
            </div>

          </div>

        </div>

        {/* Quick Actions Shortcuts Grid */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-poppins font-bold text-text-custom text-sm">
            Quick Wellness Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Link
              to="/mood"
              className="flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 hover:bg-slate-50 hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FaSmile />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-custom">Mood Logs</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Record daily stress</p>
              </div>
            </Link>

            <Link
              to="/counseling"
              className="flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 hover:bg-slate-50 hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <FaUserMd />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-custom">Book Counselor</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Confidential slots</p>
              </div>
            </Link>

            <Link
              to="/resources"
              className="flex items-center space-x-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 hover:bg-slate-50 hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50 text-accent border border-yellow-100/50">
                <FaBookOpen />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-custom">Wellness Guides</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Clinician handbooks</p>
              </div>
            </Link>

            <Link
              to="/emergency"
              className="flex items-center space-x-3 rounded-xl border border-red-100 bg-red-50/10 p-3.5 hover:bg-red-50 hover:border-red-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-100 animate-pulse">
                <FaPhoneAlt />
              </div>
              <div>
                <h4 className="text-xs font-bold text-red-600">Emergency Help</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Hotlines and Security</p>
              </div>
            </Link>

          </div>
        </div>

      </main>
    </div>
  )
}
