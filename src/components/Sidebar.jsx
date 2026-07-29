import { useState } from 'react'
import {
  NavLink,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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

  const navigate = useNavigate()
  const location = useLocation()

  const {
  profile: user,
  role,
  logout
} = useAuth()


  const handleLogout = async () => {
  try {
    await logout()
    navigate('/login', { replace: true })
  } catch (error) {
    console.error('Failed to log out:', error)
  }
}

  const getHomePath = () => {
    if (role === 'admin') {
      return '/admin'
    }

    if (role === 'counselor') {
      return '/counselor'
    }

    return '/dashboard'
  }

  const getMenuItems = () => {
    if (role === 'admin') {
      return [
        {
          path: '/admin',
          name: 'Dashboard',
          icon: FaUserShield,
          end: true
        },
        {
          path: '/admin/counselors',
          name: 'Counselor Queue',
          icon: FaUserMd
        },
        {
          path: '/admin/resources',
          name: 'Wellness Library',
          icon: FaBookOpen
        },
        {
          path: '/admin/profile',
          name: 'Profile Settings',
          icon: FaUser
        }
      ]
    }

    if (role === 'counselor') {
      return [
        {
          path: '/counselor',
          name: 'Counselor Queue',
          icon: FaUserMd,
          end: true
        },
        {
          path: '/resources',
          name: 'Wellness Library',
          icon: FaBookOpen
        },
        {
          path: '/profile',
          name: 'Profile Settings',
          icon: FaUser
        }
      ]
    }

    return [
      {
        path: '/dashboard',
        name: 'Dashboard',
        icon: FaThLarge,
        end: true
      },
      {
        path: '/mood',
        name: 'Mood Tracker',
        icon: FaSmile
      },
      {
        path: '/appointments',
        name: 'Appointments',
        icon: FaCalendarAlt
      },
      {
        path: '/resources',
        name: 'Resources',
        icon: FaBookOpen
      },
      {
        path: '/profile',
        name: 'Profile Settings',
        icon: FaUser
      }
    ]
  }

  const menuItems = getMenuItems()

  const isPublicPage = [
    '/',
    '/login',
    '/register'
  ].includes(location.pathname)

  if (isPublicPage) {
    return null
  }

  const getAvatarSource = () => {
    if (role === 'counselor') {
      return '/images/student_portrait_2.jpg'
    }

    return '/images/student_portrait_1.jpg'
  }

  const getDisplayName = () => {
    if (user?.name) {
      return user.name
    }

    if (role === 'admin') {
      return 'Administrator'
    }

    if (role === 'counselor') {
      return 'Counselor'
    }

    return 'Student'
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col justify-between border-r border-slate-200 bg-white shadow-md transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <NavLink
            to={getHomePath()}
            className="flex items-center space-x-2.5 overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
              <FaBrain className="text-lg" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-poppins text-lg font-extrabold leading-tight tracking-tight text-slate-900">
                  Mind
                  <span className="text-primary">
                    Connect
                  </span>
                </span>

                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">
                  {role} Portal
                </span>
              </div>
            )}
          </NavLink>

          <button
            type="button"
            onClick={() =>
              setIsCollapsed(
                (previousValue) => !previousValue
              )
            }
            className="hidden h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:border-primary hover:text-primary md:flex"
            aria-label={
              isCollapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
          >
            {isCollapsed ? (
              <FaChevronRight size={10} />
            ) : (
              <FaChevronLeft size={10} />
            )}
          </button>
        </div>

        {/* User information */}
        {!isCollapsed && user && (
          <div className="m-4 flex items-center space-x-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="relative shrink-0">
              <img
                src={getAvatarSource()}
                alt={`${getDisplayName()} profile`}
                className="h-10 w-10 rounded-full border-2 border-primary object-cover shadow-sm"
              />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="min-w-0 overflow-hidden">
              <h4 className="truncate text-sm font-extrabold leading-snug text-slate-900">
                {getDisplayName()}
              </h4>

              <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary">
                {role}
              </span>
            </div>
          </div>
        )}

        {isCollapsed && user && (
          <div className="my-4 flex justify-center">
            <div className="relative">
              <img
                src={getAvatarSource()}
                alt={`${getDisplayName()} profile`}
                className="h-10 w-10 rounded-full border-2 border-primary object-cover shadow-sm"
              />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end || false}
                title={
                  isCollapsed
                    ? item.name
                    : undefined
                }
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
                  }`
                }
              >
                <Icon className="shrink-0 text-lg" />

                {!isCollapsed && (
                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer actions */}
      <div className="space-y-1 p-3">
        <NavLink
          to="/emergency"
          title={
            isCollapsed
              ? 'Emergency Help'
              : undefined
          }
          className={({ isActive }) =>
            `flex items-center space-x-3 rounded-xl border px-3.5 py-3 text-sm font-extrabold transition-all duration-200 ${
              isActive
                ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
            }`
          }
        >
          <FaExclamationTriangle className="shrink-0 animate-pulse text-lg" />

          {!isCollapsed && (
            <span className="whitespace-nowrap">
              EMERGENCY HELP
            </span>
          )}
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          title={
            isCollapsed
              ? 'Logout'
              : undefined
          }
          className="flex w-full items-center space-x-3 rounded-xl px-3.5 py-3 text-sm font-bold text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-red-600"
          aria-label="Logout"
        >
          <FaSignOutAlt className="shrink-0 text-lg text-slate-500" />

          {!isCollapsed && (
            <span className="whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}