import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Calendar, DollarSign, TrendingUp, Save } from 'lucide-react'
import { Goal } from '../../types/onboarding'
import { getRiskProfileDescription } from '../../data/riskQuestions'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface GoalSettingFormProps {
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
  onComplete: () => void
}

const GoalSettingForm: React.FC<GoalSettingFormProps> = ({ riskProfile, onComplete }) => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [goal, setGoal] = useState<Partial<Goal>>({
    goal_description: '',
    target_amount: 0,
    target_date: '',
    target_return_percentage: 0
  })

  const profileInfo = getRiskProfileDescription(riskProfile)
  const suggestedReturn = riskProfile === 'conservative' ? 6.5 : 
                         riskProfile === 'moderate' ? 10 : 15

  React.useEffect(() => {
    setGoal(prev => ({ ...prev, target_return_percentage: suggestedReturn }))
  }, [suggestedReturn])

  const handleInputChange = (field: keyof Goal, value: string | number) => {
    setGoal(prev => ({ ...prev, [field]: value }))
  }

  const calculateProjectedValue = () => {
    if (!goal.target_amount || !goal.target_return_percentage || !goal.target_date) return 0
    
    const years = (new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365)
    if (years <= 0) return goal.target_amount
    
    const rate = goal.target_return_percentage / 100
    return goal.target_amount * Math.pow(1 + rate, years)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!goal.goal_description || !goal.target_amount || !goal.target_date) {
      toast.error('Please fill in all required fields')
      return
    }

    if (new Date(goal.target_date) <= new Date()) {
      toast.error('Target date must be in the future')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user!.id,
          goal_description: goal.goal_description,
          target_amount: goal.target_amount,
          target_date: goal.target_date,
          target_return_percentage: goal.target_return_percentage
        })

      if (error) throw error

      // Mark onboarding as completed
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', user!.id)

      toast.success('Goal set successfully! Welcome to InvestWise!')
      onComplete()

    } catch (error) {
      console.error('Error saving goal:', error)
      toast.error('Failed to save goal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const projectedValue = calculateProjectedValue()
  const years = goal.target_date ? 
    Math.max(0, (new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
            <Target className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Set Your Financial Goal</h1>
            <p className="text-gray-600">Define what you're working towards</p>
          </div>
        </div>

        {/* Risk Profile Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Risk Profile: {profileInfo.title}</h3>
          <p className="text-gray-600 mb-3">{profileInfo.description}</p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">Suggested Return: <strong>{profileInfo.targetReturn}</strong></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Goal Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Goal Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What are you saving for? *
            </label>
            <div className="relative">
              <Target className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={goal.goal_description}
                onChange={(e) => handleInputChange('goal_description', e.target.value)}
                placeholder="e.g., Retirement, House down payment, Emergency fund"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount *
              </label>
              <div className="relative">
                <DollarSign className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={goal.target_amount || ''}
                  onChange={(e) => handleInputChange('target_amount', parseFloat(e.target.value) || 0)}
                  placeholder="50000"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Date *
              </label>
              <div className="relative">
                <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={goal.target_date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('target_date', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Expected Return */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Annual Return (%)
            </label>
            <div className="relative">
              <TrendingUp className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={goal.target_return_percentage || ''}
                onChange={(e) => handleInputChange('target_return_percentage', parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Based on your risk profile, we suggest {suggestedReturn}% annual return
            </p>
          </div>

          {/* Projection Display */}
          {goal.target_amount && goal.target_date && goal.target_return_percentage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Projection</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Initial Investment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${goal.target_amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Time Period</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {years.toFixed(1)} years
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Projected Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Potential gain: <span className="font-semibold text-green-600">
                    ${(projectedValue - (goal.target_amount || 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Complete Setup & Start Investing</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default GoalSettingForm