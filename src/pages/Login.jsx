import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaBrain, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'

import { auth, db } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const firebaseUser = userCredential.user

      // Retrieve user profile from Firestore
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        setError('User profile not found.')
        return
      }

      const profile = userSnap.data()

      try {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  const profile = await getUserProfile(
    credential.user.uid
  )

  console.log('Logged in user:', profile)

  navigate('/dashboard')
} catch (error) {
  console.error('Login failed:', error)
  setError('Invalid email or password.')
}
      

      navigate('/dashboard')
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Invalid email or password.')
          break

        case 'auth/invalid-email':
          setError('Invalid email address.')
          break

        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Try again later.')
          break

        default:
          console.error(err)
          setError(err.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-slate-100 to-emerald-50 flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-3xl -z-10"></div>

      <div className="w-full max-w-md rounded-2xl glass p-8 shadow-xl border border-white animate-in zoom-in-95 duration-200">

        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 mb-4 hover:scale-105 transition-transform duration-300"
          >
            <FaBrain className="text-2xl" />
          </Link>

          <h2 className="font-poppins text-2xl font-bold tracking-tight text-text-custom">
            Welcome to MindConnect
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Confidential portal login for registered students
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Email Address
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaEnvelope size={14} />
              </span>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Password
              </label>

              <a
                href="#"
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaLock size={14} />
              </span>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="rounded border-slate-300 text-primary focus:ring-primary/30 h-4 w-4"
              />
              <span className="text-xs">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/30 active:scale-[0.99] transition-all duration-200"
          >
            <FaSignInAlt />
            <span>Sign In</span>
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign up today
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}