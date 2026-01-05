import React from 'react'
import { Routes, Route, Navigate } from 'react-router'

// Layout
import MainLayout from '@/components/layout/MainLayout'

// Pages
import Dashboard from '@/pages/Dashboard'
import Overdue from '@/pages/Overdue'
import Rekap from '@/pages/Rekap'
import Sewa from '@/pages/Sewa'
import DetailMesin from '@/pages/DetailMesin'

// Modals
import AddModal from '@/components/modal/AddModal'
import EditModal from '@/components/modal/EditModal'

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/overdue" element={<Overdue />} />
          <Route path="/rekap" element={<Rekap />} />
          <Route path="/sewa" element={<Sewa />} />
          <Route path="/mesin/:id" element={<DetailMesin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Modals - manage their own state */}
      <AddModal />
      <EditModal />
    </>
  )
}

export default App