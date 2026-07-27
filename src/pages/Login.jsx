import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaBrain, FaEnvelope, FaLock, FaSignInAlt, FaUserGraduate, FaUserMd, FaUserShield } from 'react-icons/fa'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const existingUsers = localStorage.getItem('registeredUsers')
    const users = existingUsers ? JSON.parse(existingUsers) : []
    
    if (!users.some(u => u.email === 'student@university.edu')) {
      users.push({
        role: 'student',
        name: 'Alex Mercer',
        studentId: 'ST-94821',
        course: 'Computer Science',
        year: '3rd Year',
        email: 'student@university.edu',
        password: 'password'
      })
    }

    if (!users.some(u => u.email === 'counselor@university.edu')) {
      users.push({
        role: 'counselor',
        name: 'Dr. Jane Smith',
        studentId: 'CN-102',
        course: 'Clinical Psychology',
        year: 'Senior Faculty',
        email: 'counselor@university.edu',
        password: 'password'
      })
    }

    if (!users.some(u => u.email === 'admin@university.edu')) {
      users.push({
        role: 'admin',
        name: 'Dr. Robert Vance',
        studentId: 'ADM-001',
        course: 'Wellness Services',
        year: 'Director',
        email: 'admin@university.edu',
        password: 'password'
      })
    }

    localStorage.setItem('registeredUsers', JSON.stringify(users))
  }, [])

  const loginUserObj = (userObj) => {
    localStorage.setItem('studentUser', JSON.stringify(userObj))
    
    if (userObj.role === 'student') {
      const storedMoods = localStorage.getItem(`moods_${userObj.email}`)
      if (!storedMoods) {
        const mockMoods = [
          { mood: 'Okay', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), note: 'A bit overwhelmed with coursework.' },
          { mood: 'Stressed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Midterm exams preparation.' },
          { mood: 'Good', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), note: 'Felt better after studying in group.' },
          { mood: 'Sad', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Missed home and family.' },
          { mood: 'Happy', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Aced my programming exam!' },
          { mood: 'Good', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Relaxed evening with friends.' }
        ]
        localStorage.setItem(`moods_${userObj.email}`, JSON.stringify(mockMoods))
      }
    }

    if (userObj.role === 'counselor') {
      navigate('/counselor')
    } else if (userObj.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

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
      loginUserObj(matchedUser)
    } else {
      setError('Invalid email or password. Use demo buttons below for instant access.')
    }
  }

  const handleQuickDemoLogin = (role) => {
    const existingUsers = localStorage.getItem('registeredUsers')
    const users = existingUsers ? JSON.parse(existingUsers) : []
    const matched = users.find(u => (u.role || 'student') === role)
    if (matched) {
      loginUserObj(matched)
    }
  }

  return (
    <div className="min-h-screen bg-saas-canvas bg-saas-grid relative flex items-center justify-center p-4 py-12 overflow-hidden page-transition-enter">
      
      {/* Behance Medical SaaS Glowing Spotlights */}
      <div className="absolute top-[15%] left-[20%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-primary/30 via-cyan-400/20 to-blue-600/10 blur-3xl animate-orb-1 pointer-events-none"></div>
      <div className="absolute bottom-[15%] right-[20%] h-[450px] w-[450px] rounded-full bg-gradient-to-br from-emerald-400/25 via-teal-500/20 to-secondary/10 blur-3xl animate-orb-2 pointer-events-none"></div>
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-purple-500/15 blur-3xl animate-pulse-glow pointer-events-none"></div>

      <div className="w-full max-w-md rounded-3xl glass-saas-card p-8 shadow-2xl relative z-10 border border-white/15 animate-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 text-white shadow-lg shadow-primary/30 mb-3 hover:scale-105 transition-transform duration-300">
            <FaBrain className="text-2xl" />
          </Link>
          <h2 className="font-poppins text-2xl font-bold tracking-tight text-white">
            Welcome to MindConnect
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Medical SaaS Student Wellness Portal Access
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs font-semibold text-red-300">
            {error}
          </div>
        )}

        {/* Demo Fast Login Switcher */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/70 border border-white/10 shadow-inner space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            ⚡ Quick Demo Role Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all text-xs font-semibold"
            >
              <FaUserGraduate className="text-base mb-1 text-primary" />
              <span className="text-[10px]">Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('counselor')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all text-xs font-semibold"
            >
              <FaUserMd className="text-base mb-1 text-secondary" />
              <span className="text-[10px]">Counselor</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-all text-xs font-semibold"
            >
              <FaUserShield className="text-base mb-1 text-purple-400" />
              <span className="text-[10px]">Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaEnvelope size={13} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@university.edu"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-[11px] font-semibold text-primary hover:text-cyan-400 transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FaLock size={13} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Remember check */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/40 h-4 w-4"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-cyan-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            <FaSignInAlt />
            <span>Sign In</span>
          </button>
        </form>

        {/* Register Redirect */}
        <div className="mt-6 border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-slate-400">
            Need a student account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-cyan-400 transition-colors">
              Sign up today
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
