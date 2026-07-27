import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import {
  FaUser,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaTrashAlt
} from 'react-icons/fa'

import { auth } from '../firebase/config'
import {
  changeUserPassword,
  eraseUserAccount,
  getUserProfile,
  updateNotificationPreferences
} from '../firebase/userService'

export default function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passSuccess, setPassSuccess] = useState(false)
  const [passError, setPassError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [apptReminders, setApptReminders] = useState(true)
  const [settingsSuccess, setSettingsSuccess] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [isSavingSettings, setIsSavingSettings] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setUser(null)
          setLoading(false)
          navigate('/login', { replace: true })
          return
        }

        try {
          setLoading(true)
          setPageError('')

          const profile = await getUserProfile(currentUser.uid)

          const completeProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            name:
              currentUser.displayName ||
              currentUser.email?.split('@')[0] ||
              'MindConnect User',
            role: 'student',
            studentId: 'Not provided',
            course: 'Not provided',
            year: 'Not provided',
            ...profile
          }

          setUser(completeProfile)

          const preferences =
            completeProfile.notificationPreferences || {}

          setEmailAlerts(preferences.emailAlerts ?? true)
          setSmsAlerts(preferences.smsAlerts ?? false)
          setWeeklyReports(preferences.weeklyReports ?? true)
          setApptReminders(preferences.apptReminders ?? true)
        } catch (error) {
          console.error('Failed to load profile:', error)

          setPageError(
            'Unable to load your profile information. Please refresh and try again.'
          )
        } finally {
          setLoading(false)
        }
      }
    )

    return () => unsubscribe()
  }, [navigate])

  const handleChangePassword = async (event) => {
    event.preventDefault()

    setPassError('')
    setPassSuccess(false)

    if (!password || !confirmPassword) {
      setPassError('All password fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setPassError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setPassError(
        'Password must contain at least 6 characters.'
      )
      return
    }

    try {
      setIsChangingPassword(true)

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
        setPassError(
          'Please log out, log in again, and retry the password change.'
        )
      } else if (error.code === 'auth/weak-password') {
        setPassError(
          'Please choose a stronger password.'
        )
      } else {
        setPassError(
          'Unable to update your password. Please try again.'
        )
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSaveNotifications = async (event) => {
    event.preventDefault()

    const currentUser = auth.currentUser

    if (!currentUser) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setIsSavingSettings(true)
      setSettingsError('')
      setSettingsSuccess(false)

      const notificationPreferences = {
        emailAlerts,
        smsAlerts,
        weeklyReports,
        apptReminders
      }

      await updateNotificationPreferences(
        currentUser.uid,
        notificationPreferences
      )

      setUser((currentProfile) => ({
        ...currentProfile,
        notificationPreferences
      }))

      setSettingsSuccess(true)

      setTimeout(() => {
        setSettingsSuccess(false)
      }, 3000)
    } catch (error) {
      console.error(
        'Failed to save notification preferences:',
        error
      )

      setSettingsError(
        'Unable to save your preferences. Please try again.'
      )
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleClearAllData = async () => {
    if (isDeleting) {
      return
    }

    const confirmed = window.confirm(
      'WARNING: This will permanently erase your profile, mood logs, appointments, preferences, and Firebase account. This action cannot be undone. Continue?'
    )

    if (!confirmed) {
      return
    }

    const currentUser = auth.currentUser

    if (!currentUser) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setIsDeleting(true)
      setPageError('')

      await eraseUserAccount(currentUser.uid)

      navigate('/', { replace: true })
    } catch (error) {
      console.error('Failed to erase account:', error)

      setIsDeleting(false)

      if (error.code === 'auth/requires-recent-login') {
        window.alert(
          'For security, please log out, log in again, and retry account deletion.'
        )
      } else {
        window.alert(
          'Unable to erase the account. Please try again.'
        )
      }
    }
  }

  const roleLabel =
    user?.role === 'admin'
      ? 'Administrator'
      : user?.role === 'counselor'
        ? 'Counselor'
        : 'Student'

  const identifierLabel =
    user?.role === 'admin'
      ? 'Staff ID'
      : user?.role === 'counselor'
        ? 'Counselor ID'
        : 'Student ID'

  const courseLabel =
    user?.role === 'admin'
      ? 'Department'
      : user?.role === 'counselor'
        ? 'Specialisation'
        : 'Course Path'

  const yearLabel =
    user?.role === 'student'
      ? 'Academic Year'
      : 'Position Level'

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh-light bg-dot-pattern flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-4 border-slate-200 border-t-primary animate-spin" />

          <p className="text-xs font-semibold text-slate-500">
            Loading profile...
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
            Profile Settings
          </h2>

          <p className="text-[10px] text-slate-400">
            {roleLabel} account
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-500">
          <FaShieldAlt className="text-secondary" />
          <span>Firebase Protected</span>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Intro */}
        <div className="space-y-1">
          <h1 className="font-poppins text-2xl font-bold text-text-custom">
            Manage Personal Data
          </h1>

          <p className="text-xs text-slate-500 max-w-2xl">
            Review your registered details, update your password,
            manage notification preferences, and control your
            account data.
          </p>
        </div>

        {pageError && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-xs font-semibold text-red-600"
          >
            {pageError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
              <FaUser className="text-primary text-base" />
              <span>Registered Account Information</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <ProfileRow
                label="Full Name"
                value={user.name}
              />

              <ProfileRow
                label="Account Role"
                value={roleLabel}
              />

              <ProfileRow
                label={identifierLabel}
                value={user.studentId}
                mono
              />

              <ProfileRow
                label={courseLabel}
                value={user.course}
              />

              <ProfileRow
                label={yearLabel}
                value={user.year}
              />

              <ProfileRow
                label="Registered Email"
                value={user.email}
                last
              />
            </div>
          </section>

          {/* Password Change */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
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
              <div
                role="alert"
                className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-[10px] font-semibold text-red-600"
              >
                {passError}
              </div>
            )}

            <form
              onSubmit={handleChangePassword}
              className="space-y-3.5"
            >
              <div className="space-y-1">
                <label
                  htmlFor="new-password"
                  className="text-[10px] font-bold text-slate-600 uppercase tracking-wide"
                >
                  New Password
                </label>

                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isChangingPassword}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirm-password"
                  className="text-[10px] font-bold text-slate-600 uppercase tracking-wide"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isChangingPassword}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md shadow-primary/10 hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              >
                {isChangingPassword
                  ? 'Updating Password...'
                  : 'Update Password'}
              </button>
            </form>
          </section>

          {/* Notification Preferences */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-poppins font-bold text-sm text-text-custom flex items-center space-x-2 border-b border-slate-50 pb-3">
              <FaBell className="text-secondary text-base" />
              <span>Notification Preferences</span>
            </h3>

            {settingsSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700">
                ✓ Notification preferences updated.
              </div>
            )}

            {settingsError && (
              <div
                role="alert"
                className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-[10px] font-semibold text-red-600"
              >
                {settingsError}
              </div>
            )}

            <form
              onSubmit={handleSaveNotifications}
              className="space-y-4"
            >
              <div className="space-y-2.5">
                <PreferenceCheckbox
                  checked={apptReminders}
                  onChange={setApptReminders}
                  title="Appointment Reminders"
                  description="Receive appointment confirmations and upcoming session reminders."
                  disabled={isSavingSettings}
                />

                <PreferenceCheckbox
                  checked={weeklyReports}
                  onChange={setWeeklyReports}
                  title="Weekly Wellness Reports"
                  description="Receive summaries showing your recent mood trends."
                  disabled={isSavingSettings}
                />

                <PreferenceCheckbox
                  checked={emailAlerts}
                  onChange={setEmailAlerts}
                  title="Educational Newsletters"
                  description="Receive mental wellness articles, exercises, and study guides."
                  disabled={isSavingSettings}
                />

                <PreferenceCheckbox
                  checked={smsAlerts}
                  onChange={setSmsAlerts}
                  title="Crisis Coordinator SMS Alerts"
                  description="Allow important emergency support alerts to be sent by SMS."
                  disabled={isSavingSettings}
                />
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="w-full inline-flex items-center justify-center rounded-xl bg-secondary py-2.5 text-xs font-bold text-white shadow-md shadow-secondary/15 hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              >
                {isSavingSettings
                  ? 'Saving Preferences...'
                  : 'Save Preferences'}
              </button>
            </form>
          </section>

          {/* Account Erasure */}
          <section className="rounded-2xl border border-red-100 bg-red-50/20 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-poppins font-bold text-sm text-red-600 flex items-center space-x-2 border-b border-red-100/50 pb-3">
                <FaShieldAlt className="text-red-500 text-base" />
                <span>Confidentiality and Erasure</span>
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                MindConnect stores your profile, mood logs,
                appointments, and preferences under your Firebase
                account. Erasing the account permanently removes
                these records and cannot be undone.
              </p>

              <div className="rounded-xl border border-red-100 bg-white/70 p-3 text-[10px] leading-relaxed text-red-600">
                You may need to log in again before Firebase allows
                this security-sensitive action.
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearAllData}
              disabled={isDeleting}
              className="w-full inline-flex items-center justify-center space-x-1.5 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-md shadow-red-500/15 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
            >
              <FaTrashAlt size={10} />

              <span>
                {isDeleting
                  ? 'Erasing Account...'
                  : 'Erase Entire Account'}
              </span>
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}

function ProfileRow({
  label,
  value,
  mono = false,
  last = false
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 ${
        last
          ? ''
          : 'border-b border-slate-100 pb-2'
      }`}
    >
      <span className="text-slate-400 font-semibold uppercase">
        {label}
      </span>

      <span
        className={`sm:col-span-2 break-words text-text-custom ${
          mono ? 'font-mono' : 'font-bold'
        }`}
      >
        {value || 'Not provided'}
      </span>
    </div>
  )
}

function PreferenceCheckbox({
  checked,
  onChange,
  title,
  description,
  disabled
}) {
  return (
    <label className="flex items-start space-x-3 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        disabled={disabled}
        className="rounded border-slate-300 text-primary mt-0.5 h-4 w-4 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <span>
        <span className="block text-xs font-semibold text-text-custom">
          {title}
        </span>

        <span className="block text-[10px] text-slate-500 mt-0.5 leading-relaxed">
          {description}
        </span>
      </span>
    </label>
  )
}