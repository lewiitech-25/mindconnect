import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { FaUser, FaLock, FaBell, FaShieldAlt, FaTrashAlt } from 'react-icons/fa'
import { auth } from '../firebase/config'
import {
  changeUserPassword,
  eraseUserAccount,
  getUserProfile,
  updateNotificationPreferences
} from '../firebase/userService'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passSuccess, setPassSuccess] = useState(false)
  const [passError, setPassError] = useState('')

  // Notifications state
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [apptReminders, setApptReminders] = useState(true)
  const [settingsSuccess, setSettingsSuccess] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login')
        return
      }

      try {
        const profile = await getUserProfile(currentUser.uid)
        setUser(profile)

        const preferences = profile.notificationPreferences || {}

        setEmailAlerts(preferences.emailAlerts ?? true)
        setSmsAlerts(preferences.smsAlerts ?? false)
        setWeeklyReports(preferences.weeklyReports ?? true)
        setApptReminders(preferences.apptReminders ?? true)
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassSuccess(false)

    if (!password || !confirmPassword) {
      setPassError('All fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setPassError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setPassError('Password must be at least 6 characters.')
      return
    }

    try {
      await changeUserPassword(password)

      setPassword('')
      setConfirmPassword('')
      setPassSuccess(true)

      setTimeout(() => {
        setPassSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to change password:', error)

      if (error.code === 'auth/requires-recent-login') {
        setPassError('Please log out, log in again, and retry the password change.')
      } else {
        setPassError('Unable to update your password. Please try again.')
      }
    }
  }

  const handleSaveNotifications = async (e) => {
    e.preventDefault()

    const currentUser = auth.currentUser

    if (!currentUser) {
      navigate('/login')
      return
    }

    try {
      await updateNotificationPreferences(currentUser.uid, {
        emailAlerts,
        smsAlerts,
        weeklyReports,
        apptReminders
      })

      setSettingsSuccess(true)

      setTimeout(() => {
        setSettingsSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to save notification preferences:', error)
      alert('Unable to save your preferences. Please try again.')
    }
  }

  const handleClearAllData = async () => {
    const confirmed = window.confirm(
      'WARNING: This will permanently erase your profile, mood logs, appointments, and Firebase account. This action cannot be undone. Continue?'
    )

    if (!confirmed) return

    const currentUser = auth.currentUser

    if (!currentUser) {
      navigate('/login')
      return
    }

    try {
      setIsDeleting(true)

      await eraseUserAccount(currentUser.uid)

      navigate('/')
    } catch (error) {
      console.error('Failed to erase account:', error)
      setIsDeleting(false)

      if (error.code === 'auth/requires-recent-login') {
        alert('For security, please log out, log in again, and retry account deletion.')
      } else {
        alert('Unable to erase the account. Please try again.')
      }
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 transition-all duration-300">
      {/* Header Panel */}
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between">
        <h2 className="font-poppins text-lg font-bold text-text-custom">Profile Settings</h2>
      </header>

      {/* Main Workspace */}
      <main className="p-6 max-w-6xl space-y-6">
        
        {/* Intro */}
        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-text-custom">Manage Personal Data</h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Update your registered academic details, change passwords, customize wellness alert thresholds, or inspect privacy parameters.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Student Info */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
              <FaUser className="text-primary text-base" />
              <span>Registered Student Information</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-semibold uppercase">Full Name</span>
                <span className="col-span-2 text-text-custom font-bold">{user.name}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-semibold uppercase">Student ID</span>
                <span className="col-span-2 text-text-custom font-mono">{user.studentId}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-semibold uppercase">Course Path</span>
                <span className="col-span-2 text-text-custom font-bold">{user.course}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-semibold uppercase">Academic Year</span>
                <span className="col-span-2 text-text-custom font-bold">{user.year}</span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-slate-400 font-semibold uppercase">Registered Email</span>
                <span className="col-span-2 text-text-custom font-bold">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Password Change */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
              <FaLock className="text-primary text-base" />
              <span>Change Portal Password</span>
            </h3>

            {passSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700">
                ✓ Password updated successfully.
              </div>
            )}
            {passError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-[10px] font-semibold text-red-600">
                {passError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-text-custom outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-text-custom outline-none focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-2 text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 transition-all"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Card 3: Notification Toggles */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
              <FaBell className="text-secondary text-base" />
              <span>Notification Preferences</span>
            </h3>

            {settingsSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700">
                ✓ Alert settings updated.
              </div>
            )}

            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="space-y-2.5">
                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={apptReminders}
                    onChange={() => setApptReminders(!apptReminders)}
                    className="rounded border-slate-300 text-primary mt-0.5 h-4 w-4 focus:ring-primary/25"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-text-custom">Appointment Reminders</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Receive confirmations and join link reminders via email.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={weeklyReports}
                    onChange={() => setWeeklyReports(!weeklyReports)}
                    className="rounded border-slate-300 text-primary mt-0.5 h-4 w-4 focus:ring-primary/25"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-text-custom">Weekly Wellness Reports</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Summary reports detailing weekly mood changes.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={() => setEmailAlerts(!emailAlerts)}
                    className="rounded border-slate-300 text-primary mt-0.5 h-4 w-4 focus:ring-primary/25"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-text-custom">Educational Newsletters</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Monthly self-help articles, exercises, and study guides.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={() => setSmsAlerts(!smsAlerts)}
                    className="rounded border-slate-300 text-primary mt-0.5 h-4 w-4 focus:ring-primary/25"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-text-custom">Crisis Coordinator SMS Alerts</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Emergency counselor dispatch alerts if stress remains critical.</span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-secondary py-2 text-xs font-bold text-white shadow-md shadow-secondary/15 hover:bg-secondary/90 transition-all"
              >
                Save Preferences
              </button>
            </form>
          </div>

          {/* Card 4: Safety & Privacy audit */}
          <div className="rounded-2xl border border-red-100 bg-red-50/5 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-poppins font-bold text-sm text-red-600 flex items-center space-x-2 border-b border-red-100/50 pb-3">
                <FaShieldAlt className="text-red-500 text-base" />
                <span>Confidentiality & Erasure</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                MindConnect uses <strong>privacy-by-design</strong>. Your profile, mood logs, appointments, and preferences are stored securely under your Firebase account. Erasing your account permanently deletes these records.
              </p>
            </div>
            
            <button
              onClick={handleClearAllData}
              disabled={isDeleting}
              className="w-full inline-flex items-center justify-center space-x-1.5 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/15 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              <FaTrashAlt size={10} />
              <span>{isDeleting ? 'Erasing Account...' : 'Erase Entire Account'}</span>
            </button>
          </div>

        </div>

      </main>
    </div>
  )
}