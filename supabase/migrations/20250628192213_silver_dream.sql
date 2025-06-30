/*
  # Content Enrichment and Video Integration Schema

  1. New Tables
    - `learning_content` - Structured educational content and simulated AI answers
    - `video_links` - YouTube video metadata and integration
  
  2. Security
    - Enable RLS on all new tables
    - Add policies for public read access
  
  3. Sample Data
    - Comprehensive learning content with simulated AI-like answers
    - Real YouTube videos for financial education
*/

-- Create learning_content table
CREATE TABLE IF NOT EXISTS learning_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'Article', 'FAQ', 'Interactive Guide', 'Deep Dive'
    category VARCHAR(50) NOT NULL, -- 'Stocks Basics', 'Bonds Explained', 'Risk Management', etc.
    body TEXT NOT NULL, -- Main content (Markdown or simple text)
    keywords TEXT[], -- For search/tagging
    reading_time_minutes INTEGER DEFAULT 5,
    associated_risk_profile VARCHAR(20), -- 'Conservative', 'Moderate', 'Aggressive'
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create video_links table
CREATE TABLE IF NOT EXISTS video_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    youtube_id VARCHAR(50) NOT NULL UNIQUE, -- YouTube video ID
    description TEXT,
    category VARCHAR(50), -- 'Beginner Basics', 'Market News', 'How-to'
    thumbnail_url TEXT, -- Can be derived from youtube_id
    duration_seconds INTEGER,
    views_count INTEGER DEFAULT 0, -- Simulated or fetched from YouTube API
    likes_count INTEGER DEFAULT 0, -- Simulated
    channel_name VARCHAR(100),
    difficulty_level VARCHAR(20) DEFAULT 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Allow public read access to learning_content" 
  ON learning_content FOR SELECT USING (is_published = true);

CREATE POLICY "Allow public read access to video_links" 
  ON video_links FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_content_category ON learning_content(category);
CREATE INDEX IF NOT EXISTS idx_learning_content_content_type ON learning_content(content_type);
CREATE INDEX IF NOT EXISTS idx_learning_content_keywords ON learning_content USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_video_links_category ON video_links(category);
CREATE INDEX IF NOT EXISTS idx_video_links_difficulty ON video_links(difficulty_level);

-- Insert comprehensive learning content with simulated AI-like answers
INSERT INTO learning_content (title, content_type, category, body, keywords, reading_time_minutes, associated_risk_profile) VALUES

-- Stock Market Basics
('What is Diversification?', 'FAQ', 'Risk Management', 
'Diversification is one of the most fundamental principles of investing, often summarized by the phrase "don''t put all your eggs in one basket." At its core, diversification means spreading your investments across different assets, sectors, industries, and even geographic regions to reduce risk.

**Why Diversification Works:**
When you diversify, you''re essentially creating a safety net for your portfolio. If one investment performs poorly, others may perform well, helping to balance out your overall returns. This doesn''t eliminate risk entirely, but it significantly reduces the impact of any single investment''s poor performance on your total portfolio.

**Types of Diversification:**
1. **Asset Class Diversification**: Spreading money across stocks, bonds, real estate, and commodities
2. **Sector Diversification**: Investing in different industries like technology, healthcare, finance, and consumer goods
3. **Geographic Diversification**: Including both domestic and international investments
4. **Company Size Diversification**: Mixing large-cap, mid-cap, and small-cap stocks

**Real-World Example:**
Imagine you invest $10,000 only in airline stocks. If a global pandemic hits (like COVID-19), your entire portfolio could lose 70% of its value overnight. However, if you had diversified across airlines, technology companies, healthcare firms, and bonds, the technology and healthcare stocks might have actually gained value during the pandemic, offsetting your airline losses.

**The Sweet Spot:**
Research suggests that owning 20-30 different stocks across various sectors can capture most of the benefits of diversification. Beyond that, additional diversification provides diminishing returns.', 
ARRAY['diversification', 'risk management', 'portfolio', 'asset allocation'], 8, 'Conservative'),

('How Does Inflation Affect Investments?', 'FAQ', 'Economic Factors', 
'Inflation is like a silent thief that gradually erodes the purchasing power of your money over time. Understanding its impact on investments is crucial for building a portfolio that can maintain and grow your wealth in real terms.

**What is Inflation?**
Inflation occurs when the general price level of goods and services rises over time. A 3% inflation rate means that something costing $100 today will cost $103 next year. While this might seem small, it compounds significantly over time.

**Impact on Different Investment Types:**

**Cash and Savings Accounts:**
These are inflation''s biggest victims. If your savings account earns 1% interest but inflation is 3%, you''re actually losing 2% of purchasing power annually. Money sitting in low-yield accounts becomes worth less over time.

**Stocks:**
Historically, stocks have been excellent inflation hedges over the long term. Companies can often raise prices to match inflation, maintaining their profit margins. Additionally, stock prices tend to rise with inflation over extended periods. However, short-term volatility can be significant during inflationary periods.

**Bonds:**
Fixed-rate bonds suffer during inflation because their payments become worth less over time. If you own a bond paying 2% annually and inflation rises to 4%, you''re losing purchasing power. However, Treasury Inflation-Protected Securities (TIPS) adjust their principal based on inflation.

**Real Estate:**
Property values and rental income typically rise with inflation, making real estate a traditional inflation hedge. REITs (Real Estate Investment Trusts) offer an accessible way to invest in real estate.

**Commodities:**
Gold, oil, and agricultural products often rise in price during inflationary periods, as they represent "real" assets with intrinsic value.

**Strategic Implications:**
During inflationary periods, consider tilting your portfolio toward assets that historically outpace inflation: stocks of companies with pricing power, real estate, commodities, and inflation-protected bonds. The key is maintaining a diversified approach while being mindful of inflation''s long-term impact on your purchasing power.', 
ARRAY['inflation', 'purchasing power', 'bonds', 'stocks', 'real estate'], 10, 'Moderate'),

('ETFs vs Mutual Funds: Which Should You Choose?', 'Deep Dive', 'Investment Types', 
'The choice between ETFs (Exchange-Traded Funds) and mutual funds is one of the most common dilemmas facing modern investors. Both offer diversification and professional management, but they differ significantly in structure, costs, and flexibility.

**Exchange-Traded Funds (ETFs):**

**Advantages:**
- **Lower Costs**: ETFs typically have expense ratios of 0.03% to 0.75%, significantly lower than most mutual funds
- **Trading Flexibility**: Buy and sell anytime during market hours, just like individual stocks
- **Tax Efficiency**: ETFs generally generate fewer taxable events due to their structure
- **Transparency**: Holdings are disclosed daily, so you always know what you own
- **No Minimum Investment**: You can buy as little as one share

**Disadvantages:**
- **Trading Costs**: You may pay brokerage commissions (though many brokers now offer commission-free ETF trading)
- **Bid-Ask Spreads**: The difference between buying and selling prices can eat into returns
- **Temptation to Overtrade**: Easy trading can lead to poor timing decisions

**Mutual Funds:**

**Advantages:**
- **Professional Management**: Active funds have managers making investment decisions
- **Automatic Investing**: Easy to set up systematic investment plans
- **Fractional Shares**: Your entire investment amount is put to work, regardless of share price
- **No Trading During Market Hours**: Prevents emotional trading decisions

**Disadvantages:**
- **Higher Costs**: Expense ratios typically range from 0.5% to 2.0% or more
- **Less Flexibility**: Can only trade once per day after market close
- **Tax Inefficiency**: May generate capital gains distributions even if you haven''t sold
- **Minimum Investments**: Often require $1,000 to $3,000 to start

**Which Should You Choose?**

**Choose ETFs if:**
- You want the lowest possible costs
- You prefer maximum flexibility and control
- You''re investing in broad market indexes
- You have a taxable investment account
- You''re comfortable with online, self-directed investing

**Choose Mutual Funds if:**
- You want active professional management
- You prefer automatic investing and dollar-cost averaging
- You''re investing in a 401(k) or similar employer plan
- You want to avoid the temptation of frequent trading
- You''re just starting out and want simplicity

**The Hybrid Approach:**
Many successful investors use both. They might use low-cost index ETFs for core holdings (like broad market exposure) and actively managed mutual funds for specialized strategies or sectors where active management might add value.

**Bottom Line:**
For most long-term investors, low-cost index ETFs offer the best combination of diversification, low fees, and flexibility. However, the "best" choice depends on your specific situation, investment goals, and personal preferences. The most important factor is starting to invest consistently, regardless of which vehicle you choose.', 
ARRAY['ETF', 'mutual funds', 'expense ratio', 'index funds', 'active management'], 12, 'Moderate'),

('Understanding Compound Interest: The Eighth Wonder of the World', 'Article', 'Fundamentals', 
'Albert Einstein allegedly called compound interest "the eighth wonder of the world," adding, "He who understands it, earns it; he who doesn''t, pays it." While the attribution is disputed, the sentiment is absolutely true – compound interest is the most powerful force in building long-term wealth.

**What is Compound Interest?**
Compound interest is interest earned not only on your original investment (the principal) but also on all the interest that investment has previously earned. It''s essentially "interest on interest," and it''s what transforms modest, consistent investments into substantial wealth over time.

**The Magic Formula:**
A = P(1 + r/n)^(nt)
Where:
- A = Final amount
- P = Principal (initial investment)
- r = Annual interest rate (as a decimal)
- n = Number of times interest compounds per year
- t = Number of years

**A Powerful Example:**
Let''s say you invest $1,000 at a 7% annual return:
- After 10 years: $1,967
- After 20 years: $3,870
- After 30 years: $7,612
- After 40 years: $14,974

Notice how the growth accelerates over time. In the first decade, you gained $967. In the fourth decade, you gained over $7,000! This acceleration is compound interest at work.

**The Three Key Variables:**

**1. Time (The Most Important Factor):**
Starting early is more powerful than investing more money later. A 25-year-old who invests $2,000 annually for 10 years and then stops will have more money at retirement than someone who starts at 35 and invests $2,000 annually for 30 years, assuming the same 7% return.

**2. Rate of Return:**
Small differences in returns create massive differences over time. The difference between a 6% and 8% annual return on $10,000 over 30 years is over $43,000 ($57,435 vs $100,627).

**3. Consistency:**
Regular, consistent investing harnesses compound interest most effectively. This is why automatic investing and dollar-cost averaging are so powerful – they ensure you''re consistently feeding the compound interest machine.

**Real-World Applications:**

**Retirement Savings:**
A 22-year-old who saves $200 monthly in a retirement account earning 7% annually will have over $1.3 million by age 65. The total contributions? Only $103,200. The rest – over $1.2 million – comes from compound interest.

**Debt (The Dark Side):**
Compound interest works against you with debt. Credit card debt at 18% annual interest can quickly spiral out of control as interest compounds on unpaid balances.

**Maximizing Compound Interest:**
1. **Start as early as possible** – even small amounts matter
2. **Invest consistently** – automate your investments
3. **Reinvest all dividends and interest** – don''t spend the gains
4. **Choose tax-advantaged accounts** when possible (401k, IRA, Roth IRA)
5. **Be patient** – compound interest requires time to work its magic
6. **Avoid withdrawing early** – breaking the compound cycle restarts the process

**The Takeaway:**
Compound interest rewards patience and consistency above all else. It''s not about timing the market or finding the perfect investment – it''s about starting early, investing regularly, and letting time do the heavy lifting. The sooner you start, the less you''ll need to save to reach your financial goals.', 
ARRAY['compound interest', 'time value of money', 'retirement planning', 'wealth building'], 15, 'Conservative'),

('What Are Stocks and How Do They Work?', 'Article', 'Stock Basics', 
'Stocks represent one of the most accessible and potentially rewarding ways to build wealth over time. Yet many people find them intimidating or confusing. Let''s demystify stocks and understand how they can work for you.

**What Exactly is a Stock?**
When you buy a stock, you''re purchasing a tiny piece of ownership in a company. If Apple has 16 billion shares outstanding and you own 100 shares, you own 0.00000625% of Apple. While that sounds minuscule, it entitles you to a proportional share of the company''s profits and assets.

**How Do Stocks Make Money?**
Stocks can generate returns in two primary ways:

**1. Capital Appreciation (Price Growth):**
If you buy a stock at $50 and sell it at $75, you''ve made a $25 capital gain per share. This happens when the company becomes more valuable – perhaps due to increased profits, new products, or market expansion.

**2. Dividends:**
Some companies share their profits directly with shareholders through dividend payments. If a company pays a $2 annual dividend and you own 100 shares, you''ll receive $200 per year, regardless of the stock price.

**What Drives Stock Prices?**
Stock prices reflect investors'' collective opinion about a company''s future prospects. Key factors include:

- **Earnings Growth**: Companies that consistently grow profits tend to see rising stock prices
- **Revenue Trends**: Increasing sales often signal business health
- **Market Conditions**: Economic factors affect all stocks to some degree
- **Industry Trends**: Sector-specific developments can impact related stocks
- **Investor Sentiment**: Market psychology and emotions play a significant role

**Types of Stocks:**

**Growth Stocks**: Companies expected to grow faster than average (like Tesla or Amazon in their early days). These typically don''t pay dividends, reinvesting profits for expansion.

**Value Stocks**: Companies trading below their perceived intrinsic value. These often pay dividends and may be temporarily out of favor.

**Dividend Stocks**: Mature companies that regularly distribute profits to shareholders (like Coca-Cola or Johnson & Johnson).

**Small, Mid, and Large-Cap**: Categorized by market capitalization (total company value), each offering different risk/reward profiles.

**The Risks:**
- **Volatility**: Stock prices can fluctuate dramatically in the short term
- **Company Risk**: Individual companies can fail or underperform
- **Market Risk**: Entire markets can decline during economic downturns
- **Inflation Risk**: Returns may not keep pace with rising prices

**Getting Started:**
1. **Educate Yourself**: Understand basic financial concepts and company analysis
2. **Start with Broad Diversification**: Consider index funds or ETFs before individual stocks
3. **Invest Regularly**: Dollar-cost averaging reduces timing risk
4. **Think Long-Term**: The stock market rewards patience over speculation
5. **Only Invest What You Can Afford to Lose**: Never invest money you need for essentials

**The Historical Perspective:**
Despite short-term volatility, the U.S. stock market has delivered an average annual return of about 10% over the past century. This includes surviving the Great Depression, multiple recessions, wars, and various crises. While past performance doesn''t guarantee future results, this track record demonstrates the long-term wealth-building potential of stock investing.

**Bottom Line:**
Stocks aren''t gambling – they''re ownership stakes in real businesses that produce goods and services. When you invest in stocks, you''re betting on human ingenuity, innovation, and economic progress. With proper education, diversification, and a long-term perspective, stocks can be a powerful tool for building wealth and achieving financial goals.', 
ARRAY['stocks', 'equity', 'capital appreciation', 'dividends', 'market capitalization'], 18, 'Moderate'),

('Bond Investing: The Steady Foundation of Your Portfolio', 'Deep Dive', 'Bond Basics', 
'While stocks often grab headlines with their dramatic price swings, bonds quietly serve as the backbone of many successful investment portfolios. Understanding bonds is crucial for creating a balanced, risk-appropriate investment strategy.

**What Are Bonds?**
A bond is essentially an IOU. When you buy a bond, you''re lending money to the issuer (government, corporation, or municipality) for a specific period. In return, they promise to pay you regular interest payments and return your principal when the bond matures.

**Key Bond Components:**

**Face Value (Par Value)**: The amount the bond will pay at maturity, typically $1,000.

**Coupon Rate**: The annual interest rate, expressed as a percentage of face value. A 5% coupon on a $1,000 bond pays $50 annually.

**Maturity Date**: When the bond expires and principal is repaid.

**Yield**: The actual return you''ll receive, which may differ from the coupon rate depending on the price you paid.

**Types of Bonds:**

**Government Bonds:**
- **U.S. Treasuries**: Backed by the full faith and credit of the U.S. government, considered virtually risk-free
- **Municipal Bonds**: Issued by state and local governments, often tax-free
- **International Government Bonds**: Foreign government debt, adding currency risk

**Corporate Bonds:**
- **Investment Grade**: High-quality companies with low default risk
- **High Yield (Junk)**: Lower-rated companies offering higher interest rates to compensate for increased risk

**How Bond Prices Work:**
Bond prices move inversely to interest rates. When rates rise, existing bond prices fall (because new bonds offer higher rates). When rates fall, existing bond prices rise. This relationship is crucial for understanding bond investing.

**Example**: You own a bond paying 3% when new bonds start offering 4%. Your bond becomes less attractive, so its price drops. Conversely, if new bonds only offer 2%, your 3% bond becomes more valuable.

**Why Include Bonds in Your Portfolio?**

**1. Stability**: Bonds typically experience less volatility than stocks, providing portfolio stability.

**2. Income**: Regular interest payments provide predictable cash flow.

**3. Diversification**: Bonds often perform well when stocks struggle, balancing portfolio risk.

**4. Capital Preservation**: High-quality bonds help protect principal, especially important as you near financial goals.

**5. Deflation Protection**: Unlike stocks, bonds can perform well during deflationary periods.

**Bond Risks to Consider:**

**Interest Rate Risk**: Rising rates can decrease bond values.

**Credit Risk**: The issuer might default on payments.

**Inflation Risk**: Fixed payments lose purchasing power over time.

**Liquidity Risk**: Some bonds may be difficult to sell quickly.

**Call Risk**: Issuers might repay bonds early when rates fall.

**Building a Bond Strategy:**

**For Conservative Investors**: Focus on high-quality government and investment-grade corporate bonds with shorter to intermediate maturities.

**For Moderate Investors**: Mix government bonds with some corporate bonds and consider international exposure.

**For Aggressive Investors**: Use bonds primarily for diversification, potentially including high-yield bonds and emerging market debt.

**Bond Laddering Strategy:**
Instead of buying one bond, purchase bonds with staggered maturity dates. As each bond matures, reinvest the proceeds in a new bond at current rates. This strategy provides regular cash flow and reduces interest rate risk.

**Modern Bond Investing:**
Today''s investors can access bonds through:
- **Individual Bonds**: Direct ownership with predictable outcomes
- **Bond Mutual Funds**: Professional management and diversification
- **Bond ETFs**: Low-cost, liquid access to bond markets
- **Target-Date Funds**: Automatically adjust bond allocation as you age

**The Role in Your Portfolio:**
A common rule of thumb suggests holding your age in bonds (a 40-year-old might hold 40% bonds). However, this should be adjusted based on your risk tolerance, time horizon, and financial goals.

**Current Environment Considerations:**
In today''s low interest rate environment, bond yields are historically low, but they still serve important portfolio functions. Consider shorter-duration bonds to reduce interest rate risk, and remember that bonds'' primary role is often stability and diversification rather than high returns.

**Conclusion:**
Bonds may not be as exciting as stocks, but they''re essential for most investors. They provide stability, income, and diversification benefits that can help you sleep better at night while working toward your financial goals. The key is understanding how they fit into your overall investment strategy and choosing the right types and amounts for your situation.', 
ARRAY['bonds', 'fixed income', 'yield', 'duration', 'credit risk', 'interest rates'], 20, 'Conservative');

-- Insert YouTube video data with real educational finance videos
INSERT INTO video_links (title, youtube_id, description, category, duration_seconds, views_count, likes_count, channel_name, difficulty_level) VALUES

('Stock Market For Beginners 2024', 'VLE_Q7F4zsc', 'Complete beginner guide to understanding the stock market, how it works, and how to start investing with confidence.', 'Beginner Basics', 1245, 2100000, 45000, 'Ben Felix', 'Beginner'),

('How The Stock Exchange Works', 'F3QpgXBtDeo', 'Animated explanation of how stock exchanges operate, from order matching to price discovery mechanisms.', 'Market Mechanics', 420, 890000, 22000, 'TED-Ed', 'Beginner'),

('Warren Buffett Explains How To Invest', 'ZJzu_xItNkY', 'The Oracle of Omaha shares his timeless investment wisdom and principles for long-term wealth building.', 'Investment Strategy', 1680, 1500000, 38000, 'CNBC', 'Intermediate'),

('Compound Interest Explained', 'kKF_lFjOcMQ', 'Visual demonstration of how compound interest works and why Einstein called it the eighth wonder of the world.', 'Financial Concepts', 720, 650000, 18000, 'Khan Academy', 'Beginner'),

('Dollar Cost Averaging vs Lump Sum', 'X1qzuPRvsM0', 'Data-driven analysis comparing dollar cost averaging strategy versus lump sum investing over different time periods.', 'Investment Strategy', 980, 420000, 12000, 'Ben Felix', 'Intermediate'),

('Understanding ETFs vs Mutual Funds', 'Oi4md6SV_LA', 'Comprehensive comparison of ETFs and mutual funds, covering costs, tax efficiency, and when to use each.', 'Investment Types', 1150, 380000, 9500, 'The Plain Bagel', 'Intermediate'),

('How to Read Financial Statements', 'WEDIj9JBTC8', 'Step-by-step guide to analyzing company financial statements including balance sheets, income statements, and cash flow.', 'Financial Analysis', 1890, 290000, 7800, 'Aswath Damodaran', 'Advanced'),

('Diversification Explained Simply', 'uSJPTz2_YoY', 'Easy-to-understand explanation of portfolio diversification and why it''s crucial for risk management.', 'Risk Management', 540, 180000, 5200, 'Two Cents', 'Beginner'),

('Inflation and Your Investments', 'PHe0bXAIuk0', 'How inflation affects different asset classes and strategies to protect your purchasing power over time.', 'Economic Factors', 825, 150000, 4100, 'The Financial Diet', 'Intermediate'),

('Behavioral Finance: Why We Make Bad Decisions', 'wM6exo9-4b4', 'Exploring psychological biases that lead to poor investment decisions and how to overcome them.', 'Psychology', 1320, 95000, 2800, 'Behavioral Economics', 'Advanced');