import { useState, useEffect, useCallback } from 'react'
import { dashboardAPI } from '@/service/api'
import { normalizeMachinesList } from '@/utils/statusNormalizer'
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

      // Normalize mesin baru (sudah dalam format MachineResponse dari backend)
      const normalizedMesinBaru = normalizeMachinesList(
        Array.isArray(data.mesinBaru) ? data.mesinBaru : []
      )
      setMesinBaru(normalizedMesinBaru)

      // Normalize monitoring overdue (sudah dalam format MachineResponse dari backend)
      const normalizedOverdue = normalizeMachinesList(
        Array.isArray(data.monitoringOverdue) ? data.monitoringOverdue : []
      )
      setOverdueList(normalizedOverdue)

      console.log('Dashboard data loaded:', {
        mesinBaru: normalizedMesinBaru.length,
        overdueList: normalizedOverdue.length
      })

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