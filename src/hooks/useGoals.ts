import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Goal } from '../types/onboarding'
import toast from 'react-hot-toast'

export const useGoals = () => {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setGoals(data || [])
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user!.id,
          ...goalData
        })
        .select()
        .single()

      if (error) throw error

      setGoals(prev => [data, ...prev])
      toast.success('Goal created successfully!')
      return data
    } catch (error) {
      console.error('Error creating goal:', error)
      toast.error('Failed to create goal')
      throw error
    }
  }

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', user!.id)
        .select()
        .single()

      if (error) throw error

      setGoals(prev => prev.map(goal => goal.id === goalId ? data : goal))
      toast.success('Goal updated successfully!')
      return data
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error('Failed to update goal')
      throw error
    }
  }

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user!.id)

      if (error) throw error

      setGoals(prev => prev.filter(goal => goal.id !== goalId))
      toast.success('Goal deleted successfully!')
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Failed to delete goal')
      throw error
    }
  }

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: fetchGoals
  }
}