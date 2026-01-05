import { useState, useCallback } from 'react'
import initialMachinesData from '@/data/machines.js'

export const useMachines = () => {
  const [machines, setMachines] = useState(initialMachinesData)
  const [loading, setLoading] = useState(false)

  const addMachine = useCallback((newMachine) => {
    setMachines(prev => [...prev, newMachine])
  }, [])

  const updateMachine = useCallback((terminalId, updatedData) => {
    setMachines(prev => 
      prev.map(m => m.terminal_id === terminalId ? { ...m, ...updatedData } : m)
    )
  }, [])

  const deleteMachine = useCallback((terminalId) => {
    setMachines(prev => prev.filter(m => m.terminal_id !== terminalId))
  }, [])

  return {
    machines,
    loading,
    addMachine,
    updateMachine,
    deleteMachine
  }
}

// versi  bener (API)
// import { useState, useEffect, useCallback } from 'react'
// import { machineAPI } from '@/services/api'
// import { toast } from 'sonner'

// export const useMachines = () => {
//   const [machines, setMachines] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const fetchMachines = useCallback(async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await machineAPI.getAll()
//       setMachines(response.data.data)
//     } catch (err) {
//       setError(err.message)
//       toast.error('Gagal memuat data mesin')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchMachines()
//   }, [fetchMachines])

//   const addMachine = useCallback(async (newMachine) => {
//     try {
//       const response = await machineAPI.create(newMachine)
//       setMachines(prev => [...prev, response.data.data])
//       toast.success('Mesin berhasil ditambahkan')
//       return response.data.data
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Gagal menambah mesin')
//       throw err
//     }
//   }, [])

//   const updateMachine = useCallback(async (terminalId, updatedData) => {
//     try {
//       const response = await machineAPI.update(terminalId, updatedData)
//       setMachines(prev => 
//         prev.map(m => m.terminal_id === terminalId ? response.data.data : m)
//       )
//       toast.success('Mesin berhasil diperbarui')
//       return response.data.data
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Gagal memperbarui mesin')
//       throw err
//     }
//   }, [])

//   const deleteMachine = useCallback(async (terminalId) => {
//     try {
//       await machineAPI.delete(terminalId)
//       setMachines(prev => prev.filter(m => m.terminal_id !== terminalId))
//       toast.success('Mesin berhasil dihapus')
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Gagal menghapus mesin')
//       throw err
//     }
//   }, [])

//   return {
//     machines,
//     loading,
//     error,
//     fetchMachines,
//     addMachine,
//     updateMachine,
//     deleteMachine
//   }
// }