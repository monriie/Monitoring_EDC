import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"
import { authAPI } from "@/service/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Cek session dari localStorage
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const savedUser = localStorage.getItem("user")
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
        } catch (error) {
          console.error("Failed to parse user data:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const res = await authAPI.login({ username, password })
      
      // Simpan user data (tanpa role check)
      const userData = { username: res.user?.username || username }
      
      setUser(userData)
      localStorage.setItem("token", res.token)
      localStorage.setItem("user", JSON.stringify(userData))
      
      toast.success("Login berhasil")
      navigate("/")
      return { success: true }
    } catch (err) {
      toast.error(err.message || "Login gagal")
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } finally {
      setUser(null)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      navigate("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}