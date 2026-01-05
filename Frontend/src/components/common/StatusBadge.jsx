import React from 'react'
import { Badge } from '@/components/ui/badge'
import { STATUS_COLORS, STATUS_LABELS } from '@/utils/constants'
import { cn } from '@/lib/utils'

const StatusBadge = ({ status }) => {
  const label = STATUS_LABELS[status] || status
  const className = STATUS_COLORS[status]

  return (
    <Badge
      variant="outline"
      className={cn('border-0', className)}
    >
      {label}
    </Badge>
  )
}

export default StatusBadge