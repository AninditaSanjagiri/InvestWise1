import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import RiskAssessmentForm from './RiskAssessmentForm'
import GoalSettingForm from './GoalSettingForm'
import LoadingSpinner from '../LoadingSpinner'
import { RiskAssessmentData, OnboardingState } from '../../types/onboarding'

interface OnboardingFlowProps {
  onComplete: () => void
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    currentStep: 'risk-assessment',
    isCompleted: false
  })

  useEffect(() => {
    checkOnboardingStatus()
  }, [user])

  const checkOnboardingStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('risk_profile, onboarding_completed')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data?.onboarding_completed) {
        onComplete()
        return
      }

      if (data?.risk_profile) {
        setOnboardingState({
          currentStep: 'goal-setting',
          riskProfile: data.risk_profile,
          isCompleted: false
        })
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRiskAssessmentComplete = (data: RiskAssessmentData) => {
    setOnboardingState({
      currentStep: 'goal-setting',
      riskProfile: data.riskProfile,
      isCompleted: false
    })
  }

  const handleGoalSettingComplete = () => {
    setOnboardingState(prev => ({ ...prev, isCompleted: true }))
    onComplete()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your onboarding..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                onboardingState.currentStep === 'risk-assessment' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-green-600 text-white'
              }`}>
                1
              </div>
              <span className={`text-sm font-medium ${
                onboardingState.currentStep === 'risk-assessment' ? 'text-blue-600' : 'text-green-600'
              }`}>
                Risk Assessment
              </span>
            </div>
            
            <div className={`w-16 h-1 rounded-full ${
              onboardingState.currentStep === 'goal-setting' ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
            
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                onboardingState.currentStep === 'goal-setting' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${
                onboardingState.currentStep === 'goal-setting' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                Goal Setting
              </span>
            </div>
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {onboardingState.currentStep === 'risk-assessment' && (
            <motion.div
              key="risk-assessment"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <RiskAssessmentForm onComplete={handleRiskAssessmentComplete} />
            </motion.div>
          )}

          {onboardingState.currentStep === 'goal-setting' && onboardingState.riskProfile && (
            <motion.div
              key="goal-setting"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <GoalSettingForm 
                riskProfile={onboardingState.riskProfile}
                onComplete={handleGoalSettingComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OnboardingFlow