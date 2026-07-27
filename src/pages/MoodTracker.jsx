import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaSmile,
  FaPen,
  FaHistory,
  FaCheckCircle,
  FaTrashAlt
} from 'react-icons/fa'

import { auth } from '../firebase/config'
import {
  getMoods,
  addMood,
  clearMoods,
  deleteMood
} from '../firebase/moodService'

import MoodCard from '../components/MoodCard'

const moodEmojis = {
  Happy: '😀',
  Good: '🙂',
  Okay: '😐',
  Stressed: '😟',
  Sad: '😢'
}

export default function MoodTracker() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [selectedMood, setSelectedMood] = useState('')
  const [note, setNote] = useState('')
  const [moodHistory, setMoodHistory] = useState([])
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = auth.currentUser

    if (!currentUser) {
      navigate('/login')
      return
    }

    setUser(currentUser)

    loadMoodHistory(currentUser.uid)
  }, [navigate])

  async function loadMoodHistory(uid) {
    try {
      setLoading(true)

      const moods = await getMoods(uid)

      setMoodHistory(moods)
    } catch (err) {
      console.error('Failed to load moods:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogMood(e) {
    e.preventDefault()

    if (!selectedMood) return

    try {
      await addMood(
        user.uid,
        selectedMood,
        note.trim() || 'No journal details recorded.'
      )

      await loadMoodHistory(user.uid)

      setSelectedMood('')
      setNote('')

      setSuccess(true)

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error(err)
      alert('Unable to save mood entry.')
    }
  }

  async function handleDeleteMood(id) {
    const confirmed = window.confirm(
      'Delete this mood entry?'
    )

    if (!confirmed) return

    try {
      await deleteMood(user.uid, id)

      await loadMoodHistory(user.uid)
    } catch (err) {
      console.error(err)
      alert('Unable to delete mood.')
    }
  }

  async function handleClearHistory() {
    const confirmed = window.confirm(
      'Are you sure you want to permanently erase your confidential mood history?'
    )

    if (!confirmed) return

    try {
      await clearMoods(user.uid)

      setMoodHistory([])
    } catch (err) {
      console.error(err)
      alert('Unable to clear history.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading moods...
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 transition-all duration-300">

      {/* Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <h2 className="font-poppins text-lg font-bold text-text-custom">
          Confidential Mood Log
        </h2>

        <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <FaCheckCircle className="text-secondary" />
          <span>Stored Securely in Firebase</span>
        </div>
      </header>

      <main className="p-6 max-w-6xl space-y-6">

        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-text-custom">
            How are you feeling today?
          </h1>

          <p className="text-xs text-slate-500 max-w-xl">
            Check in daily to record your emotional wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          <div className="md:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5">

            <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
              <FaSmile className="text-primary text-base" />
              <span>Record Current Status</span>
            </h3>

            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
                ✓ Mood entry saved successfully.
              </div>
            )}

            <form onSubmit={handleLogMood} className="space-y-5">
                          {/* Mood Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Select your mood
                </label>

                <div className="grid grid-cols-5 gap-2.5">
                  {Object.keys(moodEmojis).map((m) => {
                    const active = selectedMood === m

                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMood(m)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          active
                            ? 'bg-primary/10 border-primary text-primary scale-[1.03] shadow-sm'
                            : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="text-3xl">
                          {moodEmojis[m]}
                        </span>

                        <span className="text-[10px] font-bold mt-1.5">
                          {m}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Journal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center space-x-1">
                  <FaPen size={10} />
                  <span>Journal Entry</span>
                </label>

                <textarea
                  rows="4"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's making you feel this way today?"
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 text-xs text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={!selectedMood}
                className={`w-full inline-flex items-center justify-center rounded-xl py-3.5 text-sm font-semibold text-white transition-all ${
                  selectedMood
                    ? 'bg-primary hover:bg-primary/95'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Save Entry
              </button>

            </form>

          </div>

          {/* Right Side */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100/50 p-5 shadow-inner space-y-4">

            <h4 className="font-poppins font-bold text-xs text-slate-600 uppercase tracking-wider">
              Privacy
            </h4>

            <p className="text-xs text-slate-500 leading-relaxed">
              Your mood entries are securely stored in your Firebase account.
              They are available whenever you sign in with the same account.
            </p>

            <div className="border-t border-slate-200 pt-4">

              <button
                onClick={handleClearHistory}
                disabled={moodHistory.length === 0}
                className={`w-full inline-flex items-center justify-center space-x-2 rounded-xl border py-2.5 text-xs font-bold transition-all ${
                  moodHistory.length > 0
                    ? 'border-red-200 text-red-500 hover:bg-red-50'
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <FaTrashAlt size={10} />
                <span>Clear All History</span>
              </button>

            </div>

          </div>

        </div>

        {/* Mood History */}

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5">

          <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
            <FaHistory className="text-secondary text-base" />
            <span>Mood History</span>
          </h3>

          <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-2">

            {moodHistory.length === 0 ? (

              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                No mood entries found.
              </div>

            ) : (

              moodHistory.map((entry) => (

                <MoodCard
                  key={entry.id}
                  id={entry.id}
                  mood={entry.mood}
                  note={entry.note}
                  date={entry.date}
                  onDelete={handleDeleteMood}
                />

              ))

            )}

          </div>

        </div>

      </main>
    </div>
  )
}