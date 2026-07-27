import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import './App.css'

const PrivateRoute = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setCurrentUser(firebaseUser)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  if (loading) {
    return null
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicRoute = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
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

      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
  {/* Public Routes */}
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

  {/* Private App Routes */}
  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <PrivateLayout>
          <Dashboard />
        </PrivateLayout>
      </PrivateRoute>
    }
  />

  <Route
    path="/mood"
    element={
      <PrivateRoute>
        <PrivateLayout>
          <MoodTracker />
        </PrivateLayout>
      </PrivateRoute>
    }
  />

  <Route
    path="/resources"
    element={
      <PrivateRoute>
        <PrivateLayout>
          <Resources />
        </PrivateLayout>
      </PrivateRoute>
    }
  />

  <Route
    path="/counseling"
    element={
      <PrivateRoute>
        <PrivateLayout>
          <Counseling />
        </PrivateLayout>
      </PrivateRoute>
    }
  />

  <Route
    path="/appointments"
    element={
      <PrivateRoute>
        <PrivateLayout>
          <Appointments />
        </PrivateLayout>
      </PrivateRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <PrivateRoute>
        <PrivateLayout>
          <Profile />
        </PrivateLayout>
      </PrivateRoute>
    }
  />

  <Route
    path="/emergency"
    element={
      <PrivateRoute>
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
