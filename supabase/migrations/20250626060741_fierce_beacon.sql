/*
  # Enhanced Portfolio & Investment Management Schema

  1. New Tables
    - `investment_options` - Available investment types with risk categories
    - `news_articles` - Cached financial news articles
    - `educational_content` - Internal educational articles
    - `user_watchlist` - User's watched investments
  
  2. Security
    - Enable RLS on all new tables
    - Add policies for appropriate access control
  
  3. Enhancements
    - Add indexes for performance
    - Add constraints for data integrity
*/

-- Create ENUM types for better data consistency
CREATE TYPE investment_type AS ENUM ('Stock', 'Bond', 'Mutual Fund', 'ETF', 'SIP', 'Gold', 'Silver', 'Fixed Deposit');
CREATE TYPE risk_category AS ENUM ('Conservative', 'Moderate', 'Aggressive');
CREATE TYPE news_category AS ENUM ('market', 'economy', 'company', 'crypto', 'commodities');

-- Investment Options Table
CREATE TABLE IF NOT EXISTS investment_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  symbol text,
  type investment_type NOT NULL,
  risk_category risk_category NOT NULL,
  description text,
  sector text,
  current_price numeric(15, 4) DEFAULT 0,
  price_change numeric(15, 4) DEFAULT 0,
  price_change_percent numeric(5, 2) DEFAULT 0,
  market_cap text,
  pe_ratio numeric(8, 2),
  volume bigint DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- News Articles Table (for caching)
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  image_url text,
  snippet text,
  source text NOT NULL,
  published_at timestamptz NOT NULL,
  category news_category DEFAULT 'market',
  created_at timestamptz DEFAULT now()
);

-- Educational Content Table
CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text DEFAULT 'InvestWise Team',
  published_at timestamptz DEFAULT now(),
  topic text DEFAULT 'basics',
  image_url text,
  read_time_minutes integer DEFAULT 5,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User Watchlist Table
CREATE TABLE IF NOT EXISTS user_watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_option_id uuid REFERENCES investment_options(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, investment_option_id)
);

-- Enable RLS
ALTER TABLE investment_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investment_options (public read)
CREATE POLICY "Anyone can read investment options"
  ON investment_options
  FOR SELECT
  TO public
  USING (is_active = true);

-- RLS Policies for news_articles (public read)
CREATE POLICY "Anyone can read news articles"
  ON news_articles
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for educational_content (public read)
CREATE POLICY "Anyone can read educational content"
  ON educational_content
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for user_watchlist
CREATE POLICY "Users can manage their own watchlist"
  ON user_watchlist
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_investment_options_type ON investment_options(type);
CREATE INDEX IF NOT EXISTS idx_investment_options_risk_category ON investment_options(risk_category);
CREATE INDEX IF NOT EXISTS idx_investment_options_symbol ON investment_options(symbol);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_topic ON educational_content(topic);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_user_id ON user_watchlist(user_id);

-- Insert sample investment options
INSERT INTO investment_options (name, symbol, type, risk_category, description, sector, current_price, price_change, price_change_percent, market_cap, pe_ratio, volume) VALUES
-- Stocks
('Apple Inc.', 'AAPL', 'Stock', 'Moderate', 'Technology giant known for iPhone, iPad, and Mac products', 'Technology', 182.52, 2.45, 1.36, '2.85T', 28.5, 45672000),
('Microsoft Corporation', 'MSFT', 'Stock', 'Moderate', 'Leading software and cloud services company', 'Technology', 378.91, 5.67, 1.52, '2.81T', 32.1, 23456000),
('Tesla Inc.', 'TSLA', 'Stock', 'Aggressive', 'Electric vehicle and clean energy company', 'Automotive', 251.34, -8.92, -3.43, '800B', 45.2, 67834000),
('Johnson & Johnson', 'JNJ', 'Stock', 'Conservative', 'Healthcare and pharmaceutical company', 'Healthcare', 162.45, 0.87, 0.54, '427B', 15.8, 6543000),
('Coca-Cola Company', 'KO', 'Stock', 'Conservative', 'Global beverage company', 'Consumer Goods', 58.92, 0.23, 0.39, '254B', 24.1, 12345000),

-- ETFs
('SPDR S&P 500 ETF', 'SPY', 'ETF', 'Moderate', 'Tracks the S&P 500 index', 'Index Fund', 445.67, 3.21, 0.73, '410B', NULL, 89234000),
('Vanguard Total Stock Market ETF', 'VTI', 'ETF', 'Moderate', 'Broad US stock market exposure', 'Index Fund', 234.89, 1.87, 0.80, '320B', NULL, 45123000),
('iShares Core U.S. Aggregate Bond ETF', 'AGG', 'ETF', 'Conservative', 'US investment-grade bond exposure', 'Bonds', 102.34, -0.12, -0.12, '95B', NULL, 8765000),

-- Mutual Funds
('Vanguard 500 Index Fund', 'VFIAX', 'Mutual Fund', 'Moderate', 'Low-cost S&P 500 index fund', 'Index Fund', 445.23, 3.18, 0.72, NULL, NULL, NULL),
('Fidelity Contrafund', 'FCNTX', 'Mutual Fund', 'Aggressive', 'Large-cap growth fund', 'Growth', 156.78, 2.34, 1.52, NULL, NULL, NULL),

-- Bonds
('US Treasury 10-Year Bond', 'TNX', 'Bond', 'Conservative', '10-year US government bond', 'Government', 4.25, 0.05, 1.19, NULL, NULL, NULL),
('Corporate Bond Index', 'LQD', 'Bond', 'Conservative', 'Investment-grade corporate bonds', 'Corporate', 108.45, -0.23, -0.21, NULL, NULL, NULL),

-- Commodities
('Gold Spot Price', 'GOLD', 'Gold', 'Moderate', 'Physical gold commodity', 'Commodities', 2034.50, 12.30, 0.61, NULL, NULL, NULL),
('Silver Spot Price', 'SILVER', 'Silver', 'Aggressive', 'Physical silver commodity', 'Commodities', 24.67, 0.45, 1.86, NULL, NULL, NULL),

-- Fixed Deposits
('1-Year Fixed Deposit', 'FD1Y', 'Fixed Deposit', 'Conservative', 'Bank fixed deposit for 1 year', 'Banking', 6.5, 0, 0, NULL, NULL, NULL),
('3-Year Fixed Deposit', 'FD3Y', 'Fixed Deposit', 'Conservative', 'Bank fixed deposit for 3 years', 'Banking', 7.2, 0, 0, NULL, NULL, NULL);

-- Insert sample educational content
INSERT INTO educational_content (title, content, author, topic, image_url, read_time_minutes, is_featured) VALUES
('Understanding Risk vs Return', 'Risk and return are fundamental concepts in investing. Generally, higher potential returns come with higher risk. Conservative investments like bonds offer lower but more stable returns, while aggressive investments like growth stocks offer higher potential returns but with greater volatility.', 'InvestWise Team', 'basics', 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400', 5, true),
('The Power of Compound Interest', 'Compound interest is often called the eighth wonder of the world. It''s the interest earned on both the initial principal and previously earned interest. Starting early and staying consistent can dramatically impact your long-term wealth building.', 'InvestWise Team', 'basics', 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400', 7, true),
('Diversification: Your Investment Safety Net', 'Don''t put all your eggs in one basket. Diversification means spreading your investments across different asset classes, sectors, and geographic regions to reduce risk while maintaining growth potential.', 'InvestWise Team', 'risk', 'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=400', 6, false),
('SIP: The Smart Way to Invest', 'Systematic Investment Plans (SIPs) allow you to invest a fixed amount regularly, regardless of market conditions. This strategy helps average out market volatility and builds discipline in your investment journey.', 'InvestWise Team', 'strategy', 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=400', 8, false);

-- Insert sample news articles
INSERT INTO news_articles (title, url, snippet, source, published_at, category) VALUES
('Federal Reserve Maintains Interest Rates', 'https://example.com/fed-rates', 'The Federal Reserve decided to keep interest rates unchanged in their latest meeting, citing economic stability concerns.', 'Financial Times', now() - interval '2 hours', 'economy'),
('Tech Stocks Rally on AI Optimism', 'https://example.com/tech-rally', 'Major technology stocks surged today as investors showed renewed optimism about artificial intelligence developments.', 'MarketWatch', now() - interval '4 hours', 'market'),
('Gold Prices Hit New Monthly High', 'https://example.com/gold-high', 'Gold prices reached their highest level this month as investors sought safe-haven assets amid market uncertainty.', 'Reuters', now() - interval '6 hours', 'commodities'),
('Apple Reports Strong Quarterly Earnings', 'https://example.com/apple-earnings', 'Apple exceeded analyst expectations with strong iPhone sales and services revenue in their latest quarterly report.', 'CNBC', now() - interval '1 day', 'company');