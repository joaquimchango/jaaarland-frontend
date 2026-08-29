import api from './api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

export const getOrders = async () => {
  const response = await api.get('/api/orders/all', {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const getOrder = async (id) => {
  const response = await api.get(`/api/orders/${id}`, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const createOrder = async (order) => {
  const response = await api.post('/api/orders', order, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const updateOrder = async (id, order) => {
  const response = await api.put(`/api/orders/${id}`, order, {
    headers: getAuthHeaders(),
  })
  return response.data
}

export const patchOrder = async (id, order) => {
  const response = await api.patch(`/api/orders/${id}`, order, {
    headers: getAuthHeaders(),
  })
  return response.data
}