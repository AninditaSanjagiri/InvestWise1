export interface RiskAssessmentAnswer {
  questionId: string
  answer: string
  score: number
}

export interface RiskAssessmentData {
  answers: RiskAssessmentAnswer[]
  totalScore: number
  riskProfile: 'conservative' | 'moderate' | 'aggressive'
}

export interface Goal {
  id?: string
  user_id: string
  goal_description: string
  target_amount: number
  target_date: string
  target_return_percentage: number
  created_at?: string
  updated_at?: string
}

export interface RiskQuestion {
  id: string
  question: string
  options: {
    text: string
    score: number
  }[]
}

export interface OnboardingState {
  currentStep: 'risk-assessment' | 'goal-setting' | 'completed'
  riskProfile?: 'conservative' | 'moderate' | 'aggressive'
  isCompleted: boolean
}