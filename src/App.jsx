import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, db } from './firebase/config'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MoodTracker from './pages/MoodTracker'
import Resources from './pages/Resources'
import Counseling from './pages/Counseling'
import Appointments from './pages/Appointments'
import Profile from './pages/Profile'
import Emergency from './pages/Emergency'
import CounselorDashboard from './pages/CounselorDashboard'
import AdminDashboard from './pages/AdminDashboard'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import './App.css'

const PrivateRoute = ({ children, allowedRoles }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null)
        setUserRole(null)
        setLoading(false)
        return
      }

      try {
        setCurrentUser(firebaseUser)

        const userDocument = await getDoc(
          doc(db, 'users', firebaseUser.uid)
        )

        if (userDocument.exists()) {
          setUserRole(userDocument.data().role || 'student')
        } else {
          setUserRole('student')
        }
      } catch (error) {
        console.error('Unable to load user role:', error)
        setUserRole('student')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'counselor') {
      return <Navigate to="/counselor" replace />
    }

    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />
    }

    return <Navigate to="/dashboard" replace />
  }

  return children
}

const PublicRoute = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  )
}

const PrivateLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-h-screen md:ml-64">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/mood"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <PrivateLayout>
                <MoodTracker />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/counseling"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <PrivateLayout>
                <Counseling />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <PrivateLayout>
                <Appointments />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        {/* Counsellor route */}
        <Route
          path="/counselor"
          element={
            <PrivateRoute allowedRoles={['counselor', 'admin']}>
              <PrivateLayout>
                <CounselorDashboard />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <PrivateLayout>
                <AdminDashboard />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        {/* Shared private routes */}
        <Route
          path="/resources"
          element={
            <PrivateRoute
              allowedRoles={['student', 'counselor', 'admin']}
            >
              <PrivateLayout>
                <Resources />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute
              allowedRoles={['student', 'counselor', 'admin']}
            >
              <PrivateLayout>
                <Profile />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/emergency"
          element={
            <PrivateRoute
              allowedRoles={['student', 'counselor', 'admin']}
            >
              <PrivateLayout>
                <Emergency />
              </PrivateLayout>
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App