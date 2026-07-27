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
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('1st Year')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

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
      setError(
        'Password must be at least 6 characters.'
      )
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
          email: createdUser.email,
          role: 'student',

          notificationPreferences: {
            email: true,
            appointments: true,
            moodReminders: true
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

      /*
       * If Firebase Authentication succeeds but
       * Firestore profile creation fails, remove the
       * incomplete Authentication account.
       */
      if (
        createdUser &&
        err.code !== 'auth/email-already-in-use'
      ) {
        try {
          await deleteUser(createdUser)
        } catch (cleanupError) {
          console.error(
            'Failed to remove incomplete account:',
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
            'Network error. Check your connection and try again.'
          )
          break

        case 'auth/too-many-requests':
          setError(
            'Too many attempts. Please wait and try again.'
          )
          break

        case 'permission-denied':
        case 'firestore/permission-denied':
          setError(
            'Your account was created, but the profile could not be saved because of Firestore permissions.'
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
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-slate-100 to-emerald-50 flex items-center justify-center p-4 py-12">
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-primary/5 blur-3xl -z-10" />

      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-secondary/5 blur-3xl -z-10" />

      <div className="w-full max-w-lg rounded-2xl glass p-8 shadow-xl border border-white animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 mb-4 hover:scale-105 transition-transform duration-300"
          >
            <FaBrain className="text-2xl" />
          </Link>

          <h2 className="font-poppins text-2xl font-bold tracking-tight text-text-custom">
            Create Student Account
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Register below to start tracking your
            wellness and booking counselling sessions.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-bold text-slate-600 uppercase tracking-wide"
              >
                Student Name
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <FaUser size={12} />
                </span>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. Jane Doe"
                  autoComplete="name"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="studentId"
                className="text-xs font-bold text-slate-600 uppercase tracking-wide"
              >
                Student ID
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <FaIdCard size={12} />
                </span>

                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(event) =>
                    setStudentId(event.target.value)
                  }
                  placeholder="e.g. ST-23910"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="course"
                className="text-xs font-bold text-slate-600 uppercase tracking-wide"
              >
                Academic Course
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <FaGraduationCap size={12} />
                </span>

                <input
                  id="course"
                  type="text"
                  value={course}
                  onChange={(event) =>
                    setCourse(event.target.value)
                  }
                  placeholder="e.g. Software Engineering"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="year"
                className="text-xs font-bold text-slate-600 uppercase tracking-wide"
              >
                Academic Year
              </label>

              <select
                id="year"
                value={year}
                onChange={(event) =>
                  setYear(event.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3.5 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all cursor-pointer"
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

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-bold text-slate-600 uppercase tracking-wide"
            >
              Email Address
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <FaEnvelope size={12} />
              </span>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="your.email@university.edu"
                autoComplete="email"
                disabled={loading}
                required
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold text-slate-600 uppercase tracking-wide"
              >
                Password
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <FaLock size={12} />
                </span>

                <input
                  id="password"
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
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-bold text-slate-600 uppercase tracking-wide"
              >
                Confirm Password
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                  <FaLock size={12} />
                </span>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-primary py-3.5 mt-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/30 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-200"
          >
            <FaUserPlus />

            <span>
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </span>
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-6 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}

            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}