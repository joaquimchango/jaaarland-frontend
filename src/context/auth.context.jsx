import React, { useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = React.createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const storeToken = (token) => {
    localStorage.setItem('authToken', token)
  }

  const removeToken = () => {
    localStorage.removeItem('authToken')
  }

  const authenticateUser = () => {
    const storedToken = localStorage.getItem('authToken')

    if (storedToken) {
      api
        .get('/auth/verify', {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          const user = response.data
          setUser(user)
          setIsLoggedIn(true)
          setLoading(false)
        })
        .catch(() => {
          removeToken()
          setUser(null)
          setIsLoggedIn(false)
          setLoading(false)
        })
    } else {
      setUser(null)
      setIsLoggedIn(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    authenticateUser()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        authenticateUser,
        removeToken,
        storeToken,
        setUser,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }