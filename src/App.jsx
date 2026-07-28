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
import CounselorDashboard from './pages/CounselorDashboard'
import AdminDashboard from './pages/AdminDashboard'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import './App.css'

const PrivateRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('studentUser')
  if (!userStr) {
    return <Navigate to="/login" replace />
  }
  const user = JSON.parse(userStr)
  const role = user.role || 'student'

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'counselor') return <Navigate to="/counselor" replace />
    if (role === 'admin') return <Navigate to="/admin" replace />
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  )
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

        {/* Private Student Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mood"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <MoodTracker />
            </PrivateRoute>
          }
        />
        <Route
          path="/counseling"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Counseling />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <PrivateRoute allowedRoles={['student']}>
              <Appointments />
            </PrivateRoute>
          }
        />

        {/* Counselor UI */}
        <Route
          path="/counselor"
          element={
            <PrivateRoute allowedRoles={['counselor', 'admin']}>
              <CounselorDashboard />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Shared Private Routes */}
        <Route
          path="/resources"
          element={
            <PrivateRoute allowedRoles={['student', 'counselor', 'admin']}>
              <Resources />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['student', 'counselor', 'admin']}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/emergency"
          element={
            <PrivateRoute allowedRoles={['student', 'counselor', 'admin']}>
              <Emergency />
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
