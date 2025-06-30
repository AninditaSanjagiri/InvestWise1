import { RiskQuestion } from '../types/onboarding'

export const riskQuestions: RiskQuestion[] = [
  {
    id: 'investment_goal',
    question: 'What is your primary goal for investing?',
    options: [
      { text: 'Preserving my money with minimal risk', score: 1 },
      { text: 'Saving for a specific purchase (house, car, etc.)', score: 2 },
      { text: 'Long-term growth for retirement', score: 3 },
      { text: 'Generating regular income', score: 2 },
      { text: 'Maximizing returns regardless of risk', score: 4 }
    ]
  },
  {
    id: 'risk_comfort',
    question: 'How comfortable are you with the idea of your investment value decreasing significantly (e.g., 20%) in a single year?',
    options: [
      { text: 'Very uncomfortable - I would lose sleep', score: 1 },
      { text: 'Slightly uncomfortable but manageable', score: 2 },
      { text: 'Neutral - it\'s part of investing', score: 3 },
      { text: 'Comfortable - I understand market volatility', score: 4 },
      { text: 'Very comfortable - I see it as a buying opportunity', score: 5 }
    ]
  },
  {
    id: 'time_horizon',
    question: 'What is your investment time horizon?',
    options: [
      { text: 'Less than 1 year', score: 1 },
      { text: '1-3 years', score: 2 },
      { text: '3-5 years', score: 3 },
      { text: '5-10 years', score: 4 },
      { text: '10+ years', score: 5 }
    ]
  },
  {
    id: 'income_stability',
    question: 'How stable is your current income?',
    options: [
      { text: 'Very unstable - irregular income', score: 1 },
      { text: 'Somewhat unstable - seasonal work', score: 2 },
      { text: 'Moderately stable - steady job with some uncertainty', score: 3 },
      { text: 'Very stable - secure employment', score: 4 },
      { text: 'Multiple income sources', score: 5 }
    ]
  },
  {
    id: 'emergency_fund',
    question: 'Do you have an emergency fund (3-6 months of living expenses) saved?',
    options: [
      { text: 'No emergency fund', score: 1 },
      { text: 'Less than 1 month saved', score: 2 },
      { text: '1-3 months saved', score: 3 },
      { text: '3-6 months saved', score: 4 },
      { text: 'More than 6 months saved', score: 5 }
    ]
  },
  {
    id: 'investment_experience',
    question: 'What is your experience with investing?',
    options: [
      { text: 'Complete beginner - never invested before', score: 1 },
      { text: 'Some knowledge but no practical experience', score: 2 },
      { text: 'Limited experience with basic investments', score: 3 },
      { text: 'Moderate experience with various investments', score: 4 },
      { text: 'Experienced investor', score: 5 }
    ]
  },
  {
    id: 'market_reaction',
    question: 'If your investment portfolio lost 15% in a month, what would you most likely do?',
    options: [
      { text: 'Sell everything immediately to prevent further losses', score: 1 },
      { text: 'Sell some investments to reduce risk', score: 2 },
      { text: 'Hold and wait for recovery', score: 3 },
      { text: 'Buy more while prices are lower', score: 4 },
      { text: 'Analyze the situation and adjust strategy accordingly', score: 5 }
    ]
  }
]

export const calculateRiskProfile = (totalScore: number): 'conservative' | 'moderate' | 'aggressive' => {
  // Fixed scoring logic based on total possible scores
  // Min score: 7 (all 1s), Max score: 35 (all 5s except first question which max is 4)
  // Conservative: 7-16, Moderate: 17-26, Aggressive: 27-35
  if (totalScore <= 16) return 'conservative'
  if (totalScore <= 26) return 'moderate'
  return 'aggressive'
}

export const getRiskProfileDescription = (profile: 'conservative' | 'moderate' | 'aggressive') => {
  switch (profile) {
    case 'conservative':
      return {
        title: 'Conservative Investor',
        description: 'You prefer stability and capital preservation over high returns. You\'re comfortable with lower-risk investments.',
        targetReturn: '5-8%',
        characteristics: [
          'Low risk tolerance',
          'Prefers stable, predictable returns',
          'Values capital preservation',
          'Suitable for short-term goals'
        ]
      }
    case 'moderate':
      return {
        title: 'Moderate Investor',
        description: 'You seek a balance between growth and stability. You can tolerate some volatility for potentially higher returns.',
        targetReturn: '8-12%',
        characteristics: [
          'Balanced risk tolerance',
          'Seeks growth with some stability',
          'Can handle moderate volatility',
          'Good for medium-term goals'
        ]
      }
    case 'aggressive':
      return {
        title: 'Aggressive Investor',
        description: 'You\'re willing to accept high volatility and risk for the potential of higher returns over the long term.',
        targetReturn: '12-18%',
        characteristics: [
          'High risk tolerance',
          'Seeks maximum growth potential',
          'Comfortable with high volatility',
          'Ideal for long-term goals'
        ]
      }
  }
}