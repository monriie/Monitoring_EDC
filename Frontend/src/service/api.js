import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data && data.status === 'success' && data.data !== undefined) {
      return data.data
    }
    
    return data
  },
  (error) => {
    const errorResponse = {
      message: 'An error occurred',
      status: null,
      data: null
    }

    if (error.response) {
      const { status, data } = error.response
      errorResponse.status = status
      errorResponse.data = data
      
      if (data?.message) {
        errorResponse.message = data.message
      } else if (data?.status === 'error' && data?.message) {
        errorResponse.message = data.message
      } else {
        errorResponse.message = 'Server error'
      }
      
      if (status === 401) {
        localStorage.removeItem('token')
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    } else if (error.request) {
      errorResponse.message = 'Network error - please check your connection'
    } else {
      errorResponse.message = error.message
    }
    return Promise.reject(errorResponse)
  }
)

export const dashboardAPI = {
  getTotalMesin: () => apiClient.get('api/dashboard/total-mesin'),
  getTerdataBank: () => apiClient.get('api/dashboard/terdata-bank'),
  getStatusMesin: () => apiClient.get('api/dashboard/status-mesin'),
  getStatusOverdue: () => apiClient.get('api/dashboard/status-overdue'),
  getMesinBaruVendor: () => apiClient.get('api/dashboard/mesin-baru-vendor'),
  getMonitoringOverdue: () => apiClient.get('api/dashboard/monitoring-overdue'),
}

export const overdueAPI = {
  getSummary: () => apiClient.get('api/overdue/summary'),
  getList: () => apiClient.get('api/overdue/list'),
  search: (query) => apiClient.get('api/overdue/search', { params: { q: query } }),
}

export const rekapAPI = {
  getAll: (searchQuery = '') => apiClient.get('api/rekap', { 
    params: searchQuery ? { search: searchQuery } : {} 
  }),
  create: (data) => apiClient.post('api/rekap', data),
}

export const sewaAPI = {
  getSummary: () => apiClient.get('api/sewa/summary'),
  getList: () => apiClient.get('api/sewa/list'),
  search: (query) => apiClient.get('api/sewa/search', { params: { q: query } }),
}

export const mesinAPI = {
  getDetail: async (terminalId) => {
    try {
      return await apiClient.get(`api/rekap/${terminalId}`)
    } catch (error) {
      const allMachines = await apiClient.get('api/rekap')
      const machine = allMachines.find(m => m.terminal_id === terminalId)
      
      if (!machine) {
        throw new Error('Mesin tidak ditemukan')
      }
      
      return machine
    }
  },
  
  update: (terminalId, data) => {
    console.warn('Update endpoint not implemented in backend')
    return Promise.resolve({ message: 'Update success (mock)' })
  },
}

export const authAPI = {
  login: (credentials) => apiClient.post('auth/login', credentials),
  
  me: () => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        return Promise.resolve(JSON.parse(userData))
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
    
    return Promise.reject({ message: 'Not authenticated' })
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return Promise.resolve({ message: 'Logged out' })
  },
}

export default apiClient