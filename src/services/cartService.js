
import api from './api'

const CART_STORAGE_KEY = 'cartId'

const getAuthConfig = () => {
  const token = localStorage.getItem('authToken')

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {}
}

const resolveProductId = (product) => {
  if (!product) {
    return null
  }

  if (typeof product === 'string' || typeof product === 'number') {
    return String(product)
  }

  return String(product._id || product.id)
}

export const getCart = async (cartId = localStorage.getItem(CART_STORAGE_KEY)) => {
  if (!cartId) {
    return { _id: null, products: [], total: 0 }
  }

  const response = await api.get(`/api/cart/${cartId}`, getAuthConfig())
  return response.data
}

export const createCart = async (productId, price = 0, quantity = 1) => {
  const normalizedProductId = resolveProductId(productId)

  if (!normalizedProductId) {
    throw new Error('A valid product id is required to create the cart')
  }

  const normalizedPrice = Number(price) || 0
  const normalizedQuantity = Math.max(1, Number(quantity) || 1)

  const payload = {
    products: [
      {
        product: normalizedProductId,
        price: normalizedPrice,
        quantity: normalizedQuantity,
      },
    ],
    total: normalizedPrice * normalizedQuantity,
  }

  const response = await api.post('/api/cart', payload, getAuthConfig())

  if (response.data?._id) {
    localStorage.setItem(CART_STORAGE_KEY, response.data._id)
  }

  return response.data
}

export const updateCart = async (cartId, productId, price = 0, quantity = 1) => {
  const storedCartId = cartId || localStorage.getItem(CART_STORAGE_KEY)

  if (!storedCartId) {
    return createCart(productId, price, quantity)
  }

  const cart = await getCart(storedCartId)
  const safeProducts = Array.isArray(cart?.products) ? cart.products : []
  const normalizedProductId = resolveProductId(productId)
  const normalizedPrice = Number(price) || 0
  const normalizedQuantity = Math.max(1, Number(quantity) || 1)

  if (!normalizedProductId) {
    throw new Error('A valid product id is required to update the cart')
  }

  const existingProductIndex = safeProducts.findIndex(
    (item) => String(item?.product) === String(normalizedProductId)
  )

  const updatedProducts = [...safeProducts]

  if (existingProductIndex >= 0) {
    updatedProducts[existingProductIndex] = {
      ...updatedProducts[existingProductIndex],
      product: normalizedProductId,
      price: normalizedPrice,
      quantity: normalizedQuantity,
    }
  } else {
    updatedProducts.push({
      product: normalizedProductId,
      price: normalizedPrice,
      quantity: normalizedQuantity,
    })
  }

  const total = updatedProducts.reduce((sum, item) => {
    return sum + Number(item?.price || 0) * Number(item?.quantity || 0)
  }, 0)

  const response = await api.patch(`/api/cart/${storedCartId}`, {
    products: updatedProducts,
    total,
  }, getAuthConfig())

  if (response.data?._id) {
    localStorage.setItem(CART_STORAGE_KEY, response.data._id)
  }

  return response.data
}

export const addToCart = async (productId, price = 0, quantity = 1) => {
  const normalizedProductId = resolveProductId(productId)

  if (!normalizedProductId) {
    throw new Error('A valid product id is required to add to cart')
  }

  const storedCartId = localStorage.getItem(CART_STORAGE_KEY)

  if (!storedCartId) {
    return createCart(normalizedProductId, price, quantity)
  }

  return updateCart(storedCartId, normalizedProductId, price, quantity)
}

export const removeFromCart = async (productId, cartId = localStorage.getItem(CART_STORAGE_KEY)) => {
  if (!cartId) {
    return { _id: null, products: [], total: 0 }
  }

  const cart = await getCart(cartId)
  const safeProducts = Array.isArray(cart?.products) ? cart.products : []
  const normalizedProductId = resolveProductId(productId)

  const remainingProducts = safeProducts.filter(
    (item) => String(item?.product) !== String(normalizedProductId)
  )

  const total = remainingProducts.reduce((sum, item) => {
    return sum + Number(item?.price || 0) * Number(item?.quantity || 0)
  }, 0)

  const response = await api.patch(`/api/cart/${cartId}`, {
    products: remainingProducts,
    total,
  }, getAuthConfig())

  return response.data
}

export const clearCart = async (cartId = localStorage.getItem(CART_STORAGE_KEY)) => {
  if (!cartId) {
    localStorage.removeItem(CART_STORAGE_KEY)
    return { _id: null, products: [], total: 0 }
  }

  const response = await api.delete(`/api/cart/${cartId}`, getAuthConfig())
  localStorage.removeItem(CART_STORAGE_KEY)
  return response.data
}

export const updateQuantity = async (productId, quantity, cartId = localStorage.getItem(CART_STORAGE_KEY)) => {
  const storedCartId = cartId || localStorage.getItem(CART_STORAGE_KEY)

  if (!storedCartId) {
    return createCart(productId, 0, quantity)
  }

  const cart = await getCart(storedCartId)
  const safeProducts = Array.isArray(cart?.products) ? cart.products : []
  const normalizedProductId = resolveProductId(productId)
  const existingItem = safeProducts.find((item) => String(item?.product) === String(normalizedProductId))

  return updateCart(storedCartId, normalizedProductId, existingItem?.price || 0, quantity)
}
