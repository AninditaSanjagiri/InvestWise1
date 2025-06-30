import React, { useState } from 'react'
import { usePortfolio } from '../hooks/usePortfolio'
import { useGoals } from '../hooks/useGoals'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from '../components/LoadingSpinner'
import SkeletonLoader from '../components/SkeletonLoader'
import InvestmentCalculators from '../components/InvestmentCalculators'
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  BarChart3,
  Activity,
  Eye,
  EyeOff,
  Sparkles,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  Plus,
  Target,
  Calendar,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Save
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface FundTransfer {
  id: string
  transfer_type: string
  amount: number
  from_account: string
  to_account: string
  description: string
  created_at: string
}

interface Goal {
  id?: string
  user_id: string
  goal_description: string
  target_amount: number
  target_date: string
  target_return_percentage: number
  created_at?: string
}

const Portfolio: React.FC = () => {
  const { user } = useAuth()
  const { 
    portfolio, 
    holdings, 
    loading, 
    totalValue, 
    totalGainLoss, 
    totalGainLossPercent,
    totalInvestedInHoldings,
    userBalances,
    refreshData
  } = usePortfolio()
  const { goals, createGoal, updateGoal, deleteGoal } = useGoals()
  
  const [showBalance, setShowBalance] = useState(true)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [transferAmount, setTransferAmount] = useState('')
  const [transferType, setTransferType] = useState<'cash_to_savings' | 'savings_to_cash'>('cash_to_savings')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transfers, setTransfers] = useState<FundTransfer[]>([])
  
  // Goal form state
  const [goalForm, setGoalForm] = useState({
    goal_description: '',
    target_amount: '',
    target_date: '',
    target_return_percentage: ''
  })

  React.useEffect(() => {
    if (user) {
      fetchTransfers()
    }
  }, [user])

  const fetchTransfers = async () => {
    try {
      const { data, error } = await supabase
        .from('fund_transfers')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setTransfers(data || [])
    } catch (error) {
      console.error('Error fetching transfers:', error)
    }
  }

  const handleTransfer = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const amount = parseFloat(transferAmount)
    const fromAccount = transferType === 'cash_to_savings' ? 'cash' : 'savings'
    const toAccount = transferType === 'cash_to_savings' ? 'savings' : 'cash'
    const availableBalance = transferType === 'cash_to_savings' ? userBalances.cash_balance : userBalances.savings_balance

    if (amount > availableBalance) {
      toast.error('Insufficient balance')
      return
    }

    setIsProcessing(true)

    try {
      const newCashBalance = transferType === 'cash_to_savings' 
        ? userBalances.cash_balance - amount 
        : userBalances.cash_balance + amount
      const newSavingsBalance = transferType === 'cash_to_savings' 
        ? userBalances.savings_balance + amount 
        : userBalances.savings_balance - amount

      const { error: updateError } = await supabase
        .from('users')
        .update({
          cash_balance: newCashBalance,
          savings_balance: newSavingsBalance
        })
        .eq('id', user!.id)

      if (updateError) throw updateError

      const { error: transferError } = await supabase
        .from('fund_transfers')
        .insert({
          user_id: user!.id,
          transfer_type: transferType,
          amount,
          from_account: fromAccount,
          to_account: toAccount,
          description: `Transfer from ${fromAccount} to ${toAccount}`
        })

      if (transferError) throw transferError

      toast.success(`Successfully transferred $${amount.toLocaleString()} to ${toAccount}`)
      setShowTransferModal(false)
      setTransferAmount('')
      refreshData()
      fetchTransfers()

    } catch (error) {
      console.error('Error processing transfer:', error)
      toast.error('Failed to process transfer')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!goalForm.goal_description || !goalForm.target_amount || !goalForm.target_date) {
      toast.error('Please fill in all required fields')
      return
    }

    if (new Date(goalForm.target_date) <= new Date()) {
      toast.error('Target date must be in the future')
      return
    }

    const goalData = {
      goal_description: goalForm.goal_description,
      target_amount: parseFloat(goalForm.target_amount),
      target_date: goalForm.target_date,
      target_return_percentage: parseFloat(goalForm.target_return_percentage) || 10
    }

    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id!, goalData)
        setEditingGoal(null)
      } else {
        await createGoal(goalData)
        setShowGoalForm(false)
      }
      
      setGoalForm({
        goal_description: '',
        target_amount: '',
        target_date: '',
        target_return_percentage: ''
      })
    } catch (error) {
      // Error handling is done in the hook
    }
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalForm({
      goal_description: goal.goal_description,
      target_amount: goal.target_amount.toString(),
      target_date: goal.target_date,
      target_return_percentage: goal.target_return_percentage.toString()
    })
    setShowGoalForm(true)
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goalId)
    }
  }

  const calculateProgress = (goal: Goal) => {
    const timeElapsed = (new Date().getTime() - new Date(goal.created_at!).getTime()) / (1000 * 60 * 60 * 24 * 365)
    const totalTime = (new Date(goal.target_date).getTime() - new Date(goal.created_at!).getTime()) / (1000 * 60 * 60 * 24 * 365)
    return Math.min((timeElapsed / totalTime) * 100, 100)
  }

  const getTimeRemaining = (targetDate: string) => {
    const now = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day'
    if (diffDays < 30) return `${diffDays} days`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months`
    return `${Math.ceil(diffDays / 365)} years`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner size="lg" text="Loading your portfolio..." />
        </div>
        <SkeletonLoader type="card" count={4} />
        <SkeletonLoader type="table" count={5} />
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Enhanced Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Portfolio & Financial Hub
          </h1>
          <p className="text-xl text-gray-600">Complete view of your investments, savings, and financial goals</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Real-time</span>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
      </motion.div>

      {/* Enhanced Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Portfolio Value',
            value: totalValue,
            icon: PieChart,
            color: 'blue',
            showToggle: true,
            subtitle: 'All assets combined',
            gradient: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Available Cash',
            value: userBalances.cash_balance,
            icon: DollarSign,
            color: 'green',
            subtitle: 'Ready for trading',
            gradient: 'from-green-500 to-emerald-500'
          },
          {
            title: 'Savings Account',
            value: userBalances.savings_balance,
            icon: PiggyBank,
            color: 'purple',
            subtitle: 'Secure savings',
            gradient: 'from-purple-500 to-violet-500'
          },
          {
            title: 'Total Gain/Loss',
            value: totalGainLoss,
            icon: totalGainLoss >= 0 ? TrendingUp : TrendingDown,
            color: totalGainLoss >= 0 ? 'green' : 'red',
            percentage: totalGainLossPercent,
            subtitle: `From $10,000 initial`,
            gradient: totalGainLoss >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <div className="flex items-center space-x-2">
                      <p className={`text-3xl font-bold ${
                        stat.title === 'Total Gain/Loss' 
                          ? totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          : 'text-gray-900'
                      }`}>
                        {stat.title === 'Total Gain/Loss' 
                          ? `${totalGainLoss >= 0 ? '+' : ''}$${Math.abs(stat.value).toLocaleString()}`
                          : showBalance 
                            ? `$${stat.value.toLocaleString()}`
                            : '••••••'
                        }
                      </p>
                      {stat.showToggle && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowBalance(!showBalance)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </motion.button>
                      )}
                    </div>
                    {stat.percentage !== undefined && (
                      <p className={`text-sm font-medium ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalGainLoss >= 0 ? '+' : ''}{showBalance ? stat.percentage.toFixed(2) : '••'}%
                      </p>
                    )}
                    {stat.subtitle && (
                      <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-lg`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Holdings and Bank Account */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Holdings Table */}
        <motion.div
          variants={itemVariants}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Holdings</h2>
                <p className="text-sm text-gray-600">Real-time portfolio positions</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live prices</span>
              </div>
            </div>
            {holdings.length === 0 ? (
              <div className="text-center py-12">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No holdings yet</p>
                <p className="text-gray-400">Start trading to build your portfolio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <motion.div
                    key={holding.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{holding.symbol}</span>
                        <span className="text-sm text-gray-500">{holding.shares} shares</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{holding.company_name}</p>
                      <p className="text-xs text-gray-500">
                        Avg: ${holding.avg_price.toFixed(2)} | Current: ${holding.current_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${holding.current_value.toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1">
                        <p className={`text-sm font-medium ${holding.gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.gain_loss >= 0 ? '+' : ''}${Math.abs(holding.gain_loss).toFixed(2)}
                        </p>
                        <p className={`text-xs ${holding.gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({holding.gain_loss >= 0 ? '+' : ''}{holding.gain_loss_percent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Bank Account Section */}
        <motion.div
          variants={itemVariants}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bank Account</h2>
                <p className="text-sm text-gray-600">Manage your funds</p>
              </div>
              <Banknote className="h-6 w-6 text-green-600" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setTransferType('cash_to_savings')
                  setShowTransferModal(true)
                }}
                className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all"
              >
                <ArrowUpRight className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900">Transfer to Savings</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setTransferType('savings_to_cash')
                  setShowTransferModal(true)
                }}
                className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:from-green-100 hover:to-blue-100 transition-all"
              >
                <ArrowDownLeft className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-900">Withdraw from Savings</span>
              </motion.button>
            </div>

            {/* Recent Transfers */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Transfers</h3>
              {transfers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No transfers yet</p>
              ) : (
                <div className="space-y-2">
                  {transfers.map((transfer) => (
                    <div key={transfer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${
                          transfer.transfer_type === 'cash_to_savings' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {transfer.transfer_type === 'cash_to_savings' ? (
                            <ArrowUpRight className="h-3 w-3 text-blue-600" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            ${transfer.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transfer.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goals and Investment Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Goals */}
        <motion.div
          variants={itemVariants}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Financial Goals</h2>
                <p className="text-sm text-gray-600">Track your investment objectives</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGoalForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add Goal</span>
              </motion.button>
            </div>

            {goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No goals set yet</p>
                <p className="text-sm text-gray-400">Create your first financial goal</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {goals.map((goal, index) => {
                  const progress = calculateProgress(goal)
                  const timeRemaining = getTimeRemaining(goal.target_date)
                  const isOverdue = new Date(goal.target_date) < new Date()
                  
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/50 backdrop-blur-sm rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{goal.goal_description}</h3>
                          <p className="text-sm text-gray-600">${goal.target_amount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditGoal(goal)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id!)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progress</span>
                          <span>{progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className={`${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                            {timeRemaining}
                          </span>
                          <span className="text-purple-600">{goal.target_return_percentage}% return</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Investment Calculators */}
        <motion.div
          variants={itemVariants}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative">
            <InvestmentCalculators />
          </div>
        </motion.div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {transferType === 'cash_to_savings' ? 'Transfer to Savings' : 'Withdraw from Savings'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: ${(transferType === 'cash_to_savings' ? userBalances.cash_balance : userBalances.savings_balance).toLocaleString()}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? <LoadingSpinner size="sm" /> : 'Transfer'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h3>
            
            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Description
                </label>
                <input
                  type="text"
                  required
                  value={goalForm.goal_description}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, goal_description: e.target.value }))}
                  placeholder="e.g., Retirement fund, House down payment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={goalForm.target_amount}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, target_amount: e.target.value }))}
                    placeholder="50000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Return (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={goalForm.target_return_percentage}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, target_return_percentage: e.target.value }))}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  value={goalForm.target_date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setGoalForm(prev => ({ ...prev, target_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowGoalForm(false)
                    setEditingGoal(null)
                    setGoalForm({
                      goal_description: '',
                      target_amount: '',
                      target_date: '',
                      target_return_percentage: ''
                    })
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingGoal ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

export default Portfolio