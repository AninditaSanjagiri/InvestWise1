import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import OnboardingFlow from './onboarding/OnboardingFlow'
import LoadingSpinner from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && !authLoading) {
      checkOnboardingStatus()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, authLoading])

  const checkOnboardingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user!.id)
        .single()

      if (error) {
        console.error('Error checking onboarding status:', error)
        // If there's an error, assume onboarding is not completed
        setOnboardingCompleted(false)
      } else {
        setOnboardingCompleted(data?.onboarding_completed || false)
      }
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error)
      setOnboardingCompleted(false)
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingComplete = () => {
    setOnboardingCompleted(true)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (onboardingCompleted === false) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  return <>{children}</>
}

export default ProtectedRoute