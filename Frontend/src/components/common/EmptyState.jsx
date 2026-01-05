import React from 'react'

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="text-center py-12 text-gray-400">
    {Icon && <Icon size={48} className="mx-auto mb-3 opacity-50" />}
    <p className="font-medium">{title}</p>
    {description && <p className="text-sm mt-2">{description}</p>}
  </div>
)

export default EmptyState