import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSmile, FaPen, FaHistory, FaCheckCircle, FaTrashAlt } from 'react-icons/fa'
import MoodCard from '../components/MoodCard'

const moodEmojis = { Happy: '😀', Good: '🙂', Okay: '😐', Stressed: '😟', Sad: '😢' }

export default function MoodTracker() {
  const [user, setUser] = useState(null)
  const [selectedMood, setSelectedMood] = useState('')
  const [note, setNote] = useState('')
  const [moodHistory, setMoodHistory] = useState([])
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('studentUser')
    if (!storedUser) {
      navigate('/login')
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    const loadMoods = () => {
      const stored = localStorage.getItem(`moods_${parsedUser.email}`)
      setMoodHistory(stored ? JSON.parse(stored) : [])
    }
    loadMoods()

    window.addEventListener('storage-update', loadMoods)
    return () => window.removeEventListener('storage-update', loadMoods)
  }, [navigate])

  const handleLogMood = (e) => {
    e.preventDefault()
    if (!selectedMood) return

    const newLog = {
      mood: selectedMood,
      date: new Date().toISOString(),
      note: note.trim() || 'No journal details recorded.'
    }

    const key = `moods_${user.email}`
    const updated = [newLog, ...moodHistory]
    localStorage.setItem(key, JSON.stringify(updated))
    setMoodHistory(updated)
    
    // Reset form
    setSelectedMood('')
    setNote('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)

    // Broadcast change
    window.dispatchEvent(new Event('storage-update'))
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to permanently erase your confidential mood log history? This action cannot be undone.')) {
      const key = `moods_${user.email}`
      localStorage.removeItem(key)
      setMoodHistory([])
      window.dispatchEvent(new Event('storage-update'))
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 pl-0 md:pl-64 transition-all duration-300">
      
      {/* Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <h2 className="font-poppins text-lg font-bold text-text-custom">Confidential Mood Log</h2>
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <FaCheckCircle className="text-secondary" />
          <span>AES-256 Mock Encrypted on Device</span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        
        {/* Intro */}
        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-text-custom">How are you feeling today?</h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Check-in daily to record your emotional patterns. Regular logging helps clinical advisors better support your wellness during consultations.
          </p>
        </div>

        {/* Form and History columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Check-In Card Form */}
          <div className="md:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5">
            <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
              <FaSmile className="text-primary text-base" />
              <span>Record Current Status</span>
            </h3>

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700 animate-pulse">
                ✓ Mood entry added successfully to your confidential logs.
              </div>
            )}

            <form onSubmit={handleLogMood} className="space-y-5">
              
              {/* Mood Selectors */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Select your mood
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {Object.keys(moodEmojis).map((m) => {
                    const active = selectedMood === m
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setSelectedMood(m)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          active
                            ? 'bg-primary/10 border-primary text-primary scale-[1.03] shadow-sm'
                            : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="text-3xl filter drop-shadow-sm select-none">{moodEmojis[m]}</span>
                        <span className="text-[10px] font-bold mt-1.5">{m}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Thought journal entry */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center space-x-1">
                  <FaPen size={10} />
                  <span>Journal Entry / Thoughts</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's causing this feeling? (e.g. studied for 4 hours, finished project, exam stress, caught up on sleep...)"
                  rows="4"
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 text-xs text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={!selectedMood}
                className={`w-full inline-flex items-center justify-center space-x-2 rounded-xl py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 ${
                  selectedMood
                    ? 'bg-primary hover:bg-primary/95 shadow-primary/15 active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-300 shadow-none cursor-not-allowed'
                }`}
              >
                <span>Save Entry</span>
              </button>

            </form>
          </div>

          {/* Privacy summary banner */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100/50 p-5 shadow-inner space-y-4">
            <h4 className="font-poppins font-bold text-xs text-slate-600 uppercase tracking-wider">Confidentiality Note</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your journal statements and logs remain <strong>strictly local</strong> in your browser cache. Advisors and counseling faculty only see aggregated trend values unless you choose to share specific logs during a session.
            </p>
            <div className="border-t border-slate-200 pt-4">
              <button
                onClick={handleClearHistory}
                disabled={moodHistory.length === 0}
                className={`w-full inline-flex items-center justify-center space-x-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all ${
                  moodHistory.length > 0
                    ? 'border-red-200 text-red-500 hover:bg-red-50 cursor-pointer'
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <FaTrashAlt size={10} />
                <span>Erase All History</span>
              </button>
            </div>
          </div>

        </div>

        {/* History List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5">
          <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
            <FaHistory className="text-secondary text-base" />
            <span>Mood History Log</span>
          </h3>

          <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-2">
            {moodHistory.length > 0 ? (
              moodHistory.map((m, index) => (
                <MoodCard key={index} mood={m.mood} date={m.date} note={m.note} />
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                No past logs recorded yet. Use the selector above to log your first mood status.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
