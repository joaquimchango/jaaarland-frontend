'use client'

import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ProductOverview1ReactionToggle } from './product-overview-1-reaction-toggle'
import { cn } from '@/lib/utils'
import { Heart, Star } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { productDetails } from '@/components/data/product-overview-1-data'
import { getProduct } from '@/services/productsServices'
import { addToCart } from '@/services/cartService'
import { AuthContext } from '@/context/auth.context'

export function ProductOverview1() {
  const { id } = useParams()
  const { isLoggedIn } = useContext(AuthContext)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [carouselApi, setCarouselApi] = useState()

  const currentProduct = product || productDetails
  const currentProductId = product?._id || product?.id
  const images =
    currentProduct?.image || currentProduct?.images?.length
      ? [{ id: 'main', src: currentProduct.image || currentProduct.images[0].src, alt: currentProduct.name || 'Product image' }]
      : productDetails.images

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setProduct(productDetails)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await getProduct(id)
        setProduct(response || productDetails)
      } catch (error) {
        console.error('Error fetching product details:', error)
        setProduct(productDetails)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    if (!carouselApi) return

    carouselApi.scrollTo(selectedImage)

    const handleSelect = () => {
      const currentIndex = carouselApi.selectedScrollSnap()
      setSelectedImage(currentIndex)
    }

    carouselApi.on('select', handleSelect)
    return () => {
      carouselApi.off('select', handleSelect)
    }
  }, [carouselApi, selectedImage])

  useEffect(() => {
    setQuantity(1)
    setSelectedImage(0)
  }, [id])

  if (loading) {
    return <div className='mx-auto max-w-7xl px-4 py-12 text-muted-foreground'>Loading product...</div>
  }

  return (
    <div>
      <section className='@container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 py-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12 lg:py-12'>
          <div className='flex flex-col gap-5'>
            <div className='overflow-hidden rounded-2xl border bg-muted/40'>
              <Carousel setApi={setCarouselApi} className='w-full'>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={image.id || `${image.src}-${index}`}>
                      <img src={image.src} alt={image.alt} className='h-[520px] w-full object-cover' />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            <div className='flex flex-wrap gap-4'>
              {images.map((image, index) => (
                <div
                  key={image.id || `${image.src}-${index}`}
                  onMouseEnter={() => setSelectedImage(index)}
                  className={cn(
                    'ring-offset-background size-20 cursor-pointer overflow-hidden rounded-lg border ring-offset-2 transition-all',
                    selectedImage === index && 'ring-foreground ring-2'
                  )}
                >
                  <img src={image.src} alt={image.alt} className='size-full object-cover' />
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col justify-center gap-6'>
            <div className='flex flex-col gap-3'>
              <span className='text-sm font-semibold tracking-wide uppercase text-muted-foreground'>
                {currentProduct.category || 'Featured'}
              </span>
              <h2 className='text-3xl font-bold tracking-tight text-balance'>{currentProduct.name}</h2>
              <p className='text-2xl font-bold tracking-tight'>
                ${Number(currentProduct.price ?? 0).toFixed(2)}
              </p>
            </div>

            <p className='text-muted-foreground text-base leading-7'>{currentProduct.description}</p>

            <div className='flex flex-col gap-2'>
              <h3 className='font-bold'>Reviews</h3>
              <div className='flex items-center gap-2'>
                <div className='flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='text-foreground size-5'
                      fill={i < Number(currentProduct.rating ?? productDetails.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className='text-sm text-muted-foreground'>Rated {Number(currentProduct.rating ?? productDetails.rating).toFixed(1)} / 5</span>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='font-bold'>Quantity</h3>
              <div className='flex w-fit items-center rounded-full border'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-10 w-10 rounded-full cursor-pointer'
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label='Decrease quantity'
                >
                  -
                </Button>
                <span className='min-w-12 text-center text-lg font-semibold'>{quantity}</span>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-10 w-10 rounded-full cursor-pointer'
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label='Increase quantity'
                >
                  +
                </Button>
              </div>
            </div>

            <div className='flex gap-4 pt-2'>
              <Button
                className='h-11 flex-1 cursor-pointer rounded-full px-8'
                size='lg'
                onClick={async () => {
                  if (!isLoggedIn) {
                    return
                  }

                  try {
                    if (!currentProductId) {
                      throw new Error('This product does not have a valid id')
                    }

                    await addToCart(
                      {
                        ...currentProduct,
                        _id: currentProductId,
                        price: Number(currentProduct.price ?? 0),
                      },
                      quantity
                    )
                  } catch (error) {
                    console.error('Error adding product to cart:', error)
                  }
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='size-11 cursor-pointer rounded-full'
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <ProductOverview1ReactionToggle
                  active={isWishlisted}
                  icon={Heart}
                  iconClassName='size-5'
                  activeColorClassName='text-primary'
                />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductOverview1
