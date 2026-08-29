import api from './api'

const CART_STORAGE_KEY = 'cartId'

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

const getStoredCartId = () => localStorage.getItem(CART_STORAGE_KEY)

const setStoredCartId = (cartId) => {
  if (!cartId) {
    localStorage.removeItem(CART_STORAGE_KEY)
    return
  }

  localStorage.setItem(CART_STORAGE_KEY, cartId)
}

export const getCart = async () => {
  const cartId = getStoredCartId()

  if (!cartId) {
    return null
  }

  const response = await api.get(`/api/cart/${cartId}`, {
    headers: getAuthHeaders(),
  })

  return response.data
}

export const addToCart = async (product, quantity = 1) => {
  if (!product) {
    throw new Error('A product is required to add to cart')
  }

  const token = localStorage.getItem('authToken')

  if (!token) {
    throw new Error('Please log in to add items to your cart')
  }

  const productId = product._id || product.id
  const productPrice = Number(product.price ?? 0)
  const cartId = getStoredCartId()

  const cartItem = {
    product: productId,
    quantity: Number(quantity) || 1,
    price: productPrice,
  }

  if (!cartId) {
    const response = await api.post(
      '/api/cart',
      {
        products: [cartItem],
        total: productPrice * (Number(quantity) || 1),
      },
      {
        headers: getAuthHeaders(),
      }
    )

    setStoredCartId(response.data?._id)
    return response.data
  }

  const existingCartResponse = await api.get(`/api/cart/${cartId}`, {
    headers: getAuthHeaders(),
  })

  const existingProducts = Array.isArray(existingCartResponse.data?.products) ? existingCartResponse.data.products : []
  const cartIndex = existingProducts.findIndex((item) => {
    const itemProductId = item?.product?._id || item?.product
    return itemProductId === productId
  })

  let updatedProducts = [...existingProducts]

  if (cartIndex >= 0) {
    const currentItem = updatedProducts[cartIndex]
    updatedProducts[cartIndex] = {
      ...currentItem,
      quantity: Number(currentItem.quantity || 0) + Number(quantity || 1),
      price: productPrice,
    }
  } else {
    updatedProducts.push(cartItem)
  }

  const total = updatedProducts.reduce((sum, item) => {
    const itemPrice = Number(item.price ?? 0)
    const itemQuantity = Number(item.quantity ?? 1)
    return sum + itemPrice * itemQuantity
  }, 0)

  const response = await api.patch(
    `/api/cart/${cartId}`,
    {
      products: updatedProducts,
      total,
    },
    {
      headers: getAuthHeaders(),
    }
  )

  return response.data
}

export const removeFromCart = async (productId) => {
  const cartId = getStoredCartId()

  if (!cartId) {
    return null
  }

  const currentCart = await getCart()
  const products = Array.isArray(currentCart?.products) ? currentCart.products : []
  const updatedProducts = products.filter((item) => {
    const itemProductId = item?.product?._id || item?.product
    return itemProductId !== productId
  })

  const total = updatedProducts.reduce((sum, item) => {
    const itemPrice = Number(item.price ?? 0)
    const itemQuantity = Number(item.quantity ?? 1)
    return sum + itemPrice * itemQuantity
  }, 0)

  const response = await api.patch(
    `/api/cart/${cartId}`,
    { products: updatedProducts, total },
    { headers: getAuthHeaders() }
  )

  return response.data
}

export const clearCart = async () => {
  const cartId = getStoredCartId()

  if (!cartId) {
    return null
  }

  const response = await api.patch(
    `/api/cart/${cartId}`,
    { products: [], total: 0 },
    { headers: getAuthHeaders() }
  )

  setStoredCartId(null)
  return response.data
}

export const updateQuantity = async (productId, quantity) => {
  const cartId = getStoredCartId()

  if (!cartId) {
    return null
  }

  const currentCart = await getCart()
  const products = Array.isArray(currentCart?.products) ? currentCart.products : []
  const updatedProducts = products.map((item) => {
    const itemProductId = item?.product?._id || item?.product

    if (itemProductId === productId) {
      return {
        ...item,
        quantity: Number(quantity) || 1,
      }
    }

    return item
  })

  const total = updatedProducts.reduce((sum, item) => {
    const itemPrice = Number(item.price ?? 0)
    const itemQuantity = Number(item.quantity ?? 1)
    return sum + itemPrice * itemQuantity
  }, 0)

  const response = await api.patch(
    `/api/cart/${cartId}`,
    { products: updatedProducts, total },
    { headers: getAuthHeaders() }
  )

  return response.data
};