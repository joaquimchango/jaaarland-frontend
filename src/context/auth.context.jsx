import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { getProducts } from '../services/productsServices'

const AuthContext = React.createContext()

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)

  const storeToken = (token) => {
    localStorage.setItem('authToken', token)
  }

  const removeToken = () => {
    localStorage.removeItem('authToken')
  }

  const getAllProducts = async () => {
    setProductsLoading(true)

    try {
      const allProducts = await getProducts()
      setProducts(allProducts)
      return allProducts
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      return []
    } finally {
      setProductsLoading(false)
    }
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
    getAllProducts()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn,
        products,
        productsLoading,
        authenticateUser,
        removeToken,
        storeToken,
        setUser,
        setIsLoggedIn,
        getAllProducts,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }