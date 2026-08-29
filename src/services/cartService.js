const CART_STORAGE_KEY = 'cart'

const emptyCart = () => ({
  products: [],
  total: 0,
})

const readCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    const cart = storedCart ? JSON.parse(storedCart) : emptyCart()

    return {
      products: Array.isArray(cart.products) ? cart.products : [],
      total: Number(cart.total) || 0,
    }
  } catch {
    return emptyCart()
  }
}

const writeCart = (products) => {
  const total = products.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  )
  const cart = { products, total }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  return cart
}

export const getCart = async () => readCart()

export const addToCart = async (product, quantity = 1) => {
  if (!product) {
    throw new Error('A product is required to add to cart')
  }

  const productId = product._id || product.id
  if (!productId) {
    throw new Error('This product cannot be added because it has no id')
  }

  const cart = readCart()
  const productPrice = Number(product.price || 0)
  const itemQuantity = Number(quantity) || 1
  const existingIndex = cart.products.findIndex((item) => {
    const itemProductId = item?.product?._id || item?.product?.id || item?.product
    return String(itemProductId) === String(productId)
  })
  const products = [...cart.products]

  if (existingIndex >= 0) {
    products[existingIndex] = {
      ...products[existingIndex],
      product,
      quantity: Number(products[existingIndex].quantity || 0) + itemQuantity,
      price: productPrice,
    }
  } else {
    products.push({ product, quantity: itemQuantity, price: productPrice })
  }

  return writeCart(products)
}

export const removeFromCart = async (productId) => {
  const cart = readCart()
  const products = cart.products.filter((item) => {
    const itemProductId = item?.product?._id || item?.product?.id || item?.product
    return String(itemProductId) !== String(productId)
  })

  return writeCart(products)
}

export const clearCart = async () => {
  localStorage.removeItem(CART_STORAGE_KEY)
  return emptyCart()
}

export const updateQuantity = async (productId, quantity) => {
  const cart = readCart()
  const products = cart.products.map((item) => {
    const itemProductId = item?.product?._id || item?.product?.id || item?.product

    return String(itemProductId) === String(productId)
      ? { ...item, quantity: Math.max(1, Number(quantity) || 1) }
      : item
  })

  return writeCart(products)
}
