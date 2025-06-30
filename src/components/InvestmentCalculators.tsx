import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  DollarSign,
  Info,
  PieChart
} from 'lucide-react'

interface CalculatorResult {
  maturityAmount: number
  totalInvested: number
  totalGains: number
}

const InvestmentCalculators: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<'sip' | 'lumpsum' | 'goal' | 'compound'>('sip')

  // SIP Calculator State
  const [sipData, setSipData] = useState({
    monthlyAmount: '',
    annualReturn: '',
    tenure: ''
  })

  // Lump Sum Calculator State
  const [lumpSumData, setLumpSumData] = useState({
    initialAmount: '',
    annualReturn: '',
    tenure: ''
  })

  // Goal Calculator State
  const [goalData, setGoalData] = useState({
    targetAmount: '',
    timeHorizon: '',
    annualReturn: ''
  })

  // Compound Calculator State
  const [compoundData, setCompoundData] = useState({
    principal: '',
    annualRate: '',
    compoundingFrequency: '12',
    tenure: ''
  })

  const calculateSIP = (): CalculatorResult => {
    const P = parseFloat(sipData.monthlyAmount) || 0
    const r = (parseFloat(sipData.annualReturn) || 0) / 100 / 12
    const n = (parseFloat(sipData.tenure) || 0) * 12

    if (P === 0 || r === 0 || n === 0) {
      return { maturityAmount: 0, totalInvested: 0, totalGains: 0 }
    }

    const maturityAmount = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
    const totalInvested = P * n
    const totalGains = maturityAmount - totalInvested

    return { maturityAmount, totalInvested, totalGains }
  }

  const calculateLumpSum = (): CalculatorResult => {
    const P = parseFloat(lumpSumData.initialAmount) || 0
    const r = (parseFloat(lumpSumData.annualReturn) || 0) / 100
    const t = parseFloat(lumpSumData.tenure) || 0

    if (P === 0 || r === 0 || t === 0) {
      return { maturityAmount: 0, totalInvested: 0, totalGains: 0 }
    }

    const maturityAmount = P * Math.pow(1 + r, t)
    const totalInvested = P
    const totalGains = maturityAmount - totalInvested

    return { maturityAmount, totalInvested, totalGains }
  }

  const calculateGoalBased = () => {
    const target = parseFloat(goalData.targetAmount) || 0
    const years = parseFloat(goalData.timeHorizon) || 0
    const rate = (parseFloat(goalData.annualReturn) || 0) / 100

    if (target === 0 || years === 0 || rate === 0) {
      return { requiredSIP: 0, requiredLumpSum: 0 }
    }

    // Required SIP calculation
    const monthlyRate = rate / 12
    const months = years * 12
    const requiredSIP = target * monthlyRate / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))

    // Required Lump Sum calculation
    const requiredLumpSum = target / Math.pow(1 + rate, years)

    return { requiredSIP, requiredLumpSum }
  }

  const calculateCompound = (): CalculatorResult => {
    const P = parseFloat(compoundData.principal) || 0
    const r = (parseFloat(compoundData.annualRate) || 0) / 100
    const n = parseFloat(compoundData.compoundingFrequency) || 1
    const t = parseFloat(compoundData.tenure) || 0

    if (P === 0 || r === 0 || t === 0) {
      return { maturityAmount: 0, totalInvested: 0, totalGains: 0 }
    }

    const maturityAmount = P * Math.pow(1 + r / n, n * t)
    const totalInvested = P
    const totalGains = maturityAmount - totalInvested

    return { maturityAmount, totalInvested, totalGains }
  }

  const calculators = [
    { key: 'sip', label: 'SIP Calculator', icon: TrendingUp },
    { key: 'lumpsum', label: 'Lump Sum', icon: DollarSign },
    { key: 'goal', label: 'Goal Based', icon: Target },
    { key: 'compound', label: 'Compound Interest', icon: PieChart }
  ]

  const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Investment Calculators</h2>
      </div>

      {/* Calculator Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {calculators.map((calc) => {
          const Icon = calc.icon
          return (
            <motion.button
              key={calc.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCalculator(calc.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeCalculator === calc.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{calc.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* SIP Calculator */}
      {activeCalculator === 'sip' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Monthly Investment (₹)</span>
                  <Tooltip text="Amount you plan to invest every month">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={sipData.monthlyAmount}
                onChange={(e) => setSipData(prev => ({ ...prev, monthlyAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Expected Annual Return (%)</span>
                  <Tooltip text="Expected yearly return rate from your investment">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={sipData.annualReturn}
                onChange={(e) => setSipData(prev => ({ ...prev, annualReturn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Investment Tenure (Years)</span>
                  <Tooltip text="How long you plan to continue investing">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={sipData.tenure}
                onChange={(e) => setSipData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
          </div>

          {sipData.monthlyAmount && sipData.annualReturn && sipData.tenure && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SIP Calculation Results</h3>
              {(() => {
                const result = calculateSIP()
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Invested</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{result.totalInvested.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Gains</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{result.totalGains.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Maturity Amount</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{result.maturityAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Lump Sum Calculator */}
      {activeCalculator === 'lumpsum' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Initial Investment (₹)</span>
                  <Tooltip text="One-time investment amount">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={lumpSumData.initialAmount}
                onChange={(e) => setLumpSumData(prev => ({ ...prev, initialAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Expected Annual Return (%)</span>
                  <Tooltip text="Expected yearly return rate">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={lumpSumData.annualReturn}
                onChange={(e) => setLumpSumData(prev => ({ ...prev, annualReturn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Investment Tenure (Years)</span>
                  <Tooltip text="Investment duration">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={lumpSumData.tenure}
                onChange={(e) => setLumpSumData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
          </div>

          {lumpSumData.initialAmount && lumpSumData.annualReturn && lumpSumData.tenure && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lump Sum Results</h3>
              {(() => {
                const result = calculateLumpSum()
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Initial Investment</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{result.totalInvested.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Profit</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{result.totalGains.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Maturity Amount</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{result.maturityAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Goal-Based Calculator */}
      {activeCalculator === 'goal' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Target Amount (₹)</span>
                  <Tooltip text="Amount you want to achieve">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={goalData.targetAmount}
                onChange={(e) => setGoalData(prev => ({ ...prev, targetAmount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Time Horizon (Years)</span>
                  <Tooltip text="Time available to reach your goal">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={goalData.timeHorizon}
                onChange={(e) => setGoalData(prev => ({ ...prev, timeHorizon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Expected Return (%)</span>
                  <Tooltip text="Expected annual return rate">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={goalData.annualReturn}
                onChange={(e) => setGoalData(prev => ({ ...prev, annualReturn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12"
              />
            </div>
          </div>

          {goalData.targetAmount && goalData.timeHorizon && goalData.annualReturn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Planning Results</h3>
              {(() => {
                const result = calculateGoalBased()
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Required Monthly SIP</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{result.requiredSIP.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">per month for {goalData.timeHorizon} years</p>
                    </div>
                    <div className="text-center bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Required Lump Sum</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{result.requiredLumpSum.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">one-time investment</p>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Compound Interest Calculator */}
      {activeCalculator === 'compound' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Principal Amount (₹)</span>
                  <Tooltip text="Initial investment amount">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={compoundData.principal}
                onChange={(e) => setCompoundData(prev => ({ ...prev, principal: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Annual Interest Rate (%)</span>
                  <Tooltip text="Yearly interest rate">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={compoundData.annualRate}
                onChange={(e) => setCompoundData(prev => ({ ...prev, annualRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Compounding Frequency</span>
                  <Tooltip text="How often interest is compounded">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <select
                value={compoundData.compoundingFrequency}
                onChange={(e) => setCompoundData(prev => ({ ...prev, compoundingFrequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">Annually</option>
                <option value="2">Semi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-1">
                  <span>Investment Tenure (Years)</span>
                  <Tooltip text="Investment duration">
                    <Info className="h-3 w-3 text-gray-400" />
                  </Tooltip>
                </div>
              </label>
              <input
                type="number"
                value={compoundData.tenure}
                onChange={(e) => setCompoundData(prev => ({ ...prev, tenure: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
          </div>

          {compoundData.principal && compoundData.annualRate && compoundData.tenure && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compound Interest Results</h3>
              {(() => {
                const result = calculateCompound()
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Principal Amount</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{result.totalInvested.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Interest Earned</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{result.totalGains.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Future Value</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{result.maturityAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default InvestmentCalculators