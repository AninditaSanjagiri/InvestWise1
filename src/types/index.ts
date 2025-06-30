export interface User {
  id: string
  email: string
  full_name: string
  created_at: string
}

export interface Portfolio {
  id: string
  user_id: string
  balance: number
  total_value: number
  created_at: string
  updated_at: string
}

export interface Holding {
  id: string
  portfolio_id: string
  symbol: string
  company_name: string
  shares: number
  avg_price: number
  current_price: number
  current_value?: number
  gain_loss?: number
  gain_loss_percent?: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  portfolio_id: string
  symbol: string
  company_name: string
  type: 'buy' | 'sell'
  shares: number
  price: number
  total: number
  created_at: string
}

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
  example?: string
  created_at: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_type: string
  title: string
  description: string
  earned_at: string
}