import { useEffect, useMemo, useState } from 'react'
import { CategoryFilter1 } from '../components/category-filter-1'
import { ProductCard2 } from '../components/product-card-2'
import { getProducts } from '../services/productsServices'

const normalizeCategory = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const priceRangeMap = {
  'under-25': { min: 0, max: 25 },
  '25-50': { min: 25, max: 50 },
  '50-100': { min: 50, max: 100 },
  'over-100': { min: 100, max: Infinity },
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [selectedSort, setSelectedSort] = useState('featured')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await getProducts()
        const nextProducts = Array.isArray(response) ? response : Array.isArray(response?.products) ? response.products : []
        setProducts(nextProducts)
      } catch (error) {
        console.error('Error fetching products for catalog:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    let results = [...products]

    if (query) {
      results = results.filter((product) => {
        const name = (product.name || '').toLowerCase()
        const description = (product.description || '').toLowerCase()
        const category = (product.category || '').toLowerCase()

        return name.includes(query) || description.includes(query) || category.includes(query)
      })
    }

    if (selectedCategory !== 'all') {
      results = results.filter((product) => {
        const productCategory = normalizeCategory(product.category)
        return productCategory === selectedCategory || productCategory.includes(selectedCategory)
      })
    }

    if (selectedPriceRange !== 'all') {
      const range = priceRangeMap[selectedPriceRange] || { min: 0, max: Infinity }
      results = results.filter((product) => {
        const price = Number(product.price ?? 0)
        return price >= range.min && price < range.max
      })
    }

    switch (selectedSort) {
      case 'price-low':
        results.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0))
        break
      case 'price-high':
        results.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0))
        break
      case 'rating':
        results.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0))
        break
      case 'newest':
        results.sort((a, b) => Number(b._id ? 0 : 0) - Number(a._id ? 0 : 0))
        break
      default:
        results.sort((a, b) => Number(b.trending ?? 0) - Number(a.trending ?? 0) || Number(b.rating ?? 0) - Number(a.rating ?? 0))
        break
    }

    return results
  }, [products, searchQuery, selectedCategory, selectedPriceRange, selectedSort])

  return (
    <div>
      <CategoryFilter1
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={setSelectedPriceRange}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        totalProducts={filteredProducts.length}
      />

      {loading ? (
        <div className='mx-auto max-w-7xl px-4 py-12 text-muted-foreground'>Loading products...</div>
      ) : (
        <ProductCard2
          products={filteredProducts}
          title='All Products'
          subtitle={
            searchQuery || selectedCategory !== 'all' || selectedPriceRange !== 'all'
              ? `Showing ${filteredProducts.length} result${filteredProducts.length === 1 ? '' : 's'} for your selection`
              : 'Browse our complete collection of premium products.'
          }
        />
      )}
    </div>
  )
}