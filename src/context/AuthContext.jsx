import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

function loadUser() {
  try {
    const raw = localStorage.getItem('zazawi.user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  useEffect(() => {
    if (user) localStorage.setItem('zazawi.user', JSON.stringify(user))
    else localStorage.removeItem('zazawi.user')
  }, [user])

  function login(profile) {
    setUser({
      name: profile.name || 'Zazawi User',
      phone: profile.phone || '',
      email: profile.email || '',
      role: profile.role || 'patient',
    })
  }

  function logout() {
    setUser(null)
  }

  function updateProfile(patch) {
    setUser((u) => ({
      name: 'Guest',
      phone: '',
      email: '',
      role: 'patient',
      ...(u || {}),
      ...patch,
    }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
