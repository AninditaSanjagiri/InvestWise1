import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface PortfolioData {
  totalValue: number
  totalInvested: number
  totalGainLoss: number
  totalGainLossPercent: number
  cashBalance: number
  savingsBalance: number
  holdings: any[]
  transactions: any[]
}

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

export const useRealTimePortfolio = () => {
  const { user } = useAuth()
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalValue: 0,
    totalInvested: 10000,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    cashBalance: 0,
    savingsBalance: 0,
    holdings: [],
    transactions: []
  })
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)

  useEffect(() => {
    if (user) {
      fetchPortfolioData()
      
      // Set up controlled updates every 30 seconds
      const interval = setInterval(() => {
        const now = Date.now()
        // Only update if it's been at least 30 seconds since last fetch
        if (now - lastFetchTime > 30000) {
          updatePrices()
          setLastFetchTime(now)
        }
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [user]) // Only depend on user to prevent infinite loops

  const fetchPortfolioData = async () => {
    try {
      setLoading(true)

      // Get user balances
      const { data: userData } = await supabase
        .from('users')
        .select('cash_balance, savings_balance')
        .eq('id', user!.id)
        .single()

      // Get portfolio
      const { data: portfolioData } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user!.id)
        .single()

      // Get holdings with current prices
      const { data: holdingsData } = await supabase
        .from('holdings')
        .select(`
          *,
          investment_options!inner(current_price, price_change, price_change_percent, name)
        `)
        .eq('portfolio_id', portfolioData?.id)

      // Get transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('portfolio_id', portfolioData?.id)
        .order('created_at', { ascending: false })

      // Calculate real-time portfolio values with CORRECT financial logic
      const updatedHoldings = holdingsData?.map(holding => {
        const currentPrice = holding.investment_options.current_price
        const avgPrice = holding.avg_price
        const shares = holding.shares
        
        // CORRECT financial calculations
        const currentValue = shares * currentPrice
        const totalInvested = shares * avgPrice
        const absolutePL = currentValue - totalInvested
        const percentPL = totalInvested > 0 ? (absolutePL / totalInvested) * 100 : 0

        return {
          ...holding,
          current_price: currentPrice,
          current_value: currentValue,
          gain_loss: absolutePL,
          gain_loss_percent: percentPL
        }
      }) || []

      const totalHoldingsValue = updatedHoldings.reduce((sum, holding) => sum + holding.current_value, 0)
      const totalValue = (userData?.cash_balance || 0) + (userData?.savings_balance || 0) + totalHoldingsValue
      
      // CORRECT total gain/loss calculation
      const initialAmount = 10000
      const totalGainLoss = totalValue - initialAmount
      const totalGainLossPercent = (totalGainLoss / initialAmount) * 100

      setPortfolioData({
        totalValue,
        totalInvested: initialAmount,
        totalGainLoss,
        totalGainLossPercent,
        cashBalance: userData?.cash_balance || 0,
        savingsBalance: userData?.savings_balance || 0,
        holdings: updatedHoldings,
        transactions: transactionsData || []
      })

      // Update achievements based on portfolio data
      await updateAchievements({
        totalValue,
        totalGainLoss,
        holdingsCount: updatedHoldings.length,
        transactionsCount: transactionsData?.length || 0,
        totalTrades: transactionsData?.length || 0
      })

      setLastFetchTime(Date.now())

    } catch (error) {
      console.error('Error fetching portfolio data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePrices = async () => {
    try {
      // Simulate real-time price updates
      const { data: investments } = await supabase
        .from('investment_options')
        .select('*')
        .eq('is_active', true)

      if (investments) {
        const updates = investments.map(investment => {
          // Simulate price movement (-2% to +2%)
          const changePercent = (Math.random() - 0.5) * 0.04
          const newPrice = investment.current_price * (1 + changePercent)
          const priceChange = newPrice - investment.current_price
          const priceChangePercent = (priceChange / investment.current_price) * 100

          return {
            id: investment.id,
            current_price: Math.max(newPrice, 0.01),
            price_change: priceChange,
            price_change_percent: priceChangePercent,
            updated_at: new Date().toISOString()
          }
        })

        // Update prices in batches
        for (const update of updates) {
          await supabase
            .from('investment_options')
            .update({
              current_price: update.current_price,
              price_change: update.price_change,
              price_change_percent: update.price_change_percent,
              updated_at: update.updated_at
            })
            .eq('id', update.id)
        }

        // Refresh portfolio data with new prices (without showing loading)
        await fetchPortfolioData()
      }
    } catch (error) {
      console.error('Error updating prices:', error)
    }
  }

  const updateAchievements = async (stats: {
    totalValue: number
    totalGainLoss: number
    holdingsCount: number
    transactionsCount: number
    totalTrades: number
  }) => {
    try {
      // Get current game scores for learning achievements
      const { data: gameScores } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user!.id)

      const quizScore = gameScores?.find(gs => gs.game_type === 'quiz')?.score || 0
      const predictionScore = gameScores?.find(gs => gs.game_type === 'market_prediction')?.correct_predictions || 0

      // Define all achievements with current progress
      const allAchievements: Achievement[] = [
        {
          id: 'first_trade',
          type: 'first_trade',
          title: 'First Trade',
          description: 'Complete your first stock purchase',
          progress: Math.min(stats.totalTrades, 1),
          maxProgress: 1,
          unlocked: stats.totalTrades >= 1,
          category: 'trading'
        },
        {
          id: 'portfolio_builder',
          type: 'portfolio_builder',
          title: 'Portfolio Builder',
          description: 'Own 5 different stocks simultaneously',
          progress: Math.min(stats.holdingsCount, 5),
          maxProgress: 5,
          unlocked: stats.holdingsCount >= 5,
          category: 'portfolio'
        },
        {
          id: 'day_trader',
          type: 'day_trader',
          title: 'Day Trader',
          description: 'Complete 25 trades in total',
          progress: Math.min(stats.totalTrades, 25),
          maxProgress: 25,
          unlocked: stats.totalTrades >= 25,
          category: 'trading'
        },
        {
          id: 'profit_maker',
          type: 'profit_maker',
          title: 'Profit Maker',
          description: 'Achieve $1,000 in total gains',
          progress: Math.min(Math.max(stats.totalGainLoss, 0), 1000),
          maxProgress: 1000,
          unlocked: stats.totalGainLoss >= 1000,
          category: 'milestone'
        },
        {
          id: 'diversified_investor',
          type: 'diversified_investor',
          title: 'Diversified Investor',
          description: 'Own stocks from 3 different sectors',
          progress: Math.min(stats.holdingsCount, 3),
          maxProgress: 3,
          unlocked: stats.holdingsCount >= 3,
          category: 'portfolio'
        },
        {
          id: 'quiz_master',
          type: 'quiz_master',
          title: 'Quiz Master',
          description: 'Score 100 points in quizzes',
          progress: Math.min(quizScore, 100),
          maxProgress: 100,
          unlocked: quizScore >= 100,
          category: 'learning'
        },
        {
          id: 'prediction_expert',
          type: 'prediction_expert',
          title: 'Prediction Expert',
          description: 'Make 10 correct market predictions',
          progress: Math.min(predictionScore, 10),
          maxProgress: 10,
          unlocked: predictionScore >= 10,
          category: 'learning'
        },
        {
          id: 'high_roller',
          type: 'high_roller',
          title: 'High Roller',
          description: 'Have a portfolio worth $15,000 or more',
          progress: Math.min(stats.totalValue, 15000),
          maxProgress: 15000,
          unlocked: stats.totalValue >= 15000,
          category: 'milestone'
        }
      ]

      setAchievements(allAchievements)

      // Check for newly unlocked achievements and record them
      for (const achievement of allAchievements) {
        if (achievement.unlocked) {
          // Check if already recorded
          const existingRecord = gameScores?.find(gs => gs.game_type === achievement.type)
          
          if (!existingRecord) {
            // Record the achievement
            await supabase
              .from('game_scores')
              .insert({
                user_id: user!.id,
                game_type: achievement.type,
                score: achievement.progress,
                total_attempts: 1,
                correct_predictions: achievement.type === 'prediction_expert' ? predictionScore : 0,
                best_streak: 0
              })

            // Show achievement notification
            toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, {
              duration: 5000,
              style: {
                background: '#10B981',
                color: '#fff',
              }
            })
          }
        }
      }

    } catch (error) {
      console.error('Error updating achievements:', error)
    }
  }

  const recordLearningActivity = async (activityType: 'quiz_completed' | 'term_searched' | 'video_watched', points: number = 10) => {
    try {
      // Update or create game score for learning activities
      const { data: existingScores } = await supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user!.id)
        .eq('game_type', 'learning')

      if (existingScores && existingScores.length > 0) {
        const existingScore = existingScores[0]
        await supabase
          .from('game_scores')
          .update({
            score: existingScore.score + points,
            total_attempts: existingScore.total_attempts + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingScore.id)
      } else {
        await supabase
          .from('game_scores')
          .insert({
            user_id: user!.id,
            game_type: 'learning',
            score: points,
            total_attempts: 1
          })
      }

      // Refresh achievements
      await fetchPortfolioData()

    } catch (error) {
      console.error('Error recording learning activity:', error)
    }
  }

  return {
    portfolioData,
    achievements,
    loading,
    refreshData: fetchPortfolioData,
    recordLearningActivity,
    updatePrices
  }
}