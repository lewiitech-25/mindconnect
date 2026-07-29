import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaBrain, FaUser, FaIdCard, FaGraduationCap, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa'

export default function Register() {
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('1st Year')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name || !studentId || !course || !email || !password || !confirmPassword) {
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

    const existingUsers = localStorage.getItem('registeredUsers')
    const users = existingUsers ? JSON.parse(existingUsers) : []
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError('An account with this email already exists.')
      return
    }

    const newUser = {
      role: 'student',
      name,
      studentId,
      course,
      year,
      email,
      password
    }

    users.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(users))
    localStorage.setItem('studentUser', JSON.stringify(newUser))

    const mockMoods = [
      { mood: 'Okay', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), note: 'A bit overwhelmed starting classes.' },
      { mood: 'Stressed', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Coursework assignment deadline.' },
      { mood: 'Good', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), note: 'Met some classmates for group projects.' },
      { mood: 'Sad', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), note: 'Felt tired from studying late.' },
      { mood: 'Happy', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Did well on the weekly quiz.' },
      { mood: 'Good', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Nice weekend rest.' }
    ]
    localStorage.setItem(`moods_${email}`, JSON.stringify(mockMoods))

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-mesh-light bg-dot-pattern relative flex items-center justify-center p-4 py-12 overflow-hidden page-transition-enter text-slate-900">
      
      {/* Behance Medical Glowing Orbs */}
      <div className="absolute top-[10%] left-[15%] h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-blue-400/25 via-sky-300/20 to-primary/15 blur-3xl animate-orb-1 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[15%] h-[450px] w-[450px] rounded-full bg-gradient-to-br from-emerald-400/25 via-teal-300/20 to-secondary/15 blur-3xl animate-orb-2 pointer-events-none"></div>

      <div className="w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-2xl p-8 shadow-2xl relative z-10 border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-blue-700 text-white shadow-lg shadow-primary/30 mb-3 hover:scale-105 transition-transform duration-300">
            <FaBrain className="text-2xl" />
          </Link>
          <h2 className="font-poppins text-2xl font-extrabold tracking-tight text-slate-900">
            Create Student Account
          </h2>
          <p className="text-xs font-bold text-slate-600 mt-1">
            Register below to start tracking your wellness and booking counseling
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Row 1: Name and Student ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                Student Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <FaUser size={12} />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                Student ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <FaIdCard size={12} />
                </span>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. ST-23910"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Course and Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                Academic Course
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <FaGraduationCap size={12} />
                </span>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. Software Engineering"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-3 text-xs font-bold text-slate-900 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <FaEnvelope size={12} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Row 3: Password and Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <FaLock size={12} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <FaLock size={12} />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-blue-700 py-3.5 mt-2 text-xs font-extrabold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            <FaUserPlus />
            <span>Create Account</span>
          </button>

        </form>

        {/* Login Redirect */}
        <div className="mt-6 border-t border-slate-100 pt-5 text-center">
          <p className="text-xs font-semibold text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-primary hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
