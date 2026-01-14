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

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        totalMesinRes,
        terdataBankRes,
        statusMesinRes,
        statusOverdueRes,
        mesinBaruRes,
        monitoringOverdueRes,
      ] = await Promise.all([
        dashboardAPI.getTotalMesin(),
        dashboardAPI.getTerdataBank(),
        dashboardAPI.getStatusMesin(),
        dashboardAPI.getStatusOverdue(),
        dashboardAPI.getMesinBaruVendor(),
        dashboardAPI.getMonitoringOverdue(),
      ])

      setStats({
        totalMesin: totalMesinRes?.data?.total_mesin ?? 0,
        terdataBank: terdataBankRes?.data?.mesin_terdata_bank ?? 0,
        statusMesin: statusMesinRes?.data ?? [],
        statusOverdue: statusOverdueRes?.data?.statusOverdue ?? [],
      })
      
      setMesinBaru(mesinBaruRes ?? [])
      setOverdueList(monitoringOverdueRes?.monitoring_overdue ?? [])

      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat data dashboard'
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