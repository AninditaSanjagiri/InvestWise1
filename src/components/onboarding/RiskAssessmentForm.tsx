import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Target, TrendingUp, Shield, Zap } from 'lucide-react'
import { riskQuestions, calculateRiskProfile, getRiskProfileDescription } from '../../data/riskQuestions'
import { RiskAssessmentAnswer, RiskAssessmentData } from '../../types/onboarding'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface RiskAssessmentFormProps {
  onComplete: (data: RiskAssessmentData) => void
}

const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({ onComplete }) => {
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<RiskAssessmentAnswer[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate')

  const handleAnswerSelect = (optionText: string, score: number) => {
    setSelectedOption(optionText)
    
    const newAnswer: RiskAssessmentAnswer = {
      questionId: riskQuestions[currentQuestion].id,
      answer: optionText,
      score
    }

    const updatedAnswers = [...answers]
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === newAnswer.questionId)
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer
    } else {
      updatedAnswers.push(newAnswer)
    }
    
    setAnswers(updatedAnswers)
  }

  const handleNext = () => {
    if (!selectedOption) {
      toast.error('Please select an answer before continuing')
      return
    }

    if (currentQuestion < riskQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      // Check if we already have an answer for the next question
      const nextQuestionAnswer = answers.find(a => a.questionId === riskQuestions[currentQuestion + 1].id)
      setSelectedOption(nextQuestionAnswer?.answer || '')
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      const prevQuestionAnswer = answers.find(a => a.questionId === riskQuestions[currentQuestion - 1].id)
      setSelectedOption(prevQuestionAnswer?.answer || '')
    }
  }

  const handleSubmit = async () => {
    if (answers.length !== riskQuestions.length) {
      toast.error('Please answer all questions')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Calculate total score correctly
      const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0)
      console.log('Total Score:', totalScore) // Debug log
      
      // Use the fixed calculation function
      const calculatedProfile = calculateRiskProfile(totalScore)
      console.log('Calculated Profile:', calculatedProfile) // Debug log
      
      setRiskProfile(calculatedProfile)

      const assessmentData: RiskAssessmentData = {
        answers,
        totalScore,
        riskProfile: calculatedProfile
      }

      // Update user profile in Supabase with the CORRECT risk profile
      const { error } = await supabase
        .from('users')
        .update({
          risk_profile: calculatedProfile, // This should now be correct
          questionnaire_answers: answers
        })
        .eq('id', user!.id)

      if (error) throw error

      setShowResults(true)
      toast.success(`Risk assessment completed! You are a ${calculatedProfile} investor.`)
      
      // Auto-proceed after showing results
      setTimeout(() => {
        onComplete(assessmentData)
      }, 3000)

    } catch (error) {
      console.error('Error saving risk assessment:', error)
      toast.error('Failed to save assessment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / riskQuestions.length) * 100

  if (showResults) {
    const profileInfo = getRiskProfileDescription(riskProfile)
    const ProfileIcon = riskProfile === 'conservative' ? Shield : 
                       riskProfile === 'moderate' ? Target : Zap

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`inline-flex p-4 rounded-full mb-6 ${
              riskProfile === 'conservative' ? 'bg-green-100' :
              riskProfile === 'moderate' ? 'bg-blue-100' : 'bg-red-100'
            }`}
          >
            <ProfileIcon className={`h-12 w-12 ${
              riskProfile === 'conservative' ? 'text-green-600' :
              riskProfile === 'moderate' ? 'text-blue-600' : 'text-red-600'
            }`} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {profileInfo.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-6"
          >
            {profileInfo.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-lg p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile Characteristics:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileInfo.characteristics.map((characteristic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    riskProfile === 'conservative' ? 'bg-green-500' :
                    riskProfile === 'moderate' ? 'bg-blue-500' : 'bg-red-500'
                  }`} />
                  <span className="text-gray-700">{characteristic}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Suggested Target Return:</span>
                <span className={`font-bold text-lg ${
                  riskProfile === 'conservative' ? 'text-green-600' :
                  riskProfile === 'moderate' ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {profileInfo.targetReturn}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-gray-500"
          >
            Proceeding to goal setting in a moment...
          </motion.p>
        </div>
      </motion.div>
    )
  }

  const currentQ = riskQuestions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Risk Assessment</h1>
            <p className="text-gray-600">Help us understand your investment preferences</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {riskQuestions.length}</p>
            <p className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(option.text, option.score)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-200 ${
                  selectedOption === option.text
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">{option.text}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === option.text
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedOption === option.text && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!selectedOption || isSubmitting}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>{currentQuestion === riskQuestions.length - 1 ? 'Complete Assessment' : 'Next'}</span>
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default RiskAssessmentForm