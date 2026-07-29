import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaBrain,
  FaUserMd,
  FaIdCard,
  FaBriefcase,
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

export default function CounselorRegister() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [staffId, setStaffId] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [qualification, setQualification] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) {
      return
    }

    setError('')

    const cleanName = name.trim()
    const cleanStaffId = staffId.trim()
    const cleanSpecialty = specialty.trim()
    const cleanQualification = qualification.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (
      !cleanName ||
      !cleanStaffId ||
      !cleanSpecialty ||
      !cleanQualification ||
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
          staffId: cleanStaffId,
          specialty: cleanSpecialty,
          qualification: cleanQualification,
          email: createdUser.email || cleanEmail,

          role: 'counselor',

          accountStatus: 'pending',
          isAvailable: false,

          notificationPreferences: {
            emailAlerts: true,
            smsAlerts: false,
            appointmentReminders: true,
            newBookingAlerts: true
          },

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      )

      navigate('/counselor', {
        replace: true
      })
    } catch (err) {
      console.error(
        'Counselor registration failed:',
        err
      )

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
            'The counsellor profile could not be saved because of Firestore permissions.'
          )
          break

        default:
          setError(
            'Unable to create the counsellor account. Please try again.'
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
        {/* Brand header */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 text-white shadow-lg shadow-primary/30 mb-3 hover:scale-105 transition-transform duration-300"
            aria-label="Return to home page"
          >
            <FaBrain className="text-2xl" />
          </Link>

          <h1 className="font-poppins text-2xl font-bold tracking-tight text-white">
            Create Counsellor Account
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Register as a university mental wellness
            counsellor.
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
              label="Full Name"
              icon={<FaUserMd size={12} />}
            >
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Dr. Jane Smith"
                autoComplete="name"
                disabled={loading}
                required
                className={inputClassName}
              />
            </FormField>

            <FormField
              id="staffId"
              label="Staff ID"
              icon={<FaIdCard size={12} />}
            >
              <input
                id="staffId"
                name="staffId"
                type="text"
                value={staffId}
                onChange={(event) =>
                  setStaffId(event.target.value)
                }
                placeholder="e.g. COUN-1024"
                autoComplete="off"
                disabled={loading}
                required
                className={inputClassName}
              />
            </FormField>
          </div>

          <FormField
            id="specialty"
            label="Counselling Specialty"
            icon={<FaBriefcase size={12} />}
          >
            <input
              id="specialty"
              name="specialty"
              type="text"
              value={specialty}
              onChange={(event) =>
                setSpecialty(event.target.value)
              }
              placeholder="e.g. Anxiety and Stress Management"
              disabled={loading}
              required
              className={inputClassName}
            />
          </FormField>

          <FormField
            id="qualification"
            label="Professional Qualification"
            icon={<FaUserMd size={12} />}
          >
            <input
              id="qualification"
              name="qualification"
              type="text"
              value={qualification}
              onChange={(event) =>
                setQualification(event.target.value)
              }
              placeholder="e.g. MSc Clinical Psychology"
              disabled={loading}
              required
              className={inputClassName}
            />
          </FormField>

          <FormField
            id="email"
            label="Work Email Address"
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
              placeholder="counsellor@university.edu"
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

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-[11px] leading-relaxed text-amber-200">
              Counsellor accounts may require administrator
              approval before accessing student information.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-cyan-500 py-3.5 mt-2 text-xs font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 transition-all duration-200"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />

                <span>
                  Creating Counsellor Account...
                </span>
              </>
            ) : (
              <>
                <FaUserPlus />

                <span>
                  Create Counsellor Account
                </span>
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