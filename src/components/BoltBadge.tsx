import React from 'react'
import { motion } from 'framer-motion'

const BoltBadge: React.FC = () => {
  const badgeVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.8,
      y: 100
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 1
      }
    }
  }

  const pulseVariants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(0, 0, 0, 0.1)',
        '0 0 40px rgba(59, 130, 246, 0.3)',
        '0 0 20px rgba(0, 0, 0, 0.1)'
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const floatVariants = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.a
      href="https://bolt.new/"
      target="_blank"
      rel="noopener noreferrer"
      variants={badgeVariants}
      initial="initial"
      animate="animate"
      whileHover={{ 
        scale: 1.1, 
        rotate: 5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 group"
      title="Powered by Bolt.new"
    >
      <div className="relative">
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="w-full h-full"
          >
            <img
              src="/black_circle_360x360.png"
              alt="Powered by Bolt.new"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
        
        {/* Enhanced Tooltip */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          whileHover={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100"
        >
          <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
            Powered by Bolt.new
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
          </div>
        </motion.div>
      </div>
    </motion.a>
  )
}

export default BoltBadge