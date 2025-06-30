/*
  # Create video_links table for educational videos

  1. New Tables
    - `video_links`
      - `id` (uuid, primary key)
      - `title` (text, required) - Video title
      - `youtube_id` (text, required, unique) - YouTube video ID
      - `description` (text, optional) - Video description
      - `category` (text, optional) - Video category (e.g., "Beginner Basics", "Investment Strategy")
      - `thumbnail_url` (text, optional) - Video thumbnail URL
      - `duration_seconds` (integer, optional) - Video duration in seconds
      - `views_count` (integer, default 0) - Number of views
      - `likes_count` (integer, default 0) - Number of likes
      - `channel_name` (text, optional) - YouTube channel name
      - `difficulty_level` (text, optional) - Difficulty level (Beginner, Intermediate, Advanced)
      - `created_at` (timestamp, default now())

  2. Security
    - Enable RLS on `video_links` table
    - Add policy for public read access to all video links
    - Add policy for authenticated users to manage video links (for admin purposes)

  3. Sample Data
    - Insert sample educational videos covering various investment topics
*/

-- Create the video_links table
CREATE TABLE IF NOT EXISTS public.video_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  title text NOT NULL,
  youtube_id text NOT NULL UNIQUE,
  description text,
  category text,
  thumbnail_url text,
  duration_seconds integer DEFAULT 0,
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  channel_name text,
  difficulty_level text DEFAULT 'Beginner'
);

-- Enable Row Level Security
ALTER TABLE public.video_links ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read video links"
  ON public.video_links
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to manage video links (admin functionality)
CREATE POLICY "Authenticated users can manage video links"
  ON public.video_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_video_links_category ON public.video_links(category);
CREATE INDEX IF NOT EXISTS idx_video_links_difficulty ON public.video_links(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_video_links_created_at ON public.video_links(created_at DESC);

-- Insert sample educational videos
INSERT INTO public.video_links (title, youtube_id, description, category, duration_seconds, views_count, likes_count, channel_name, difficulty_level)
VALUES
  (
    'Stock Market Basics for Beginners',
    'p7HKvqRI_Bo',
    'Learn the fundamentals of the stock market, including how it works, key terminology, and basic investment principles.',
    'Beginner Basics',
    1200,
    2500000,
    85000,
    'Ben Felix',
    'Beginner'
  ),
  (
    'Understanding ETFs vs Mutual Funds',
    'Ary_gq2zCZw',
    'A comprehensive comparison between Exchange Traded Funds (ETFs) and Mutual Funds, helping you choose the right investment vehicle.',
    'Investment Types',
    900,
    1800000,
    62000,
    'The Plain Bagel',
    'Intermediate'
  ),
  (
    'Dollar Cost Averaging Explained',
    'X1qzuPRvsM0',
    'Learn about dollar cost averaging strategy, its benefits, drawbacks, and when to use this investment approach.',
    'Investment Strategy',
    720,
    950000,
    34000,
    'Two Cents',
    'Beginner'
  ),
  (
    'How to Read Financial Statements',
    'WEDIj9JBTC8',
    'Master the art of reading and analyzing financial statements including balance sheets, income statements, and cash flow statements.',
    'Financial Analysis',
    1800,
    1200000,
    45000,
    'Accounting Stuff',
    'Advanced'
  ),
  (
    'Dividend Investing for Beginners',
    '6d0xJAb0-wY',
    'Everything you need to know about dividend investing, including how to find dividend stocks and build a dividend portfolio.',
    'Investment Strategy',
    1080,
    800000,
    28000,
    'Dividend Bull',
    'Intermediate'
  ),
  (
    'Understanding Market Volatility',
    'unFn-ddtqiM',
    'Learn what causes market volatility, how to measure it, and strategies for dealing with volatile markets.',
    'Investment Strategy',
    960,
    650000,
    22000,
    'Patrick Boyle',
    'Intermediate'
  ),
  (
    'Bonds vs Stocks: Complete Guide',
    'IuyejHOGpKA',
    'A detailed comparison of bonds and stocks, including risk profiles, returns, and how to balance them in your portfolio.',
    'Investment Types',
    1440,
    1100000,
    38000,
    'The Swedish Investor',
    'Beginner'
  ),
  (
    'Technical Analysis Fundamentals',
    '08c4YvEJ1lo',
    'Introduction to technical analysis including chart patterns, indicators, and how to use them for investment decisions.',
    'Financial Analysis',
    2100,
    750000,
    26000,
    'Rayner Teo',
    'Advanced'
  ),
  (
    'Building Your First Investment Portfolio',
    'fvGLnthJDsg',
    'Step-by-step guide to creating your first investment portfolio, including asset allocation and diversification strategies.',
    'Beginner Basics',
    1560,
    1400000,
    52000,
    'Graham Stephan',
    'Beginner'
  ),
  (
    'Understanding Risk and Return',
    'uaIRtBbhYc0',
    'Learn about the relationship between risk and return in investing, and how to assess your risk tolerance.',
    'Beginner Basics',
    840,
    920000,
    31000,
    'Zach Star',
    'Beginner'
  ),
  (
    'Real Estate vs Stock Market',
    'q9Golcxjpi8',
    'Compare real estate investing with stock market investing, including pros, cons, and which might be better for you.',
    'Investment Types',
    1320,
    680000,
    24000,
    'Meet Kevin',
    'Intermediate'
  ),
  (
    'Index Fund Investing Strategy',
    'fwe-PjrX23o',
    'Learn why index funds are popular among investors and how to build a simple yet effective index fund portfolio.',
    'Investment Strategy',
    1080,
    1600000,
    58000,
    'John Bogle',
    'Beginner'
  );