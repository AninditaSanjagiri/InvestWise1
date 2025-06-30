import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  BookOpen, 
  DollarSign,
  Award,
  Filter
} from 'lucide-react'
import { useRealTimePortfolio } from '../hooks/useRealTimePortfolio'
import AchievementTracker from '../components/AchievementTracker'
import LoadingSpinner from '../components/LoadingSpinner'

const Achievements: React.FC = () => {
  const { achievements, loading } = useRealTimePortfolio()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'trading' | 'learning' | 'portfolio' | 'milestone'>('all')

  const categories = [
    { key: 'all', label: 'All Achievements', icon: Trophy },
    { key: 'trading', label: 'Trading', icon: TrendingUp },
    { key: 'learning', label: 'Learning', icon: BookOpen },
    { key: 'portfolio', label: 'Portfolio', icon: Target },
    { key: 'milestone', label: 'Milestones', icon: Award }
  ]

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading achievements..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-600">Track your progress and unlock rewards as you learn and trade</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Progress</p>
          <p className="text-2xl font-bold text-blue-600">
            {unlockedCount}/{totalCount}
          </p>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
          <span className="text-sm font-medium text-blue-600">
            {Math.round((unlockedCount / totalCount) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{unlockedCount} unlocked</span>
          <span>{totalCount - unlockedCount} remaining</span>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = selectedCategory === category.key
            
            return (
              <motion.button
                key={category.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.key as any)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AchievementTracker achievements={filteredAchievements} />
      </motion.div>

      {filteredAchievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No achievements found in this category</p>
        </motion.div>
      )}

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center"
      >
        <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">More Achievements Coming Soon!</h3>
        <p className="text-gray-600 mb-4">
          We're working on adding more exciting achievements and rewards to make your learning journey even more engaging.
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <span>• Weekly Challenges</span>
          <span>• Learning Streaks</span>
          <span>• Social Features</span>
        </div>
      </motion.div>
    </div>
  )
}

export default Achievements