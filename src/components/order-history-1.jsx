import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function OrderHistory1({ fetchOrders }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!fetchOrders) {
        setLoading(false)
        return
      }

      try {
        const response = await fetchOrders()
        const allOrders = Array.isArray(response) ? response : []
        setOrders(allOrders.filter((order) => String(order?.status || '').toLowerCase() === 'confirmed'))
      } catch (error) {
        console.error('Unable to fetch orders:', error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserOrders()
  }, [fetchOrders])

  const totalOrders = orders.length
  const totalAmount = orders.reduce((sum, order) => {
    const orderProducts = Array.isArray(order?.products) ? order.products : []
    const orderTotal = orderProducts.reduce((productSum, product) => {
      const productPrice = Number(product?.price ?? 0)
      const productQuantity = Number(product?.quantity ?? 1)
      return productSum + productPrice * productQuantity
    }, 0)
    return sum + orderTotal + Number(order?.total ?? 0)
  }, 0)

  const lastOrder = orders.length
    ? orders.reduce((latest, order) => {
        const currentDate = new Date(order?.date || order?.createdAt || 0)
        const latestDate = new Date(latest)
        return currentDate > latestDate ? order?.date || order?.createdAt : latest
      }, orders[0]?.date || orders[0]?.createdAt || new Date(0).toISOString())
    : 'No confirmed orders'

  if (loading) {
    return (
      <div className='mx-auto w-full max-w-7xl px-4 py-8 text-center text-muted-foreground'>
        Loading your confirmed orders...
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <Card>
        <CardHeader className='flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-x-6'>
          <div>
            <CardTitle className='text-2xl'>Order History</CardTitle>
            <CardDescription className='text-balance'>View your confirmed orders and their status</CardDescription>
          </div>
          <div className='text-muted-foreground text-end text-sm max-sm:text-start'>
            <p>Total Orders: {totalOrders}</p>
            <p>Last Order: {lastOrder}</p>
          </div>
        </CardHeader>

        <CardContent className='space-y-6'>
          {orders.length === 0 ? (
            <div className='rounded-lg border border-dashed p-10 text-center text-muted-foreground'>
              No confirmed orders yet.
            </div>
          ) : (
            orders.map((order) => {
              const orderProducts = Array.isArray(order?.products) ? order.products : []
              const orderTotal = orderProducts.reduce((sum, product) => {
                const productPrice = Number(product?.price ?? 0)
                const productQuantity = Number(product?.quantity ?? 1)
                return sum + productPrice * productQuantity
              }, 0)

              return (
                <div key={order?._id || order?.id} className='rounded-lg border border-border bg-muted/20 p-4'>
                  <div className='mb-4 flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
                        {order?._id || order?.id}
                      </p>
                      <p className='mt-1 text-sm text-muted-foreground'>
                        {new Date(order?.date || order?.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant='secondary' className='w-fit rounded-full'>
                      {order?.status || 'Confirmed'}
                    </Badge>
                  </div>

                  <div className='space-y-3'>
                    {orderProducts.length === 0 ? (
                      <p className='text-sm text-muted-foreground'>No items in this order.</p>
                    ) : (
                      orderProducts.map((product, index) => {
                        const productInfo = product?.product || product
                        const productName = productInfo?.name || 'Product'
                        const productImage = productInfo?.image || productInfo?.images?.[0]
                        const productPrice = Number(product?.price ?? productInfo?.price ?? 0)
                        const productQuantity = Number(product?.quantity ?? 1)

                        return (
                          <div key={`${order?._id || order?.id}-${productName}-${index}`} className='flex items-center gap-3 rounded-md border border-border bg-background p-3'>
                            <img
                              src={productImage || 'https://images.unsplash.com/photo-1528740561666-dc2479dc08a9?auto=format&fit=crop&w=900&q=80'}
                              alt={productName}
                              className='h-16 w-16 rounded-md object-cover shrink-0'
                            />

                            <div className='min-w-0 flex-1'>
                              <p className='font-medium'>{productName}</p>
                              <p className='text-sm text-muted-foreground'>
                                Qty: {productQuantity}
                              </p>
                            </div>

                            <div className='text-end'>
                              <p className='font-medium'>${(productPrice * productQuantity).toFixed(2)}</p>
                              <p className='text-xs text-muted-foreground'>${productPrice.toFixed(2)} each</p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <div className='mt-4 flex items-center justify-between border-t border-border pt-3 text-sm font-medium'>
                    <span>Order Total</span>
                    <span>${(Number(order?.total ?? 0) || orderTotal).toFixed(2)}</span>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>

        <CardFooter className='flex flex-wrap gap-4 border-t-0 bg-transparent pt-0'>
          <Button variant='default' className='h-9 cursor-pointer px-4 py-2'>
            View Order Details
          </Button>
          <Button variant='secondary' className='h-9 cursor-pointer px-4 py-2'>
            Download Invoice
          </Button>
          <div className='ml-auto text-sm font-semibold text-muted-foreground'>
            Total Spent: ${totalAmount.toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OrderHistory1
