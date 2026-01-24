import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"
import { authAPI } from "@/service/api"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Cek session dari localStorage saat mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")
        
        if (token && savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to parse user data:", error)
        // Clear corrupted data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    // Validasi input
    if (!username || !password) {
      toast.error("Username dan password harus diisi")
      return { success: false, message: "Username dan password harus diisi" }
    }

    setLoading(true)
    
    try {
      const res = await authAPI.login({ username, password })
      
      // Validasi response
      if (!res.token) {
        throw new Error("Token tidak ditemukan")
      }
      
      // Simpan user data
      const userData = {
        username: res.user?.username || username,
        role: res.user?.role || "user",
        name: res.user?.name || username,
        ...res.user
      }
      
      setUser(userData)
      localStorage.setItem("token", res.token)
      localStorage.setItem("user", JSON.stringify(userData))
      
      toast.success("Login berhasil")
      navigate("/", { replace: true })
      
      return { success: true, user: userData }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Login gagal"
      toast.error(errorMessage)
      console.error("Login error:", err)
      
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    
    try {
      // Call logout API jika ada
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
      // Tetap lanjut logout meskipun API error
    } finally {
      // Clear state dan localStorage
      setUser(null)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      
      toast.success("Logout berhasil")
      navigate("/login", { replace: true })
      setLoading(false)
    }
  }

  const updateUser = (userData) => {
    try {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      return { success: true }
    } catch (error) {
      console.error("Update user error:", error)
      return { success: false, message: error.message }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}