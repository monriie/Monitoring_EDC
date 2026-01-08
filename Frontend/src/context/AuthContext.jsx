import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"
import { authAPI } from "@/service/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // cek session ke backend
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authAPI.me()
        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    try {
      const res = await authAPI.login({ username, password })
      setUser(res)
      localStorage.setItem("token", res.token)
      
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
