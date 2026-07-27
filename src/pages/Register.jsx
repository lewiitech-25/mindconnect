import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaBrain,
  FaUser,
  FaIdCard,
  FaGraduationCap,
  FaEnvelope,
  FaLock,
  FaUserPlus
} from 'react-icons/fa'

import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile
} from 'firebase/auth'

import {
  doc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'

import { auth, db } from '../firebase/config'

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('1st Year')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) {
      return
    }

    setError('')

    const cleanName = name.trim()
    const cleanStudentId = studentId.trim()
    const cleanCourse = course.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (
      !cleanName ||
      !cleanStudentId ||
      !cleanCourse ||
      !cleanEmail ||
      !password ||
      !confirmPassword
    ) {
      setError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    let createdUser = null

    try {
      setLoading(true)

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        )

      createdUser = userCredential.user

      await updateProfile(createdUser, {
        displayName: cleanName
      })

      await setDoc(
        doc(db, 'users', createdUser.uid),
        {
          uid: createdUser.uid,
          name: cleanName,
          studentId: cleanStudentId,
          course: cleanCourse,
          year,
          email: createdUser.email || cleanEmail,
          role: 'student',

          notificationPreferences: {
            emailAlerts: true,
            smsAlerts: false,
            weeklyReports: true,
            apptReminders: true
          },

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      )

      navigate('/dashboard', {
        replace: true
      })
    } catch (err) {
      console.error('Registration failed:', err)

      if (
        createdUser &&
        err.code !== 'auth/email-already-in-use'
      ) {
        try {
          await deleteUser(createdUser)
        } catch (cleanupError) {
          console.error(
            'Failed to remove incomplete Firebase account:',
            cleanupError
          )
        }
      }

      switch (err.code) {
        case 'auth/email-already-in-use':
          setError(
            'An account with this email already exists.'
          )
          break

        case 'auth/invalid-email':
          setError(
            'Please enter a valid email address.'
          )
          break

        case 'auth/weak-password':
          setError(
            'Password must be at least 6 characters.'
          )
          break

        case 'auth/network-request-failed':
          setError(
            'Network error. Check your internet connection and try again.'
          )
          break

        case 'auth/too-many-requests':
          setError(
            'Too many registration attempts. Please wait and try again.'
          )
          break

        case 'permission-denied':
        case 'firestore/permission-denied':
          setError(
            'Your account could not be completed because the profile was blocked by Firestore permissions.'
          )
          break

        default:
          setError(
            'Unable to create your account. Please try again.'
          )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-saas-canvas bg-saas-grid relative flex items-center justify-center p-4 py-12 overflow-hidden page-transition-enter">
      {/* Background glow effects */}
      <div className="absolute top-[15%] left-[20%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-primary/30 via-cyan-400/20 to-blue-600/10 blur-3xl animate-orb-1 pointer-events-none" />

      <div className="absolute bottom-[15%] right-[20%] h-[450px] w-[450px] rounded-full bg-gradient-to-br from-emerald-400/25 via-teal-500/20 to-secondary/10 blur-3xl animate-orb-2 pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/15 blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="w-full max-w-lg rounded-3xl glass-saas-card p-8 shadow-2xl relative z-10 border border-white/15 animate-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 text-white shadow-lg shadow-primary/30 mb-3 hover:scale-105 transition-transform duration-300"
            aria-label="Return to home page"
          >
            <FaBrain className="text-2xl" />
          </Link>

          <h1 className="font-poppins text-2xl font-bold tracking-tight text-white">
            Create Student Account
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Register to track your wellbeing and book counselling sessions.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs font-semibold text-red-300"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="name"
              label="Student Name"
              icon={<FaUser size={12} />}
            >
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Jane Doe"
                autoComplete="name"
                disabled={loading}
                required
                className={inputClassName}
              />
            </FormField>

            <FormField
              id="studentId"
              label="Student ID"
              icon={<FaIdCard size={12} />}
            >
              <input
                id="studentId"
                name="studentId"
                type="text"
                value={studentId}
                onChange={(event) =>
                  setStudentId(event.target.value)
                }
                placeholder="e.g. ST-23910"
                autoComplete="off"
                disabled={loading}
                required
                className={inputClassName}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="course"
              label="Academic Course"
              icon={<FaGraduationCap size={12} />}
            >
              <input
                id="course"
                name="course"
                type="text"
                value={course}
                onChange={(event) =>
                  setCourse(event.target.value)
                }
                placeholder="e.g. Software Engineering"
                autoComplete="organization-title"
                disabled={loading}
                required
                className={inputClassName}
              />
            </FormField>

            <div className="space-y-1.5">
              <label
                htmlFor="year"
                className="text-[11px] font-bold text-slate-300 uppercase tracking-wider"
              >
                Academic Year
              </label>

              <select
                id="year"
                name="year"
                value={year}
                onChange={(event) =>
                  setYear(event.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 px-3 text-xs text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 transition-all cursor-pointer"
              >
                <option value="1st Year">
                  1st Year
                </option>

                <option value="2nd Year">
                  2nd Year
                </option>

                <option value="3rd Year">
                  3rd Year
                </option>

                <option value="4th Year">
                  4th Year
                </option>

                <option value="Postgraduate">
                  Postgraduate
                </option>
              </select>
            </div>
          </div>

          <FormField
            id="email"
            label="Email Address"
            icon={<FaEnvelope size={12} />}
          >
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="your.email@university.edu"
              autoComplete="email"
              disabled={loading}
              required
              className={inputClassName}
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="password"
              label="Password"
              icon={<FaLock size={12} />}
            >
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                minLength={6}
                disabled={loading}
                required
                className={inputClassName}
              />
            </FormField>

            <FormField
              id="confirmPassword"
              label="Confirm Password"
              icon={<FaLock size={12} />}
            >
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Repeat password"
                autoComplete="new-password"
                minLength={6}
                disabled={loading}
                required
                className={inputClassName}
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-cyan-500 py-3.5 mt-2 text-xs font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 transition-all duration-200"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <FaUserPlus />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}

            <Link
              to="/login"
              className="font-semibold text-primary hover:text-cyan-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const inputClassName =
  'w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-9 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 transition-all'

function FormField({
  id,
  label,
  icon,
  children
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-bold text-slate-300 uppercase tracking-wider"
      >
        {label}
      </label>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
          {icon}
        </span>

        {children}
      </div>
    </div>
  )
}