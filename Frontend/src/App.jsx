import React from 'react'
import { Routes, Route, Navigate } from 'react-router'

// Layout
import MainLayout from '@/components/layout/MainLayout'

// Route
import ProtectedRoute from '@/routes/ProtectedRoute'

// Auth
import AuthLayout from '@/components/layout/AuthLayout'
import Login from '@/components/auth/Login'

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
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes - Semua user yang login bisa akses */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rekap" element={<Rekap />} />
            <Route path="/overdue" element={<Overdue />} />
            <Route path="/sewa" element={<Sewa />} />
            <Route path="/mesin/:id" element={<DetailMesin />} />
          </Route>
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Modals */}
      <AddModal />
      <EditModal />
    </>
  )
}

export default App