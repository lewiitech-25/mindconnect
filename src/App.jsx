import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { useAuth } from './context/AuthContext'

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

import Counselors from './pages/admin/Counselors'
import AdminResources from './pages/admin/Resources'
import AdminProfile from './pages/admin/Profile'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import './App.css'

const PrivateRoute = ({
  children,
  allowedRoles
}) => {
  const {
    loading,
    isAuthenticated,
    role
  } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">
          Loading...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    if (role === 'admin') {
      return (
        <Navigate
          to="/admin"
          replace
        />
      )
    }

    if (role === 'counselor') {
      return (
        <Navigate
          to="/counselor"
          replace
        />
      )
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="w-full flex-1 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}

const PublicRoute = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50">
      <Navbar />

      <div className="w-full flex-1">
        {children}
      </div>
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
            <PrivateRoute
              allowedRoles={['student']}
            >
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/mood"
          element={
            <PrivateRoute
              allowedRoles={['student']}
            >
              <MoodTracker />
            </PrivateRoute>
          }
        />

        <Route
          path="/counseling"
          element={
            <PrivateRoute
              allowedRoles={['student']}
            >
              <Counseling />
            </PrivateRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <PrivateRoute
              allowedRoles={['student']}
            >
              <Appointments />
            </PrivateRoute>
          }
        />

        {/* Counselor routes */}
        <Route
          path="/counselor"
          element={
            <PrivateRoute
              allowedRoles={[
                'counselor',
                'admin'
              ]}
            >
              <CounselorDashboard />
            </PrivateRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute
              allowedRoles={['admin']}
            >
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/counselors"
          element={
            <PrivateRoute
              allowedRoles={['admin']}
            >
              <Counselors />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/resources"
          element={
            <PrivateRoute
              allowedRoles={['admin']}
            >
              <AdminResources />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <PrivateRoute
              allowedRoles={['admin']}
            >
              <AdminProfile />
            </PrivateRoute>
          }
        />

        {/* Shared private routes */}
        <Route
          path="/resources"
          element={
            <PrivateRoute
              allowedRoles={[
                'student',
                'counselor',
                'admin'
              ]}
            >
              <Resources />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute
              allowedRoles={[
                'student',
                'counselor',
                'admin'
              ]}
            >
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/emergency"
          element={
            <PrivateRoute
              allowedRoles={[
                'student',
                'counselor',
                'admin'
              ]}
            >
              <Emergency />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </Router>
  )
}

export default App