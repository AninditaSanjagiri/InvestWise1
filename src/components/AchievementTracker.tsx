import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Target, TrendingUp, BookOpen, DollarSign, Award, CheckCircle, Lock } from 'lucide-react'

interface Achievement {
  id: string
  type: string
  title: string
  description: string
  progress: number
  maxProgress: number
  unlocked: boolean
  category: 'trading' | 'learning' | 'portfolio' | 'milestone'
}

interface AchievementTrackerProps {
  achievements: Achievement[]
  compact?: boolean
}

const AchievementTracker: React.FC<AchievementTrackerProps> = ({ achievements, compact = false }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trading': return TrendingUp
      case 'learning': return BookOpen
      case 'portfolio': return Target
      case 'milestone': return Award
      default: return Trophy
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trading': return 'text-green-600 bg-green-100'
      case 'learning': return 'text-blue-600 bg-blue-100'
      case 'portfolio': return 'text-purple-600 bg-purple-100'
      case 'milestone': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const recentlyUnlocked = achievements.filter(a => a.unlocked).slice(0, compact ? 3 : 6)
  const inProgress = achievements.filter(a => !a.unlocked && a.progress > 0).slice(0, compact ? 2 : 4)

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
          <Trophy className="h-5 w-5 text-yellow-500" />
        </div>
        
        <div className="space-y-3">
          {recentlyUnlocked.length > 0 ? (
            recentlyUnlocked.map((achievement, index) => {
              const CategoryIcon = getCategoryIcon(achievement.category)
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                >
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <CategoryIcon className="h-4 w-4 text-yellow-600" />
                </motion.div>
              )
            })
          ) : (
            <div className="text-center py-4">
              <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No achievements unlocked yet</p>
              <p className="text-gray-400 text-xs">Start trading and learning to earn achievements!</p>
            </div>
          )}
        </div>

        {inProgress.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">In Progress</h4>
            <div className="space-y-2">
              {inProgress.map((achievement, index) => {
                const progressPercent = (achievement.progress / achievement.maxProgress) * 100
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{achievement.title}</p>
                      <span className="text-xs text-gray-500">
                        {achievement.progress}/{achievement.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement, index) => {
        const CategoryIcon = getCategoryIcon(achievement.category)
        const progressPercent = (achievement.progress / achievement.maxProgress) * 100
        
        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 ${
              achievement.unlocked ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-full ${
                achievement.unlocked 
                  ? 'bg-yellow-100' 
                  : 'bg-gray-100'
              }`}>
                {achievement.unlocked ? (
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                ) : (
                  <CategoryIcon className={`h-6 w-6 ${
                    achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                )}
              </div>
              {!achievement.unlocked && (
                <Lock className="h-4 w-4 text-gray-400" />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h3 className={`text-lg font-semibold ${
                  achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className={`font-medium ${
                    achievement.unlocked ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      achievement.unlocked ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(achievement.category)}`}>
                  {achievement.category}
                </span>
                
                {achievement.unlocked && (
                  <span className="text-xs text-yellow-600 font-medium">
                    ✨ Unlocked!
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default AchievementTracker