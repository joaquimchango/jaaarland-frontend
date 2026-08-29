import { useEffect, useState } from 'react'
import { ShoppingCart1 } from '../components/shopping-cart-1'
import { getCart } from '../services/cartService'

export default function Cartpage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const currentCart = await getCart()
        setCart(currentCart)
      } catch (error) {
        console.error('Unable to fetch cart:', error)
        setCart(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  if (loading) {
    return (
      <div className='mx-auto w-full max-w-7xl px-4 py-12 text-center text-muted-foreground'>
        Loading your cart...
      </div>
    )
  }

  return <ShoppingCart1 cart={cart} />
}