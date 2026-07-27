import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaBrain,
  FaEnvelope,
  FaLock,
  FaSignInAlt
} from 'react-icons/fa'
import {
  signInWithEmailAndPassword
} from 'firebase/auth'
import {
  doc,
  getDoc
} from 'firebase/firestore'

import { auth, db } from '../firebase/config'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setSubmitting(true)

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        )

      const firebaseUser = userCredential.user

      const userReference = doc(
        db,
        'users',
        firebaseUser.uid
      )

      const userSnapshot = await getDoc(userReference)

      if (!userSnapshot.exists()) {
        setError(
          'Your account was authenticated, but no user profile was found.'
        )
        return
      }

      const profile = userSnapshot.data()
      const role = profile.role || 'student'

      if (role === 'admin') {
        navigate('/admin', { replace: true })
        return
      }

      if (role === 'counselor') {
        navigate('/counselor', { replace: true })
        return
      }

      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('Login failed:', error)

      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Invalid email or password.')
          break

        case 'auth/invalid-email':
          setError('Please enter a valid email address.')
          break

        case 'auth/user-disabled':
          setError(
            'This account has been disabled. Please contact support.'
          )
          break

        case 'auth/too-many-requests':
          setError(
            'Too many failed login attempts. Please try again later.'
          )
          break

        case 'auth/network-request-failed':
          setError(
            'Network error. Check your internet connection and try again.'
          )
          break

        default:
          setError(
            'Unable to sign in. Please try again.'
          )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-saas-canvas bg-saas-grid relative flex items-center justify-center p-4 py-12 overflow-hidden page-transition-enter">
      {/* Background glow effects */}
      <div className="absolute top-[15%] left-[20%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-primary/30 via-cyan-400/20 to-blue-600/10 blur-3xl animate-orb-1 pointer-events-none" />

      <div className="absolute bottom-[15%] right-[20%] h-[450px] w-[450px] rounded-full bg-gradient-to-br from-emerald-400/25 via-teal-500/20 to-secondary/10 blur-3xl animate-orb-2 pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/15 blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl glass-saas-card p-8 shadow-2xl relative z-10 border border-white/15 animate-in zoom-in-95 duration-200">
        {/* Branding */}
        <div className="text-center mb-7">
          <Link
            to="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 text-white shadow-lg shadow-primary/30 mb-3 hover:scale-105 transition-transform duration-300"
            aria-label="Return to home page"
          >
            <FaBrain className="text-2xl" />
          </Link>

          <h1 className="font-poppins text-2xl font-bold tracking-tight text-white">
            Welcome to MindConnect
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your wellness portal
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-800/80 bg-red-950/60 p-3.5 text-xs font-semibold text-red-300"
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[11px] font-bold text-slate-300 uppercase tracking-wider"
            >
              Email Address
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <FaEnvelope size={13} />
              </span>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="email@university.edu"
                autoComplete="email"
                disabled={submitting}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-bold text-slate-300 uppercase tracking-wider"
              >
                Password
              </label>

              <button
                type="button"
                className="text-[11px] font-semibold text-primary hover:text-cyan-400 transition-colors"
              >
                Forgot?
              </button>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <FaLock size={13} />
              </span>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={submitting}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
              />
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                disabled={submitting}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/40"
              />

              <span>Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-cyan-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 transition-all duration-200"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <FaSignInAlt />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Registration link */}
        <div className="mt-6 border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-slate-400">
            Need a student account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-cyan-400 transition-colors"
            >
              Sign up today
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}