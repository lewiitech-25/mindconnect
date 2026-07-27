import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  FaBrain,
  FaThLarge,
  FaSmile,
  FaCalendarAlt,
  FaBookOpen,
  FaUser,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUserMd,
  FaUserShield
} from 'react-icons/fa'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedUser = localStorage.getItem('studentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('studentUser')
    navigate('/')
  }

  const role = user?.role || 'student'

  const getMenuItems = () => {
    if (role === 'counselor') {
      return [
        { path: '/counselor', name: 'Counselor Queue', icon: FaUserMd },
        { path: '/resources', name: 'Wellness Library', icon: FaBookOpen },
        { path: '/profile', name: 'Profile Settings', icon: FaUser },
      ]
    }
    if (role === 'admin') {
      return [
        { path: '/admin', name: 'Campus Analytics', icon: FaUserShield },
        { path: '/counselor', name: 'Counselor Queue', icon: FaUserMd },
        { path: '/resources', name: 'Wellness Library', icon: FaBookOpen },
        { path: '/profile', name: 'Profile Settings', icon: FaUser },
      ]
    }
    return [
      { path: '/dashboard', name: 'Dashboard', icon: FaThLarge },
      { path: '/mood', name: 'Mood Tracker', icon: FaSmile },
      { path: '/appointments', name: 'Appointments', icon: FaCalendarAlt },
      { path: '/resources', name: 'Resources', icon: FaBookOpen },
      { path: '/profile', name: 'Profile Settings', icon: FaUser },
    ]
  }

  const menuItems = getMenuItems()
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname)

  if (isPublicPage) return null

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 shadow-md transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Header / Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200">
          <NavLink
            to={role === 'counselor' ? '/counselor' : role === 'admin' ? '/admin' : '/dashboard'}
            className="flex items-center space-x-2.5 overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
              <FaBrain className="text-lg" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-poppins text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                  Mind<span className="text-primary">Connect</span>
                </span>
                <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">
                  {role} Portal
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-primary hover:border-primary transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
          </button>
        </div>

        {/* User Card */}
        {!isCollapsed && user && (
          <div className="m-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3 shadow-2xs">
            <div className="relative shrink-0">
              <img
                src={role === 'counselor' ? '/images/student_portrait_2.jpg' : '/images/student_portrait_1.jpg'}
                alt="Profile avatar"
                className="h-10 w-10 rounded-full object-cover border-2 border-primary shadow-sm"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-extrabold text-slate-900 truncate leading-snug">{user.name}</h4>
              <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                {role}
              </span>
            </div>
          </div>
        )}

        {isCollapsed && user && (
          <div className="my-4 flex justify-center">
            <div className="relative">
              <img
                src={role === 'counselor' ? '/images/student_portrait_2.jpg' : '/images/student_portrait_1.jpg'}
                alt="Profile avatar"
                className="h-10 w-10 rounded-full object-cover border-2 border-primary shadow-sm"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                  }`
                }
              >
                <Icon className="text-lg shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-3 space-y-1">
        <NavLink
          to="/emergency"
          className={({ isActive }) =>
            `flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-extrabold transition-all duration-200 border ${
              isActive
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20 border-red-600'
                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
            }`
          }
        >
          <FaExclamationTriangle className="text-lg shrink-0 animate-pulse" />
          {!isCollapsed && <span className="whitespace-nowrap">EMERGENCY HELP</span>}
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex w-full items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-red-600 transition-all duration-200"
          aria-label="Logout"
        >
          <FaSignOutAlt className="text-lg shrink-0 text-slate-500" />
          {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
