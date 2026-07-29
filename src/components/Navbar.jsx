import { useEffect, useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import {
  FaBars,
  FaBrain,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa'
import {
  onAuthStateChanged,
  signOut
} from 'firebase/auth'

import { auth } from '../firebase/config'
import { getUserProfile } from '../firebase/userService'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          setUser(null)
          return
        }

        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          name:
            currentUser.displayName ||
            'Student',
          role: 'student'
        })

        try {
          const profile = await getUserProfile(
            currentUser.uid
          )

          if (profile) {
            setUser({
              uid: currentUser.uid,
              email:
                profile.email ||
                currentUser.email,
              name:
                profile.name ||
                currentUser.displayName ||
                'Student',
              role:
                profile.role ||
                'student',
              ...profile
            })
          }
        } catch (error) {
          if (
            error.message !==
            'User profile was not found.'
          ) {
            console.error(
              'Failed to load navbar user:',
              error
            )
          }
        }
      }
    )

    return unsubscribe
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (
      location.pathname !== '/' ||
      !location.hash
    ) {
      return
    }

    const sectionId =
      location.hash.replace('#', '')

    const timeoutId = window.setTimeout(() => {
      const section =
        document.getElementById(sectionId)

      section?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [location.pathname, location.hash])

  const handleSectionNavigation = (
    sectionId
  ) => {
    setIsOpen(false)

    if (location.pathname === '/') {
      const section =
        document.getElementById(sectionId)

      section?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      window.history.replaceState(
        null,
        '',
        `/#${sectionId}`
      )

      return
    }

    navigate(`/#${sectionId}`)
  }

  const handleHomeNavigation = () => {
  setIsOpen(false)

  if (location.pathname === '/') {
    window.history.replaceState(
      null,
      '',
      '/'
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    return
  }

  navigate('/')
}

  const getDashboardPath = () => {
    if (user?.role === 'admin') {
      return '/admin'
    }

    if (user?.role === 'counselor') {
      return '/counselor'
    }

    return '/dashboard'
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)

      setUser(null)
      setIsOpen(false)

      navigate('/login', {
        replace: true
      })
    } catch (error) {
      console.error(
        'Failed to log out:',
        error
      )
    }
  }

  const isPublicPage = [
    '/',
    '/login',
    '/register'
  ].includes(location.pathname)

  if (!isPublicPage) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 w-full glass-saas-header transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={handleHomeNavigation}
            className="flex cursor-pointer items-center space-x-2 group"
            aria-label="Go to MindConnect home page"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
              <FaBrain className="text-xl" />
            </div>

            <span className="font-poppins text-xl font-bold tracking-tight text-text-custom">
              Mind
              <span className="text-primary">
                Connect
              </span>
            </span>
          </button>

          <div className="hidden items-center space-x-8 md:flex">
            <button
              type="button"
              onClick={() =>
                handleSectionNavigation(
                  'features'
                )
              }
              className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-primary"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() =>
                handleSectionNavigation(
                  'testimonials'
                )
              }
              className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-primary"
            >
              Testimonials
            </button>

            <button
              type="button"
              onClick={() =>
                handleSectionNavigation(
                  'about'
                )
              }
              className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-primary"
            >
              About
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-primary/20"
                >
                  Go to Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-red-500"
                  aria-label="Log out"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-primary"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-primary/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() =>
                setIsOpen((current) => !current)
              }
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-primary focus:outline-none"
              aria-label={
                isOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="glass border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300 md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <button
              type="button"
              onClick={() =>
                handleSectionNavigation(
                  'features'
                )
              }
              className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() =>
                handleSectionNavigation(
                  'testimonials'
                )
              }
              className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              Testimonials
            </button>

            <button
              type="button"
              onClick={() =>
                handleSectionNavigation(
                  'about'
                )
              }
              className="block w-full rounded-lg px-3 py-2 text-left text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              About
            </button>

            <div className="mt-2 border-t border-slate-100 pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2 text-slate-700">
                    <FaUserCircle className="mr-2 text-xl text-primary" />

                    <span className="text-sm font-semibold">
                      {user.name || 'Student'}
                    </span>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="block w-full rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-primary/95"
                  >
                    Go to Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-red-500"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/10 hover:bg-primary/95"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}