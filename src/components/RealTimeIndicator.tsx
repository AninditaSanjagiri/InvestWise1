import React from 'react'
import { motion } from 'framer-motion'

interface RealTimeIndicatorProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({ 
  label = "Live", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5 text-xs',
    md: 'w-2 h-2 text-sm',
    lg: 'w-3 h-3 text-base'
  }

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]} bg-green-500 rounded-full`}
      />
      <span className={`${sizeClasses[size].split(' ')[2]} text-gray-600 font-medium`}>
        {label}
      </span>
    </div>
  )
}

export default RealTimeIndicator