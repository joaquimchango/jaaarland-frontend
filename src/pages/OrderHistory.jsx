import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrderHistory1 } from '../components/order-history-1'
import { AuthContext } from '../context/auth.context'
import { getOrders } from '../services/ordersService'

export default function OrderHistory() {
  const navigate = useNavigate()
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true })
    }
  }, [isLoggedIn, navigate])

  if (!isLoggedIn) {
    return null
  }

  return <OrderHistory1 fetchOrders={getOrders} />
}