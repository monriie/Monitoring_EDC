import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - add auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          console.error('Forbidden:', data.message)
          break
        case 404:
          console.error('Not found:', data.message)
          break
        case 500:
          console.error('Server error:', data.message)
          break
        default:
          console.error('API Error:', data.message)
      }
      
      return Promise.reject(data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response from server')
      return Promise.reject({ message: 'Network error - please check your connection' })
    } else {
      // Something else happened
      console.error('Error:', error.message)
      return Promise.reject({ message: error.message })
    }
  }
)

// Dashboard API
export const dashboardAPI = {
  getTotalMesin: () => apiClient.get('/api/dashboard/total-mesin'),
  getTerdataBank: () => apiClient.get('/api/dashboard/terdata-bank'),
  getStatusMesin: () => apiClient.get('/api/dashboard/status-mesin'),
  getStatusOverdue: () => apiClient.get('/api/dashboard/status-overdue'),
  getMesinBaruVendor: () => apiClient.get('/api/dashboard/mesin-baru-vendor'),
  getMonitoringOverdue: () => apiClient.get('/api/dashboard/monitoring-overdue'),
}

// Overdue API
export const overdueAPI = {
  getSummary: () => apiClient.get('/api/overdue/summary'),
  getList: () => apiClient.get('/api/overdue/list'),
  search: (query) => apiClient.get('/api/overdue/search', { params: { q: query } }),
}

// Rekap API
export const rekapAPI = {
  getAll: (searchQuery) => apiClient.get('/api/rekap', { params: { search: searchQuery } }),
  create: (data) => apiClient.post('/api/rekap', data),
}

// Sewa API
export const sewaAPI = {
  getSummary: () => apiClient.get('/api/sewa/summary'),
  getList: () => apiClient.get('/api/sewa/list'),
  search: (query) => apiClient.get('/api/sewa/search', { params: { q: query } }),
}

// Detail Mesin API
export const mesinAPI = {
  getDetail: (id) => apiClient.get(`/api/rekap/${id}`),
  update: (id, data) => apiClient.put(`/api/rekap/${id}`, data),
}

// Auth API (if needed in future)
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
}

export default apiClient