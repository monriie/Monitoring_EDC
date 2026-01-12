import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const StatCard = ({ title, value, icon: Icon, iconColor, subtitle }) => (
  <Card className="hover:shadow-base transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0">
      <CardTitle className="text-sm md:text-base font-medium text-gray-700">
        {title}
      </CardTitle>
      
    </CardHeader>
    <CardContent className="space-y-1">
      <div className={`text-xl md:text-3xl font-bold ${iconColor}`}>
        {value}
      </div>
      {subtitle && (
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      )}
      {Icon && (
        <div className={`shrink-0 ${iconColor}`}>
          <Icon className="hidden sm:flex h-6 w-6 md:h-8 md:w-8" />
        </div>
      )}
    </CardContent>
  </Card>
)

export default StatCard;