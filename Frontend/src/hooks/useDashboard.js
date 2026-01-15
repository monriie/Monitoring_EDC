import { useState, useEffect, useCallback } from 'react'
import { dashboardAPI } from '@/service/api'
import toast from 'react-hot-toast'

export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalMesin: 0,
    terdataBank: 0,
    statusMesin: [],
    statusOverdue: [],
  })
  const [mesinBaru, setMesinBaru] = useState([])
  const [overdueList, setOverdueList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await dashboardAPI.GetDashboard()

      const data = res

      setStats({
        totalMesin: data.stats?.totalMesin ?? 0,
        terdataBank: data.stats?.terdataBank ?? 0,
        statusMesin: data.stats?.statusMesin ?? [],
        statusOverdue: data.stats?.statusOverdue ?? [],
      })

      setMesinBaru(data.mesinBaru ?? [])
      setOverdueList(data.monitoringOverdue ?? [])

      return { success: true }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        'Gagal memuat data dashboard'

      setError(errorMessage)
      toast.error(errorMessage)

      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    stats,
    mesinBaru,
    overdueList,
    loading,
    error,
    refetch: fetchDashboardData,
  }
}
