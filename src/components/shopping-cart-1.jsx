'use client'

import { useEffect, useState } from 'react'
import { Trash2, Minus, Plus, ShoppingBag, Package, Shield, CreditCard, Store, MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ShoppingCart1SpinningCounter } from './shopping-cart-1-spinning-counter'
import { cn } from '@/lib/utils'
import { removeFromCart, updateQuantity as updateCartQuantity } from '@/services/cartService'

export function ShoppingCart1({ cart }) {
  const [items, setItems] = useState([])
  const [isRemoving, setIsRemoving] = useState(null)

  useEffect(() => {
    const normalizedItems = Array.isArray(cart?.products)
      ? cart.products.map((item, index) => {
          const product = item?.product || {}
          const productId = product?._id || item?.product || `item-${index}`
          const image =
            product?.image ||
            product?.images?.[0] ||
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'

          return {
            id: productId,
            productId,
            name: product?.name || 'Product',
            image,
            quantity: Number(item?.quantity || 1),
            price: Number(item?.price ?? product?.price ?? 0),
            originalPrice: Number(product?.price ?? item?.price ?? 0),
            estimatedDelivery: '3-5 business days',
          }
        })
      : []

    setItems(normalizedItems)
  }, [cart])

  const updateQuantity = async (productId, increment) => {
    const currentItem = items.find((item) => item.productId === productId)
    if (!currentItem) return

    const nextQuantity = Math.max(1, currentItem.quantity + (increment ? 1 : -1))

    try {
      await updateCartQuantity(productId, nextQuantity)
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.productId === productId ? { ...item, quantity: nextQuantity } : item
        )
      )
    } catch (error) {
      console.error('Unable to update cart quantity:', error)
    }
  }

  const removeItem = async (productId) => {
    setIsRemoving(productId)

    try {
      await removeFromCart(productId)
      setItems((currentItems) => currentItems.filter((item) => item.productId !== productId))
    } catch (error) {
      console.error('Unable to remove item from cart:', error)
    } finally {
      setIsRemoving(null)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
  const shipping = subtotal > 0 ? 0 : 0
  const total = subtotal + shipping

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-8 flex flex-col gap-2 text-center'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Your Shopping Cart</h1>
        <p className='text-muted-foreground'>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart •{' '}
          <span className='text-foreground font-semibold'>${subtotal.toFixed(2)}</span>
        </p>
      </div>

      <div className='flex flex-col gap-8 lg:flex-row'>
        <div className='flex flex-1 flex-col gap-6'>
          {items.length === 0 ? (
            <Card className='border-dashed'>
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <ShoppingBag className='text-muted-foreground/50 mb-4 size-12' />
                <h3 className='text-lg font-medium'>Your cart is empty</h3>
                <p className='text-muted-foreground mt-1 text-sm'>Add some items to get started</p>
                <Button className='mt-4 h-9 cursor-pointer px-4 py-2' variant='outline'>
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card
                key={item.id}
                className={cn('gap-0 overflow-hidden py-0', {
                  'opacity-50': isRemoving === item.productId,
                })}
              >
                <div className='flex flex-col sm:flex-row'>
                  <div className='relative h-auto w-full sm:w-40'>
                    <img src={item.image} alt={item.name} className='h-36 w-full object-cover object-center' />
                  </div>

                  <div className='flex-1 p-4'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='text-foreground text-lg font-medium'>{item.name}</h3>
                        <p className='text-muted-foreground mt-1 text-sm'>Quantity: {item.quantity}</p>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-8 cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>

                    <div className='mt-4 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='size-8 cursor-pointer'
                          onClick={() => updateQuantity(item.productId, false)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus />
                        </Button>
                        <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                        <Button
                          variant='outline'
                          size='icon'
                          className='size-8 cursor-pointer'
                          onClick={() => updateQuantity(item.productId, true)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus />
                        </Button>
                      </div>

                      <div className='text-end'>
                        <p className='text-lg font-semibold'>${(item.price * item.quantity).toFixed(2)}</p>
                        {item.originalPrice > item.price && (
                          <p className='text-muted-foreground text-xs line-through'>${item.originalPrice.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <CardFooter className='border-t bg-muted/20 px-4 !py-2'>
                  <div className='text-muted-foreground flex items-center text-sm'>
                    <Package className='me-2 size-4' />
                    <span>Estimated delivery: {item.estimatedDelivery}</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        <div className='flex w-full flex-col gap-4 lg:w-96'>
          <Card className='sticky top-4 gap-0'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl'>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex flex-col gap-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span className={shipping === 0 ? 'text-success' : ''}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {savings > 0 && (
                  <div className='flex justify-between text-sm font-medium'>
                    <span>You Save</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator className='my-2' />

              <div className='flex items-center justify-between text-base font-medium'>
                <span>Total</span>
                <div className='text-end'>
                  <p className='text-xl font-bold'>
                    <ShoppingCart1SpinningCounter value={total} decimals={2} prefix='$' />
                  </p>
                  <p className='text-muted-foreground text-xs'>including VAT, if applicable</p>
                </div>
              </div>

              <Button
                size='lg'
                className='mt-4 h-10 w-full cursor-pointer px-8 text-base font-medium'
                disabled={items.length === 0}
              >
                <ShoppingBag data-icon='inline-start' />
                Proceed to Checkout
              </Button>

              <div className='text-muted-foreground flex items-center justify-center gap-2 text-xs'>
                <CreditCard className='size-3.5' />
                <span>Secure payment with SSL encryption</span>
              </div>
            </CardContent>
          </Card>

          <Card className='border-dashed py-4'>
            <CardContent className='px-4'>
              <div className='flex items-start gap-3'>
                <div className='flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
                  <Shield className='size-5' />
                </div>
                <div>
                  <h4 className='font-medium'>Secure Checkout</h4>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant='outline' className='h-9 w-full cursor-pointer px-4 py-2'>
            <Store data-icon='inline-start' />
            Continue Shopping
            <MoveRight data-icon='inline-end' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart1
