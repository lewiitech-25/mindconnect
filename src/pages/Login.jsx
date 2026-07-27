import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaBrain, FaEnvelope, FaLock, FaSignInAlt, FaUserGraduate, FaUserMd, FaUserShield } from 'react-icons/fa'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  // Seed default test accounts on load
  useEffect(() => {
    const existingUsers = localStorage.getItem('registeredUsers')
    const users = existingUsers ? JSON.parse(existingUsers) : []
    
    // Test Student
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

    // Test Counselor
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

    // Test Admin
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
    
    // Seed mock mood data if student
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

    // Redirect based on role
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
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-slate-100 to-emerald-50 flex items-center justify-center p-4 py-12">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-3xl -z-10"></div>

      <div className="w-full max-w-md rounded-2xl glass p-8 shadow-xl border border-white animate-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 mb-3 hover:scale-105 transition-transform duration-300">
            <FaBrain className="text-2xl" />
          </Link>
          <h2 className="font-poppins text-2xl font-bold tracking-tight text-text-custom">
            Welcome to MindConnect
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Role-Based Portal Access (Student, Counselor, Admin)
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* Demo Fast Login Switcher (HCI Feature) */}
        <div className="mb-6 p-3.5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
            ⚡ Quick Demo Role Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/60 text-primary transition-all text-xs font-semibold"
            >
              <FaUserGraduate className="text-base mb-1" />
              <span className="text-[10px]">Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('counselor')}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 text-secondary transition-all text-xs font-semibold"
            >
              <FaUserMd className="text-base mb-1" />
              <span className="text-[10px]">Counselor</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/60 text-purple-600 transition-all text-xs font-semibold"
            >
              <FaUserShield className="text-base mb-1" />
              <span className="text-[10px]">Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
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
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Password
              </label>
              <a href="#" className="text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">
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
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-text-custom outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Remember check */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="rounded border-slate-300 text-primary focus:ring-primary/30 h-4 w-4"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all duration-200"
          >
            <FaSignInAlt />
            <span>Sign In</span>
          </button>
        </form>

        {/* Register Redirect */}
        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <p className="text-xs text-slate-500">
            Need a student account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Sign up today
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
