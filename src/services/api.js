import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_MONGO_API_URL || "http://localhost:5005"
})

export default api