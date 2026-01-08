// Frontend/src/components/common/Loading.jsx
import React from 'react'
import { Loader2 } from 'lucide-react'

const Loading = ({ message = 'Memuat data...' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <Loader2 className="animate-spin h-12 w-12 text-[#00AEEF] mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
)

export default Loading;