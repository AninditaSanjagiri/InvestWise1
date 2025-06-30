/*
  # Expand Learning Content Database

  1. New Tables
    - Comprehensive learning content with articles, guides, FAQs, and deep dives
    - Categories covering all aspects of investing from basics to advanced topics
    - Content types including articles, interactive guides, FAQs, and deep dive analyses

  2. Security
    - Enable RLS on learning_content table
    - Add policy for public read access to published content

  3. Content Structure
    - Detailed articles covering investment fundamentals
    - Interactive guides for hands-on learning
    - FAQ sections for common questions
    - Deep dive analyses for advanced topics
*/

-- Create learning_content table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.learning_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'Article', 'FAQ', 'Interactive Guide', 'Deep Dive'
    category VARCHAR(50) NOT NULL, -- 'Basics', 'Stocks', 'Bonds', 'ETFs', 'Risk Management', etc.
    body TEXT NOT NULL,
    keywords TEXT[],
    reading_time_minutes INTEGER DEFAULT 5,
    associated_risk_profile VARCHAR(20), -- 'Conservative', 'Moderate', 'Aggressive'
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.learning_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Allow public read access to learning_content" ON public.learning_content;
CREATE POLICY "Allow public read access to learning_content" 
ON public.learning_content 
FOR SELECT 
USING (is_published = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learning_content_category ON public.learning_content(category);
CREATE INDEX IF NOT EXISTS idx_learning_content_content_type ON public.learning_content(content_type);
CREATE INDEX IF NOT EXISTS idx_learning_content_keywords ON public.learning_content USING gin(keywords);

-- Insert comprehensive learning content
INSERT INTO public.learning_content (title, content_type, category, body, keywords, reading_time_minutes, associated_risk_profile) VALUES

-- BASICS CATEGORY
('What is Investing?', 'Article', 'Basics', 
'Investing is the act of putting money into financial instruments, property, or other ventures with the expectation of generating income or profit over time. Unlike saving, which focuses on preserving money, investing involves taking calculated risks to grow your wealth.

**Why Invest?**
The primary reason to invest is to build wealth over time and combat inflation. Money sitting in a savings account loses purchasing power due to inflation, while investments have the potential to grow faster than inflation rates.

**Types of Investments:**
There are many ways to invest your money, including stocks (ownership in companies), bonds (loans to companies or governments), real estate, commodities like gold, and more modern options like cryptocurrency.

**Risk and Return:**
All investments carry some level of risk - the possibility of losing money. Generally, investments with higher potential returns also carry higher risks. Understanding this relationship is crucial for making informed investment decisions.

**Getting Started:**
Begin by defining your financial goals, understanding your risk tolerance, and educating yourself about different investment options. Start small and gradually increase your investments as you gain knowledge and confidence.',
ARRAY['investing', 'basics', 'wealth building', 'financial goals', 'risk', 'return'], 8, null),

('Understanding Risk and Return', 'Article', 'Basics',
'Risk and return are the fundamental concepts that drive all investment decisions. Understanding their relationship is crucial for building a successful investment strategy.

**What is Investment Risk?**
Investment risk refers to the possibility that your investment will lose value or not perform as expected. Different types of investments carry different levels of risk, from very safe government bonds to highly volatile individual stocks.

**Types of Risk:**
- **Market Risk:** The risk that the entire market will decline
- **Company Risk:** The risk specific to individual companies
- **Inflation Risk:** The risk that inflation will erode your purchasing power
- **Liquidity Risk:** The risk that you won''t be able to sell your investment quickly

**What is Return?**
Return is the profit or loss you make on an investment, usually expressed as a percentage. Returns can come from two sources: income (like dividends or interest) and capital appreciation (increase in the investment''s value).

**The Risk-Return Relationship:**
Generally, investments with higher potential returns also carry higher risks. This relationship exists because investors demand higher potential rewards for taking on more risk.

**Managing Risk:**
You can manage risk through diversification (spreading investments across different assets), asset allocation (dividing money between different types of investments), and time horizon (longer investment periods can help smooth out short-term volatility).',
ARRAY['risk', 'return', 'volatility', 'diversification', 'market risk', 'investment strategy'], 10, null),

('The Power of Compound Interest', 'Article', 'Basics',
'Compound interest is often called the "eighth wonder of the world" because of its incredible power to grow wealth over time. Understanding and harnessing compound interest is one of the most important concepts in investing.

**What is Compound Interest?**
Compound interest is interest earned on both your original investment (principal) and on previously earned interest. Unlike simple interest, which only earns on the principal, compound interest creates a snowball effect where your money grows exponentially over time.

**How It Works:**
When you invest $1,000 at 7% annual return, you earn $70 in the first year. In the second year, you earn 7% on $1,070 (your original $1,000 plus the $70 interest), which equals $74.90. This process continues, with each year''s earnings becoming part of the base for the next year''s calculations.

**The Time Factor:**
Time is the most crucial element in compound interest. The earlier you start investing, the more time your money has to compound. Even small amounts invested early can grow to substantial sums over decades.

**Real-World Example:**
If you invest $200 monthly starting at age 25 with a 7% annual return, you''ll have about $1.37 million by age 65. If you wait until age 35 to start, you''ll only have about $610,000 - less than half!

**Maximizing Compound Interest:**
- Start investing as early as possible
- Invest regularly and consistently
- Reinvest all dividends and interest
- Choose investments with reasonable long-term returns
- Be patient and avoid withdrawing money early',
ARRAY['compound interest', 'time value of money', 'wealth building', 'long-term investing', 'exponential growth'], 12, null),

-- STOCKS CATEGORY
('Stock Market Fundamentals', 'Article', 'Stocks',
'The stock market is where shares of publicly traded companies are bought and sold. Understanding how it works is essential for any investor looking to build wealth through equity investments.

**What are Stocks?**
Stocks represent ownership shares in a company. When you buy stock, you become a shareholder and own a piece of that business. This ownership gives you certain rights, including voting on company matters and receiving dividends if the company pays them.

**How Stock Prices Work:**
Stock prices are determined by supply and demand. When more people want to buy a stock than sell it, the price goes up. When more people want to sell than buy, the price goes down. This constant fluctuation creates opportunities for profit and risk of loss.

**Types of Stock Orders:**
- **Market Order:** Buy or sell immediately at current market price
- **Limit Order:** Buy or sell only at a specific price or better
- **Stop-Loss Order:** Automatically sell if the stock drops to a certain price

**Stock Market Indices:**
Indices like the S&P 500, Dow Jones, and NASDAQ track the performance of groups of stocks, giving investors a way to measure overall market performance.

**Fundamental vs. Technical Analysis:**
Fundamental analysis involves studying a company''s financial health, business model, and growth prospects. Technical analysis focuses on price charts and trading patterns to predict future price movements.

**Getting Started:**
Begin by researching companies you understand, start with small investments, and consider index funds for broad market exposure. Always invest money you can afford to lose and maintain a long-term perspective.',
ARRAY['stocks', 'stock market', 'shares', 'equity', 'market orders', 'indices', 'fundamental analysis'], 15, null),

('Dividend Investing Strategy', 'Article', 'Stocks',
'Dividend investing focuses on buying stocks of companies that regularly pay dividends to shareholders. This strategy can provide steady income and potential for long-term wealth building.

**What are Dividends?**
Dividends are cash payments that companies make to shareholders, typically quarterly. They represent a portion of the company''s profits being returned to investors. Not all companies pay dividends - some prefer to reinvest profits for growth.

**Types of Dividend-Paying Companies:**
- **Dividend Aristocrats:** S&P 500 companies that have increased dividends for 25+ consecutive years
- **Utility Companies:** Often pay steady dividends due to stable cash flows
- **REITs:** Required to pay out 90% of taxable income as dividends
- **Blue-Chip Stocks:** Large, established companies with long dividend histories

**Key Dividend Metrics:**
- **Dividend Yield:** Annual dividend divided by stock price
- **Payout Ratio:** Percentage of earnings paid as dividends
- **Dividend Growth Rate:** How much the dividend increases each year

**Benefits of Dividend Investing:**
- Regular income stream
- Potential for dividend growth over time
- Generally less volatile than growth stocks
- Tax advantages for qualified dividends

**Risks to Consider:**
- Companies can cut or eliminate dividends
- Dividend stocks may underperform in bull markets
- Interest rate sensitivity
- Concentration in certain sectors

**Building a Dividend Portfolio:**
Focus on companies with sustainable business models, reasonable payout ratios, and history of consistent dividend payments. Diversify across sectors and consider dividend-focused ETFs for broader exposure.',
ARRAY['dividends', 'dividend yield', 'passive income', 'dividend aristocrats', 'REITs', 'blue chip stocks'], 12, 'Conservative'),

-- BONDS CATEGORY
('Bond Basics for Beginners', 'Article', 'Bonds',
'Bonds are debt securities that can provide steady income and portfolio stability. Understanding bonds is crucial for building a well-diversified investment portfolio.

**What are Bonds?**
When you buy a bond, you''re essentially lending money to the issuer (government, corporation, or municipality) for a specific period. In return, they promise to pay you interest regularly and return your principal when the bond matures.

**Types of Bonds:**
- **Government Bonds:** Issued by federal governments (like U.S. Treasuries)
- **Corporate Bonds:** Issued by companies to raise capital
- **Municipal Bonds:** Issued by state and local governments
- **International Bonds:** Issued by foreign governments or companies

**Key Bond Terms:**
- **Face Value:** The amount paid back at maturity
- **Coupon Rate:** The annual interest rate
- **Maturity Date:** When the bond expires and principal is repaid
- **Yield:** The effective interest rate based on current price

**Bond Risks:**
- **Interest Rate Risk:** Bond prices fall when interest rates rise
- **Credit Risk:** The issuer might default on payments
- **Inflation Risk:** Fixed payments lose purchasing power over time
- **Liquidity Risk:** Some bonds are hard to sell before maturity

**Why Include Bonds in Your Portfolio:**
Bonds provide diversification, steady income, and generally lower volatility than stocks. They often perform well when stocks struggle, helping to balance your portfolio.

**Getting Started with Bonds:**
Consider starting with government bonds or high-grade corporate bonds. Bond ETFs and mutual funds offer easy diversification. Match bond maturities to your investment timeline.',
ARRAY['bonds', 'fixed income', 'government bonds', 'corporate bonds', 'yield', 'interest rates', 'portfolio diversification'], 10, 'Conservative'),

-- ETFs CATEGORY
('ETF Investing Guide', 'Article', 'ETFs',
'Exchange-Traded Funds (ETFs) have revolutionized investing by providing easy access to diversified portfolios at low costs. They''re an excellent tool for both beginners and experienced investors.

**What are ETFs?**
ETFs are investment funds that trade on stock exchanges like individual stocks. They typically track an index, commodity, bonds, or basket of assets, giving investors exposure to a diversified portfolio in a single purchase.

**Types of ETFs:**
- **Index ETFs:** Track market indices like the S&P 500
- **Sector ETFs:** Focus on specific industries (technology, healthcare, etc.)
- **International ETFs:** Provide exposure to foreign markets
- **Bond ETFs:** Hold portfolios of bonds
- **Commodity ETFs:** Track precious metals, oil, or agricultural products
- **Thematic ETFs:** Focus on trends like clean energy or artificial intelligence

**Advantages of ETFs:**
- **Low Costs:** Most ETFs have expense ratios under 0.5%
- **Diversification:** Instant exposure to hundreds or thousands of securities
- **Liquidity:** Can be bought and sold during market hours
- **Transparency:** Holdings are disclosed daily
- **Tax Efficiency:** Generally more tax-efficient than mutual funds

**ETF vs. Mutual Funds:**
ETFs trade like stocks throughout the day, while mutual funds only price once daily. ETFs typically have lower fees and minimum investments, making them more accessible to small investors.

**Building an ETF Portfolio:**
Start with broad market index ETFs for core holdings, then add sector or international ETFs for diversification. Consider your risk tolerance and investment timeline when selecting ETFs.

**Popular ETF Categories for Beginners:**
- Total Stock Market ETFs (like VTI)
- S&P 500 ETFs (like SPY or VOO)
- International ETFs (like VTIAX)
- Bond ETFs (like BND)
- Target-Date ETFs for hands-off investing',
ARRAY['ETFs', 'index funds', 'diversification', 'low cost investing', 'passive investing', 'expense ratios'], 14, null),

-- RISK MANAGEMENT CATEGORY
('Portfolio Diversification Strategies', 'Deep Dive', 'Risk Management',
'Diversification is the practice of spreading investments across various assets to reduce risk. It''s often called the only "free lunch" in investing because it can reduce risk without sacrificing expected returns.

**The Science Behind Diversification:**
Different investments often move in different directions at different times. When stocks are down, bonds might be up. When U.S. markets struggle, international markets might perform well. By holding a mix of investments, you can smooth out the ups and downs.

**Types of Diversification:**

**Asset Class Diversification:**
Spread money across stocks, bonds, real estate, and commodities. Each asset class has different risk and return characteristics and responds differently to economic conditions.

**Geographic Diversification:**
Invest in both domestic and international markets. Different countries'' economies don''t always move in sync, providing additional diversification benefits.

**Sector Diversification:**
Within stocks, spread investments across different industries. Technology, healthcare, utilities, and consumer goods often perform differently based on economic cycles.

**Time Diversification:**
Invest regularly over time rather than all at once. This dollar-cost averaging approach helps reduce the impact of market timing.

**Common Diversification Mistakes:**
- **Over-diversification:** Owning too many similar investments
- **False Diversification:** Thinking you''re diversified when holdings are actually correlated
- **Home Country Bias:** Investing only in domestic markets
- **Rebalancing Neglect:** Not adjusting allocations as they drift from targets

**Building a Diversified Portfolio:**
Start with broad market index funds, add international exposure, include some bonds for stability, and consider alternative investments like REITs. Regularly rebalance to maintain your target allocation.

**The 60/40 Portfolio:**
A classic diversified portfolio allocates 60% to stocks and 40% to bonds. While this may not be optimal for everyone, it demonstrates the principle of balancing growth assets with stable assets.',
ARRAY['diversification', 'asset allocation', 'portfolio construction', 'risk management', 'correlation', 'rebalancing'], 18, null),

-- RETIREMENT PLANNING CATEGORY
('Retirement Planning Fundamentals', 'Article', 'Retirement Planning',
'Planning for retirement is one of the most important financial goals. Starting early and understanding your options can make the difference between a comfortable retirement and financial stress in your golden years.

**Why Start Early:**
Time is your greatest asset in retirement planning. Thanks to compound interest, money invested in your 20s and 30s has decades to grow. Even small amounts invested early can become substantial sums by retirement.

**Retirement Account Types:**

**401(k) Plans:**
Employer-sponsored retirement plans that often include company matching. Contributions are typically tax-deductible, and investments grow tax-deferred until withdrawal.

**Traditional IRAs:**
Individual retirement accounts with tax-deductible contributions and tax-deferred growth. Required minimum distributions begin at age 73.

**Roth IRAs:**
Contributions are made with after-tax dollars, but qualified withdrawals in retirement are tax-free. No required minimum distributions during your lifetime.

**How Much to Save:**
A common rule of thumb is to save 10-15% of your income for retirement. If your employer offers matching, contribute at least enough to get the full match - it''s free money!

**Investment Strategy by Age:**

**20s and 30s:** Focus on growth with 80-90% stocks
**40s and 50s:** Gradually shift to 60-70% stocks
**60s and beyond:** Move toward 40-50% stocks for stability

**Social Security:**
Understand that Social Security provides a foundation but typically replaces only about 40% of pre-retirement income. Don''t rely on it as your only retirement income source.

**Healthcare Costs:**
Plan for increased healthcare expenses in retirement. Consider Health Savings Accounts (HSAs) as a triple tax-advantaged retirement savings vehicle.',
ARRAY['retirement planning', '401k', 'IRA', 'Roth IRA', 'compound interest', 'asset allocation', 'Social Security'], 16, null),

-- ADVANCED TOPICS
('Options Trading Basics', 'Deep Dive', 'Advanced Topics',
'Options are financial contracts that give you the right, but not the obligation, to buy or sell a stock at a specific price within a certain time period. They can be used for speculation, income generation, or risk management.

**Types of Options:**

**Call Options:**
Give you the right to buy a stock at a specific price (strike price) before expiration. You profit if the stock price rises above the strike price plus the premium paid.

**Put Options:**
Give you the right to sell a stock at a specific price before expiration. You profit if the stock price falls below the strike price minus the premium paid.

**Key Options Terms:**
- **Premium:** The cost to buy the option
- **Strike Price:** The price at which you can buy/sell the stock
- **Expiration Date:** When the option expires
- **Exercise:** Actually buying/selling the stock using the option

**Options Strategies:**

**Covered Calls:**
Own the stock and sell call options against it to generate income. This strategy works well in sideways or slightly bullish markets.

**Protective Puts:**
Own the stock and buy put options as insurance against price declines. This limits your downside risk.

**Cash-Secured Puts:**
Sell put options while holding enough cash to buy the stock if assigned. This can be a way to buy stocks at lower prices.

**Risks of Options Trading:**
- Options can expire worthless
- Unlimited loss potential with some strategies
- Complex strategies require significant knowledge
- Time decay works against option buyers

**Before Trading Options:**
Understand that options are complex instruments requiring significant education. Start with paper trading, learn the Greeks (delta, gamma, theta, vega), and never risk more than you can afford to lose.

**Educational Resources:**
Consider taking options courses, reading specialized books, and practicing with virtual trading before risking real money.',
ARRAY['options', 'derivatives', 'call options', 'put options', 'covered calls', 'advanced investing', 'risk management'], 20, 'Aggressive'),

-- FAQS
('Common Investment Mistakes to Avoid', 'FAQ', 'Basics',
'Learning from common mistakes can save you significant money and stress in your investment journey. Here are the most frequent errors new investors make and how to avoid them.

**Mistake #1: Trying to Time the Market**
Many investors try to buy low and sell high by predicting market movements. Research shows this is extremely difficult, even for professionals. Instead, focus on time in the market rather than timing the market.

**Mistake #2: Lack of Diversification**
Putting all your money in one stock, sector, or asset class exposes you to unnecessary risk. Diversify across different investments to reduce volatility.

**Mistake #3: Emotional Investing**
Fear and greed drive many poor investment decisions. Selling during market crashes and buying during bubbles is a recipe for losses. Stick to your long-term plan regardless of short-term market movements.

**Mistake #4: Chasing Performance**
Buying last year''s best-performing investments often leads to disappointment. Past performance doesn''t guarantee future results. Focus on consistent, long-term strategies.

**Mistake #5: High Fees and Expenses**
Investment fees compound over time and can significantly reduce returns. Choose low-cost index funds and ETFs when possible, and be aware of all fees you''re paying.

**Mistake #6: Not Having a Plan**
Investing without clear goals and a strategy is like driving without a destination. Define your objectives, time horizon, and risk tolerance before investing.

**Mistake #7: Overconfidence**
Some investors believe they can consistently beat the market through stock picking or market timing. Humility and realistic expectations lead to better outcomes.

**How to Avoid These Mistakes:**
- Educate yourself continuously
- Start with simple, diversified investments
- Automate your investing
- Focus on long-term goals
- Review and rebalance regularly
- Consider working with a fee-only financial advisor',
ARRAY['investment mistakes', 'market timing', 'emotional investing', 'diversification', 'investment fees', 'investment planning'], 12, null),

('How to Start Investing with $1000', 'FAQ', 'Basics',
'Starting to invest with a modest amount like $1,000 is not only possible but smart. Here''s how to make the most of your first investment dollars.

**Step 1: Emergency Fund First**
Before investing, ensure you have at least $500-1,000 in an emergency fund for unexpected expenses. This prevents you from having to sell investments at bad times.

**Step 2: Pay Off High-Interest Debt**
If you have credit card debt or other high-interest loans, pay these off first. The guaranteed "return" of eliminating 18% credit card interest beats most investment returns.

**Step 3: Choose Your Account Type**
- **Taxable Brokerage Account:** Most flexible, no contribution limits
- **Roth IRA:** Tax-free growth, great for young investors
- **401(k):** If your employer offers matching, contribute enough to get the full match first

**Step 4: Select Your Investments**
With $1,000, focus on broad diversification through low-cost funds:

**Option 1: Target-Date Fund**
One fund that automatically adjusts allocation as you age. Simple and effective for beginners.

**Option 2: Three-Fund Portfolio**
- 60% Total Stock Market Index Fund
- 30% International Stock Index Fund  
- 10% Bond Index Fund

**Option 3: Single Broad Market ETF**
Start with an S&P 500 or total stock market ETF, add international and bonds as you save more.

**Step 5: Automate Your Investing**
Set up automatic monthly contributions, even if it''s just $50-100. Consistency matters more than the amount.

**Brokerages for Small Investors:**
- Fidelity, Schwab, and Vanguard offer commission-free ETF trading
- Many have no minimum investments for ETFs
- Robo-advisors like Betterment can automate everything

**Common Concerns:**
"$1,000 isn''t enough to matter" - Wrong! It''s enough to start building good habits and learning about investing.
"I should wait until I have more" - Time in the market beats timing the market. Start now, add more later.',
ARRAY['beginner investing', 'small amounts', 'first investment', 'target date funds', 'index funds', 'robo advisors'], 10, null),

-- INTERACTIVE GUIDES
('Building Your First Portfolio', 'Interactive Guide', 'Portfolio Construction',
'Creating your first investment portfolio can seem overwhelming, but breaking it down into steps makes it manageable. This guide walks you through the process.

**Step 1: Define Your Goals**
Before choosing investments, clarify what you''re investing for:
- Retirement (long-term, 20+ years)
- House down payment (medium-term, 3-7 years)  
- Emergency fund (short-term, immediate access needed)

**Step 2: Determine Your Risk Tolerance**
Ask yourself:
- How would you feel if your portfolio lost 20% in a year?
- Can you stick to your plan during market downturns?
- Do you have stable income and emergency savings?

**Step 3: Choose Your Asset Allocation**
Based on your age and risk tolerance:

**Conservative (Age 60+):**
- 40% Stocks, 60% Bonds
- Focus on income and capital preservation

**Moderate (Age 40-60):**
- 60% Stocks, 40% Bonds
- Balance growth with some stability

**Aggressive (Age 20-40):**
- 80% Stocks, 20% Bonds
- Maximize long-term growth potential

**Step 4: Select Specific Investments**
For each asset class, choose low-cost, diversified funds:

**U.S. Stocks:**
- Total Stock Market Index Fund (VTI, SWTSX)
- S&P 500 Index Fund (VOO, SWPPX)

**International Stocks:**
- International Index Fund (VTIAX, SWISX)
- Emerging Markets Fund (VWO, SCHE)

**Bonds:**
- Total Bond Market Fund (BND, SWAGX)
- Treasury Bond Fund (GOVT, SCHO)

**Step 5: Implement Your Plan**
- Open accounts at a low-cost brokerage
- Set up automatic investments
- Buy your chosen funds
- Document your strategy

**Step 6: Monitor and Rebalance**
- Review quarterly, rebalance annually
- Don''t make frequent changes
- Stay focused on long-term goals

**Sample Beginner Portfolio:**
- 70% Total Stock Market Index
- 20% International Stock Index
- 10% Bond Index

This simple three-fund portfolio provides broad diversification with minimal complexity.',
ARRAY['portfolio construction', 'asset allocation', 'index funds', 'diversification', 'rebalancing', 'beginner portfolio'], 15, null);