import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  PieChart, 
  History, 
  Trophy,
  LogOut,
  User,
  Menu,
  X,
  Play,
  GamepadIcon,
  ChevronDown,
  Sparkles
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      const loadingToast = toast.loading('Signing out...')
      await signOut()
      toast.dismiss(loadingToast)
      toast.success('Signed out successfully!')
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out. Please try again.')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Learn', href: '/learn', icon: BookOpen },
    { name: 'Videos', href: '/videos', icon: Play },
    { name: 'Quiz & Games', href: '/quiz', icon: GamepadIcon },
    { name: 'Trade', href: '/trade', icon: TrendingUp },
    { name: 'Portfolio', href: '/portfolio', icon: PieChart },
    { name: 'History', href: '/history', icon: History },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
  ]

  // Split navigation for desktop: first 5 items in main nav, rest in "More" menu
  const mainNavItems = navigation.slice(0, 5)
  const moreNavItems = navigation.slice(5)

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">{children}</div>
  }

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    closed: { 
      x: '-100%',
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }
  }

  const overlayVariants = {
    open: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    closed: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      x: 8,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col relative">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 270, 180, 90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear",
            delay: 10
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-600/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [-20, 20, -20],
            y: [-10, 10, -10],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{ 
            duration: 45, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 20
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 rounded-full blur-3xl"
        />
      </div>

      {/* Enhanced Top Header with Glassmorphism */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/70 backdrop-blur-xl border-b border-white/20 px-4 py-3 shadow-lg sticky top-0 z-40"
      >
        <div className="flex items-center justify-between">
          {/* Left: Menu Button + Enhanced Logo */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all duration-200 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
            
            {/* Enhanced Logo */}
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <motion.div 
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 40px rgba(147, 51, 234, 0.4)',
                      '0 0 20px rgba(59, 130, 246, 0.3)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-75"
                />
                <div className="relative p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="h-3 w-3 text-yellow-400" />
                </motion.div>
              </motion.div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                InvestWise
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation (Enhanced) */}
          <div className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-lg border border-blue-200/50'
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 mr-2 ${
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    {item.name}
                  </Link>
                </motion.div>
              )
            })}
            
            {/* Enhanced More Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white/50 hover:text-gray-900 rounded-xl transition-all duration-200"
              >
                <Menu className="h-4 w-4 mr-2" />
                More
                <motion.div
                  animate={{ rotate: moreMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4 ml-1" />
                </motion.div>
              </motion.button>

              {/* Enhanced More Dropdown Menu */}
              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="absolute top-full right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50"
                  >
                    {moreNavItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.href
                      
                      return (
                        <motion.div
                          key={item.name}
                          variants={menuItemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover="hover"
                          custom={index}
                        >
                          <Link
                            to={item.href}
                            onClick={() => setMoreMenuOpen(false)}
                            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-600'
                                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                            }`}
                          >
                            <Icon className={`h-4 w-4 mr-3 ${
                              isActive ? 'text-blue-600' : 'text-gray-500'
                            }`} />
                            {item.name}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Enhanced Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="relative"
            >
              <motion.div 
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.4)',
                    '0 0 0 8px rgba(59, 130, 246, 0)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm"
              >
                {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
              />
            </motion.button>
            
            {/* Enhanced Profile Dropdown */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute top-full right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 z-50"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold"
                      >
                        {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200/50 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Member since:</span>
                        <span className="text-gray-900">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Account type:</span>
                        <span className="text-green-600 font-medium flex items-center">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Free
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200/50 pt-3">
                      <motion.button
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-1">
        {/* Mobile/Tablet overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Enhanced Sidebar - Mobile/Tablet Only */}
        <motion.div
          variants={sidebarVariants}
          initial="closed"
          animate={sidebarOpen ? "open" : "closed"}
          className="fixed lg:hidden inset-y-0 left-0 z-50 w-72 bg-white/90 backdrop-blur-xl shadow-2xl border-r border-white/20"
        >
          <div className="flex flex-col h-full">
            {/* Enhanced Sidebar Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50"
            >
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-75"></div>
                  <div className="relative p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  InvestWise
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.div>

            {/* Enhanced Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <motion.div
                    key={item.name}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-600 shadow-lg'
                          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mr-3 transition-colors ${
                        isActive ? 'text-blue-600' : 'group-hover:text-blue-500'
                      }`} />
                      {item.name}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Enhanced Sidebar Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-blue-50/50"
            >
              <div className="flex items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
                >
                  {user.user_metadata?.full_name?.[0] || user.email[0].toUpperCase()}
                </motion.div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSignOut}
                  className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Main content with enhanced styling */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 lg:p-8 relative z-10"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Click outside handlers */}
      {moreMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setMoreMenuOpen(false)}
        />
      )}
      {profileOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setProfileOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout