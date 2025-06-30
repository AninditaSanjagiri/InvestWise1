/*
  # Fund Management System Enhancement

  1. New Tables
    - `fund_transfers` - Track all fund transfers between accounts
    - `game_scores` - Track quiz and game performance
  
  2. User Table Updates
    - Add cash_balance and savings_balance columns
  
  3. Security
    - Enable RLS on all new tables
    - Add policies for user access control
*/

-- Add balance columns to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'cash_balance'
  ) THEN
    ALTER TABLE users ADD COLUMN cash_balance numeric(15, 2) DEFAULT 10000.00;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'savings_balance'
  ) THEN
    ALTER TABLE users ADD COLUMN savings_balance numeric(15, 2) DEFAULT 0.00;
  END IF;
END $$;

-- Create fund_transfers table
CREATE TABLE IF NOT EXISTS fund_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  transfer_type varchar(20) NOT NULL,
  amount numeric(15, 2) NOT NULL,
  from_account varchar(20) NOT NULL,
  to_account varchar(20) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create game_scores table
CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type varchar(50) NOT NULL,
  score integer DEFAULT 0,
  total_attempts integer DEFAULT 0,
  correct_predictions integer DEFAULT 0,
  best_streak integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fund_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fund_transfers
CREATE POLICY "Users can manage their own fund transfers"
  ON fund_transfers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for game_scores
CREATE POLICY "Users can manage their own game scores"
  ON game_scores
  FOR ALL
  TO public
  USING (auth.uid() = user_id)
  WITH CHECK (null);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fund_transfers_user_id ON fund_transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_fund_transfers_type ON fund_transfers(transfer_type);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_game_type ON game_scores(game_type);