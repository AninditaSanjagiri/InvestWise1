import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'list'
  count?: number
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'card', count = 3 }) => {
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  const SkeletonCard = ({ index }: { index: number }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-lg shadow-md p-6 space-y-4"
    >
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%]"
      />
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        style={{ animationDelay: `${index * 0.1}s` }}
        className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] w-3/4"
      />
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        style={{ animationDelay: `${index * 0.2}s` }}
        className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] w-1/2"
      />
    </motion.div>
  )

  const SkeletonTable = () => (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6 border-b">
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] w-1/4"
        />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="p-6 flex items-center space-x-4"
          >
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              style={{ animationDelay: `${i * 0.1}s` }}
              className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full bg-[length:200%_100%]"
            />
            <div className="flex-1 space-y-2">
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                style={{ animationDelay: `${i * 0.15}s` }}
                className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] w-1/3"
              />
              <motion.div
                variants={shimmerVariants}
                animate="animate"
                style={{ animationDelay: `${i * 0.2}s` }}
                className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] w-1/2"
              />
            </div>
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              style={{ animationDelay: `${i * 0.25}s` }}
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] w-20"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const SkeletonList = () => (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          whileHover={{ x: 5, scale: 1.01 }}
          className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
        >
          <motion.div
            variants={shimmerVariants}
            animate="animate"
            style={{ animationDelay: `${i * 0.1}s` }}
            className="h-12 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg bg-[length:200%_100%]"
          />
          <div className="flex-1 space-y-2">
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              style={{ animationDelay: `${i * 0.15}s` }}
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] w-2/3"
            />
            <motion.div
              variants={shimmerVariants}
              animate="animate"
              style={{ animationDelay: `${i * 0.2}s` }}
              className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded bg-[length:200%_100%] w-1/2"
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )

  if (type === 'table') return <SkeletonTable />
  if (type === 'list') return <SkeletonList />
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </motion.div>
  )
}

export default SkeletonLoader