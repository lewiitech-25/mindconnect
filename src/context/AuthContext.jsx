import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { onAuthStateChanged, signOut } from 'firebase/auth'

import { auth } from '../firebase/config'
import { getUserProfile } from '../firebase/userService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)

      if (!currentUser) {
        setFirebaseUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const userProfile = await getUserProfile(currentUser.uid)

        setFirebaseUser(currentUser)
        setProfile(
          userProfile
            ? {
                uid: currentUser.uid,
                email: currentUser.email,
                ...userProfile
              }
            : null
        )
      } catch (error) {
        console.error('Failed to load authenticated user:', error)
        setFirebaseUser(currentUser)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      role: profile?.role || null,
      loading,
      logout,
      isAuthenticated: Boolean(firebaseUser && profile)
    }),
    [firebaseUser, profile, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}