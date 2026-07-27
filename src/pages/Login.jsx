import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaBrain, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Seed default test user on load for easy testing/presentation
  useEffect(() => {
    const existingUsers = localStorage.getItem('registeredUsers')
    const users = existingUsers ? JSON.parse(existingUsers) : []
    
    // Check if test user exists, otherwise add it
    const testUser = users.find(u => u.email === 'student@university.edu')
    if (!testUser) {
      users.push({
        name: 'Alex Mercer',
        studentId: 'ST-94821',
        course: 'Computer Science',
        year: '3rd Year',
        email: 'student@university.edu',
        password: 'password'
      })
      localStorage.setItem('registeredUsers', JSON.stringify(users))
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    const existingUsers = localStorage.getItem('registeredUsers')
    const users = existingUsers ? JSON.parse(existingUsers) : []
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (matchedUser) {
      localStorage.setItem('studentUser', JSON.stringify(matchedUser))
      
      // Let's seed some mock mood data for the dashboard chart if none exists
      const storedMoods = localStorage.getItem(`moods_${matchedUser.email}`)
      if (!storedMoods) {
        const mockMoods = [
          { mood: 'Okay', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), note: 'A bit overwhelmed with the project load.' },
          { mood: 'Stressed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Midterm exams today.' },
          { mood: 'Good', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), note: 'Felt better after gym and study group.' },
          { mood: 'Sad', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Missed home and family.' },
          { mood: 'Happy', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Aced my exam!' },
          { mood: 'Good', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Relaxed evening with friends.' }
        ]
        localStorage.setItem(`moods_${matchedUser.email}`, JSON.stringify(mockMoods))
      }

      navigate('/dashboard')
    } else {
      setError('Invalid email or password. Use student@university.edu / password.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-slate-100 to-emerald-50 flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-3xl -z-10"></div>

      <div className="w-full max-w-md rounded-2xl glass p-8 shadow-xl border border-white animate-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 mb-4 hover:scale-105 transition-transform duration-300">
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
          {/* Email input */}
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
                placeholder="student@university.edu"
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-10 pr-4 text-sm text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
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

          {/* Remember and Demo details */}
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/30 active:scale-[0.99] transition-all duration-200"
          >
            <FaSignInAlt />
            <span>Sign In</span>
          </button>
        </form>

        {/* Demo Credentials Alert */}
        <div className="mt-6 p-3 rounded-xl bg-blue-50/50 border border-blue-100/50 text-[11px] text-slate-600 leading-normal text-center">
          <strong>Demo Login Details:</strong><br />
          Email: <code className="text-primary font-semibold">student@university.edu</code><br />
          Password: <code className="text-primary font-semibold">password</code>
        </div>

        {/* Register Redirect */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up today
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
