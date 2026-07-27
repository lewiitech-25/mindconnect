import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaBrain, FaSignOutAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa'
import { onAuthStateChanged, signOut } from 'firebase/auth'
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

      // Immediately show basic Firebase Auth information.
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        name:
          currentUser.displayName ||
          'Student'
      })

      try {
        const profile = await getUserProfile(
          currentUser.uid
        )

        if (profile) {
          setUser(profile)
        }
      } catch (error) {
        /*
         * During registration, Authentication is created
         * before the Firestore profile. The temporary
         * missing-profile condition is expected.
         */
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

  return () => unsubscribe()
}, [])

  const handleLogout = async () => {
  try {
    await signOut(auth)
    setUser(null)
    setIsOpen(false)
    navigate('/login')
  } catch (error) {
    console.error(
      'Failed to log out:',
      error
    )
  }
}

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname)

  // We only display the primary navbar on public pages
  // Private pages have a dedicated Sidebar layout.
  if (!isPublicPage) return null

  return (
    <nav className="sticky top-0 z-50 w-full glass shadow-sm transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <FaBrain className="text-xl" />
            </div>
            <span className="font-poppins text-xl font-bold tracking-tight text-text-custom">
              Mind<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors duration-200">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors duration-200">
              Testimonials
            </a>
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors duration-200">
              About
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-4.5 py-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-md shadow-primary/10 hover:bg-primary/95 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors duration-200"
                  aria-label="Logout"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4.5 py-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-md shadow-primary/10 hover:bg-primary/95 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-50 focus:outline-none transition-all duration-200"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-1 px-4 pt-2 pb-4">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              Features
            </a>
            <a
              href="#testimonials"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              Testimonials
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary"
            >
              About
            </a>

            <div className="border-t border-slate-100 pt-4 mt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2 text-slate-700">
                    <FaUserCircle className="text-xl mr-2 text-primary" />
                    <span className="font-semibold text-sm">{user.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary/95"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
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
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
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
