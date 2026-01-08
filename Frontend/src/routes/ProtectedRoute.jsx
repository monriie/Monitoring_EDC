import { Navigate, Outlet } from "react-router"
import { useAuth } from "@/context/AuthContext"
import Loading from "@/components/common/Loading"

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <Loading/>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
export default ProtectedRoute;