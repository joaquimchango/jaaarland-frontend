import { Star } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { products as fallbackProducts } from '@/components/data/product-card-2-data'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/auth.context'

export function ProductCard2({
  products,
  title = 'Popular Products',
  subtitle = 'This beloved product has become a favorite among our customers for its exceptional features and unparalleled performance',
}) {
  const { products: authProducts } = useContext(AuthContext)
  const sourceProducts = Array.isArray(products) ? products : Array.isArray(authProducts) ? authProducts : fallbackProducts
  const productList = sourceProducts.filter((product) => product?.trending === true)

  return (
    <section className='py-12'>
      <div className='mx-auto w-full max-w-7xl flex flex-col gap-8 px-4 sm:px-6 lg:px-8'>
        <header className='flex flex-col gap-2'>
          <h2 className='text-3xl font-bold text-balance sm:text-4xl'>{title}</h2>
          <p className='text-muted-foreground max-w-[60ch] text-balance'>{subtitle}</p>
        </header>

        {productList.length === 0 ? (
          <div className='rounded-lg border border-dashed p-10 text-center text-muted-foreground'>
            No products match your search.
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
            {productList.map((product) => {
              const rating = Number(product.rating ?? 0)
              const safeStars = Math.max(0, Math.min(5, Math.round(rating)))
              const productName = product.name || product.title || 'Product'
              const productPrice = Number(product.price ?? 0)

              return (
                <Link to={`/products/${product._id || product.id || productName}`} key={product._id || product.id || productName}>
                <Card key={product._id || product.id || productName} className='group overflow-hidden transition-all hover:shadow-lg'>
                  <CardContent className='flex flex-col gap-4'>
                    <div className='overflow-hidden rounded-md'>
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1528740561666-dc2479dc08a9?auto=format&fit=crop&w=900&q=80'}
                        alt={productName}
                        width={400}
                        height={400}
                        className='aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                    </div>

                    <div className='flex flex-col gap-2'>
                      <CardTitle className='line-clamp-1 text-lg font-semibold text-balance sm:text-xl'>
                        {productName}
                      </CardTitle>

                      <div
                        className='flex items-center gap-0.5'
                        aria-label={`${rating} out of 5 stars`}
                        role='img'
                      >
                        {Array.from({ length: safeStars }).map((_, i) => (
                          <Star key={i} className='fill-foreground text-foreground size-4 sm:size-5' />
                        ))}
                      </div>

                      <p className='text-lg font-semibold sm:text-xl'>${productPrice.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductCard2
