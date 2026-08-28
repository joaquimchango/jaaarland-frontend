import React, {useState, useEffect} from 'react'
import axios from 'axios'
import api from '../services/api'

const API_URL = process.env.REACT_APP_API_URL
const AuthContext = React.createContext()



export default function AuthProvider ({children}) {
// define states 
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)
const [isLoggedIn, setIsLoggedIn] = useState(false)




const storeToken = (token) => { 
localStorage.setItem('authToken', token)

}


const removeToken = () => {
  localStorage.removeItem('authToken')
}


const authenticateUser = () =>{

  const storedToken = localStorage.getItem('authToken')
  if (storedToken){
     
      api.get('/auth/verify', {headers: {Authorization: `Bearer ${storedToken}`}}).then(response => {
        const user = response.data
        setUser(user)
        setIsLoggedIn(true)
        setLoading(false)
      }).catch(err => {
        removeToken()
        setUser(null)
        setIsLoggedIn(false)
        setLoading(false)
      })  
   
  }else {
    setUser(null)
    setIsLoggedIn(false)
    setLoading(false)
  }
}

useEffect(() => {
  authenticateUser()
}, [])


return (
  <AuthContext.Provider value={{user, loading, isLoggedIn, authenticateUser, removeToken,storeToken, setUser, setIsLoggedIn }}>
    {children}
  </AuthContext.Provider>
)


}

export {AuthContext}