import { Navigate, Outlet } from "react-router"
import { useAuth } from "@/context/AuthContext"
import Loading from "@/components/common/Loading"

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <Loading/>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
          <p className="text-xl text-gray-700 mb-4">Akses Ditolak</p>
          <p className="text-gray-600 mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[#00AEEF] text-white rounded-lg hover:bg-[#0099D6]"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
export default AdminRoute;