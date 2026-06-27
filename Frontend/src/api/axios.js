import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Otomatis sisipkan Bearer token dari localStorage di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutritrack_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Jika 401, bersihkan token dan redirect ke login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nutritrack_token')
      localStorage.removeItem('nutritrack_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
