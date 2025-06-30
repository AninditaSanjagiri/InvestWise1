import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, DollarSign, BarChart3, Target, Sparkles, Star } from 'lucide-react'

interface WelcomeAnimationProps {
  onComplete: () => void
  userName?: string
  isNewUser?: boolean
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ 
  onComplete, 
  userName = 'Investor',
  isNewUser = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [showCoins, setShowCoins] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep(1)
      setShowCoins(true)
    }, 1000)

    const timer2 = setTimeout(() => {
      setCurrentStep(2)
    }, 2500)

    const timer3 = setTimeout(() => {
      setCurrentStep(3)
    }, 4000)

    const timer4 = setTimeout(() => {
      onComplete()
    }, 6000)

    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  const coinVariants = {
    initial: { y: -100, opacity: 0, rotate: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      rotate: 360,
      transition: { 
        duration: 1.5,
        ease: "easeOut"
      }
    }
  }

  const graphVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 2,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Coins Animation */}
      {showCoins && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              variants={coinVariants}
              initial="initial"
              animate="animate"
              className="absolute"
              style={{
                left: `${10 + i * 8}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              transition={{ delay: i * 0.1 }}
            >
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="relative mx-auto w-24 h-24"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full blur-lg opacity-75"></div>
                <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold text-white"
              >
                {isNewUser ? `Welcome, ${userName}!` : `Welcome back, ${userName}!`}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-blue-200"
              >
                {isNewUser ? 'Your investment journey begins now' : 'Ready to continue your investment journey?'}
              </motion.p>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-6xl"
              >
                💰
              </motion.div>
              
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white"
              >
                $10,000 Virtual Portfolio
              </motion.h2>
              
              <motion.p
                className="text-lg text-blue-200"
              >
                Practice with real market data, zero risk
              </motion.p>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="relative">
                <motion.svg
                  width="200"
                  height="120"
                  viewBox="0 0 200 120"
                  className="mx-auto"
                >
                  <motion.path
                    d="M20 100 Q60 20 100 60 T180 20"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    fill="none"
                    variants={graphVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </motion.svg>
                
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-0 right-8"
                >
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </motion.div>
              </div>
              
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white"
              >
                Real-Time Market Data
              </motion.h2>
              
              <motion.p
                className="text-lg text-blue-200"
              >
                Learn with live prices and market movements
              </motion.p>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, ease: "linear" }}
                className="relative mx-auto w-20 h-20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-75"></div>
                <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <Target className="h-10 w-10 text-white" />
                </div>
              </motion.div>
              
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white"
              >
                Ready to Invest!
              </motion.h2>
              
              <motion.p
                className="text-lg text-blue-200"
              >
                Let's build your investment knowledge together
              </motion.p>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex justify-center space-x-2"
              >
                {[...Array(3)].map((_, i) => (
                  <Sparkles key={i} className="w-6 h-6 text-yellow-400" />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[0, 1, 2, 3].map((step) => (
            <motion.div
              key={step}
              className={`w-3 h-3 rounded-full ${
                currentStep >= step ? 'bg-white' : 'bg-white/30'
              }`}
              animate={{ scale: currentStep === step ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WelcomeAnimation