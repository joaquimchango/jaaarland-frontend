'use client'

import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ArrowRight, TrendingUp, ShoppingBag } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { getProducts } from '@/services/productsServices'

export function StorefrontHero2() {
  const [searchQuery, setSearchQuery] = useState('')
  const [api, setApi] = useState()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [storeData, setStoreData] = useState([])

  useEffect(() => {
    let isActive = true

    const loadProducts = async () => {
      try {
        const response = await getProducts()
        const products = Array.isArray(response) ? response : Array.isArray(response?.products) ? response.products : []

        if (!isActive) return

        setStoreData(products.slice(0, 4))
      } catch (error) {
        console.error('Error loading products for storefront hero:', error)

        if (isActive) {
          setStoreData([])
        }
      }
    }

    loadProducts()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!api || !storeData.length) return

    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % storeData.length
      api.scrollTo(nextSlide)
      setCurrentSlide(nextSlide)
    }, 5000)

    return () => clearInterval(interval)
  }, [api, currentSlide, storeData.length])

  return (
    <section className='from-background to-accent/20 relative bg-linear-to-b'>
      <div className='relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
          <header className='flex flex-col gap-8'>
            <Badge
              variant='outline'
              className='h-auto w-fit rounded-full px-4 py-2 font-semibold flex items-center gap-2'
            >
              <TrendingUp className='size-4' />
              New Collection 2025
            </Badge>

            <h1 className='text-5xl leading-tight font-bold text-balance md:text-6xl lg:text-7xl'>
              Discover Your Perfect Style
            </h1>

            <p className='text-muted-foreground max-w-lg text-xl text-balance'>
              Explore our curated collection of premium products. Each piece is handpicked for those who appreciate quality and style.
            </p>

            <div className='relative max-w-md'>
              <Input
                type='search'
                placeholder='Search products...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-14 rounded-full pe-4 pl-12 text-lg'
                aria-label='Search products'
              />
              <Search className='text-muted-foreground absolute start-4 top-1/2 size-5 -translate-y-1/2' />
              <Button size='lg' className='absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full px-6 h-10'>
                Search
              </Button>
            </div>

            <div className='flex items-center gap-4'>
              <Link to="/products">
                <Button  size='lg' className='h-10 cursor-pointer rounded-full px-4'>
                  Shop Now
                  <ArrowRight />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                   onClick={() => {useNavigate('/products')}}
                  size='lg'
                  variant='outline'
                  className='h-10 cursor-pointer rounded-full px-4 justify-center'
                >
                  <ShoppingBag />
                  View Catalog
                </Button>
              </Link>
            </div>
          </header>

          <div className='flex flex-col gap-4'>
            <div className='relative h-[500px] w-full border-0'>
              <Carousel
                className='group size-full'
                setApi={setApi}
                opts={{
                  align: 'start',
                  loop: true,
                  duration: 20,
                  skipSnaps: true,
                }}
                onSelect={() => {
                  if (api) {
                    setCurrentSlide(api.selectedScrollSnap())
                  }
                }}
              >
                <CarouselContent className='h-full'>
                  {storeData.map((product, index) => (
                    <CarouselItem key={product._id || product.id || index} className='h-full'>
                      <Card className='relative size-full border-1 overflow-hidden py-4'>
                        <CardContent className='px-4'>
                          <div className='relative size-full overflow-hidden rounded-md'>
                            <img
                              src={product.image || 'https://images.unsplash.com/photo-1528740561666-dc2479dc08a9?auto=format&fit=crop&w=900&q=80'}
                              alt={product.name}
                              className='h-[500px] w-full object-cover'
                              loading='lazy'
                            />
                          </div>

                          <div className='from-background/90 via-background/30 absolute inset-0 bg-linear-to-t to-transparent' />

                          <div className='text-background-foreground absolute inset-0 flex flex-col justify-end p-8'>
                            <div className='relative z-10 max-w-md flex flex-col gap-4'>
                              <Badge className='w-fit rounded-full px-2.5 py-0.5 font-semibold'>
                                {product.category || 'Featured'}
                              </Badge>
                              <h2 className='text-4xl font-bold'>{product.name}</h2>
                              <p className='text-background-foreground/80 text-lg'>
                                {product.description || 'Premium handmade quality for everyday rituals and elevated living.'}
                              </p>
                              <div className='flex items-center gap-4 pt-2'>
                                <Button size='lg' className='h-10 px-8 cursor-pointer rounded-full'>
                                  Shop Now
                                </Button>
                                <div className='text-foreground flex items-center gap-2'>
                                  <span className='text-lg font-semibold'>${Number(product.price || 0).toFixed(2)}</span>
                                  <span className='text-foreground/80'>• {product.stock ?? 0} in stock</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            <div className='relative mt-8 flex justify-center gap-3'>
              {storeData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    api?.scrollTo(index)
                    setCurrentSlide(index)
                  }}
                  className={`relative size-3 rounded-full transition-all ${currentSlide === index ? 'bg-primary' : 'bg-foreground/20 hover:bg-foreground/40'}`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentSlide === index ? 'step' : undefined}
                >
                  {currentSlide === index && <span className='absolute inset-0 m-auto rounded-full' />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StorefrontHero2
