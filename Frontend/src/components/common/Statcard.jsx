import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const StatCard = ({ title, value, icon: Icon, iconColor }) => {
  return (
    <Card className="hover:shadow-base transition-shadow duration-200">
      <CardContent className="flex items-center justify-between py-5">
        
        {/* Left: Title & Value */}
        <div className="flex flex-col space-y-1">
          <span className="text-sm md:text-base text-gray-600 font-medium">
            {title}
          </span>
          <span className={`text-2xl md:text-3xl font-bold ${iconColor}`}>
            {value}
          </span>
        </div>

        {/* Right: Icon */}
        {Icon && (
          <div className={`hidden md:flex items-center ${iconColor}`}>
            <Icon className="h-7 w-7 lg:h-8 lg:w-8" />
          </div>
        )}

      </CardContent>
    </Card>
  )
}

export default StatCard;