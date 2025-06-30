import React, { useState } from 'react'
import { Search, Lightbulb, BookOpen, Loader2, AlertCircle } from 'lucide-react'
import { useRealTimePortfolio } from '../hooks/useRealTimePortfolio'

const GlossarySearch = () => {
  const [term, setTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [definition, setDefinition] = useState('')
  const [analogy, setAnalogy] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const { recordLearningActivity } = useRealTimePortfolio()

  // Comprehensive simulated AI responses for investment terms
  const simulatedResponses = {
    // Basic Investment Terms
    'dividend': {
      definition: 'A dividend is a payment made by corporations to their shareholders, usually as a distribution of profits. Companies typically pay dividends quarterly, and the amount is decided by the board of directors.',
      analogy: 'Think of dividends like getting a bonus from your employer for being a loyal employee. The company shares its success with you as a reward for being an investor and believing in their business.'
    },
    'stock': {
      definition: 'A stock represents ownership in a company. When you buy stock, you become a shareholder and own a piece of that business, giving you voting rights and potential profits.',
      analogy: 'Buying stock is like buying a slice of pizza from a whole pizza. You own that slice, and if the pizza becomes more valuable (maybe it\'s the last pizza on Earth!), your slice becomes worth more too.'
    },
    'bond': {
      definition: 'A bond is essentially a loan you give to a company or government. In return, they promise to pay you back the principal amount plus interest over a specified period.',
      analogy: 'A bond is like lending money to your friend who promises to pay you back with interest. You\'re the bank, and they\'re the borrower who needs money for their projects.'
    },
    'etf': {
      definition: 'An Exchange-Traded Fund (ETF) is a collection of stocks, bonds, or other investments bundled together and traded on stock exchanges like individual stocks.',
      analogy: 'An ETF is like a fruit basket containing apples, oranges, and bananas. Instead of buying each fruit separately, you buy the whole basket and get a variety of fruits in one purchase.'
    },
    'mutual fund': {
      definition: 'A mutual fund pools money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities, managed by professional fund managers.',
      analogy: 'A mutual fund is like a neighborhood potluck where everyone contributes money, and a professional chef (fund manager) decides what food to buy and cook for everyone to share.'
    },
    'portfolio': {
      definition: 'A portfolio is your complete collection of investments, including stocks, bonds, ETFs, real estate, and other assets. It represents your total investment holdings.',
      analogy: 'Your investment portfolio is like your wardrobe - it contains different types of clothing (investments) for different occasions (financial goals), and you want a good mix to be prepared for anything.'
    },
    'diversification': {
      definition: 'Diversification is the practice of spreading your investments across different asset classes, sectors, and geographic regions to reduce risk and volatility.',
      analogy: 'Diversification is like not putting all your eggs in one basket. If you drop one basket, you still have eggs in other baskets. Similarly, if one investment fails, others can still perform well.'
    },
    'bull market': {
      definition: 'A bull market is a period of rising stock prices and investor optimism, typically lasting months or years. It\'s characterized by strong economic fundamentals and positive sentiment.',
      analogy: 'A bull market is like a hot air balloon rising - everything seems to be going up, people are excited, and there\'s a general feeling that things will keep getting better.'
    },
    'bear market': {
      definition: 'A bear market occurs when stock prices fall 20% or more from recent highs, often accompanied by widespread pessimism and economic uncertainty.',
      analogy: 'A bear market is like winter - everything seems cold and dormant, people stay indoors (sell stocks), but just like winter, it eventually ends and spring (recovery) comes.'
    },
    'volatility': {
      definition: 'Volatility measures how much and how quickly investment prices move up and down. High volatility means prices change dramatically, while low volatility means stable prices.',
      analogy: 'Volatility is like the weather. Some days are calm and predictable (low volatility), while others have storms with dramatic changes (high volatility). You can\'t control it, but you can prepare for it.'
    },
    'pe ratio': {
      definition: 'The Price-to-Earnings (P/E) ratio compares a company\'s current stock price to its earnings per share. It helps investors determine if a stock is overvalued or undervalued.',
      analogy: 'P/E ratio is like comparing house prices to annual rent. If a house costs $500,000 and rents for $25,000/year, the ratio is 20. It helps you decide if you\'re paying too much.'
    },
    'market cap': {
      definition: 'Market capitalization is the total value of a company\'s shares in the stock market, calculated by multiplying the stock price by the number of outstanding shares.',
      analogy: 'Market cap is like determining the total value of all slices of pizza. If each slice costs $3 and there are 100 slices, the total pizza value (market cap) is $300.'
    },
    'yield': {
      definition: 'Yield represents the income return on an investment, usually expressed as a percentage. For stocks, it\'s the annual dividend divided by the stock price.',
      analogy: 'Yield is like the interest rate on your savings account. If you put $100 in the bank and earn $5 per year, your yield is 5%. It tells you how much income your money generates.'
    },
    'compound interest': {
      definition: 'Compound interest is earning interest on both your original investment and previously earned interest. It\'s the concept of "interest earning interest" over time.',
      analogy: 'Compound interest is like a snowball rolling down a hill. It starts small, but as it rolls, it picks up more snow (interest) and grows bigger and faster, becoming massive by the bottom.'
    },
    'dollar cost averaging': {
      definition: 'Dollar-cost averaging is an investment strategy where you invest a fixed amount of money at regular intervals, regardless of market conditions.',
      analogy: 'Dollar-cost averaging is like buying groceries every week with the same budget. Sometimes prices are high, sometimes low, but over time you get a fair average price for your purchases.'
    },
    'asset allocation': {
      definition: 'Asset allocation is the process of dividing your investment portfolio among different asset categories like stocks, bonds, and cash based on your goals and risk tolerance.',
      analogy: 'Asset allocation is like planning a balanced meal. You want some protein (stocks for growth), vegetables (bonds for stability), and carbs (cash for energy), all in the right proportions for your health goals.'
    },
    'risk tolerance': {
      definition: 'Risk tolerance is your ability and willingness to lose some or all of your original investment in exchange for greater potential returns.',
      analogy: 'Risk tolerance is like your comfort level with roller coasters. Some people love the thrill of big drops (high risk), while others prefer the merry-go-round (low risk). Both are valid choices.'
    },
    'liquidity': {
      definition: 'Liquidity refers to how quickly and easily an investment can be converted to cash without significantly affecting its price.',
      analogy: 'Liquidity is like how quickly you can sell items from your garage. Cash is like having exact change, stocks are like popular items that sell fast, and real estate is like furniture that takes time to sell.'
    },
    'inflation': {
      definition: 'Inflation is the rate at which the general level of prices for goods and services rises, reducing the purchasing power of money over time.',
      analogy: 'Inflation is like a slow leak in your wallet. Even if you don\'t spend money, it gradually loses its ability to buy the same amount of stuff as prices creep up over time.'
    },
    'recession': {
      definition: 'A recession is a significant decline in economic activity lasting more than a few months, typically characterized by falling GDP, rising unemployment, and reduced consumer spending.',
      analogy: 'A recession is like the economy catching a cold. Everything slows down - people spend less, companies hire fewer workers, and everyone feels a bit under the weather until recovery comes.'
    },
    'ipo': {
      definition: 'An Initial Public Offering (IPO) is when a private company first sells shares to the public, becoming a publicly traded company on a stock exchange.',
      analogy: 'An IPO is like a private club opening its doors to the public for the first time. Previously, only insiders could be members, but now anyone can buy a membership (shares).'
    },
    'blue chip': {
      definition: 'Blue chip stocks are shares of large, well-established companies with a history of reliable performance, stable earnings, and often dividend payments.',
      analogy: 'Blue chip stocks are like the reliable, well-known brands you trust - think Coca-Cola or McDonald\'s. They might not be the most exciting, but they\'re dependable and have been around forever.'
    },
    'growth stock': {
      definition: 'Growth stocks are shares of companies expected to grow at an above-average rate compared to other companies, often reinvesting profits rather than paying dividends.',
      analogy: 'Growth stocks are like promising young athletes. They might not be earning big money now, but they\'re training hard and expected to become superstars in the future.'
    },
    'value stock': {
      definition: 'Value stocks are shares that appear to be trading for less than their intrinsic value, often having low price-to-earnings ratios and paying dividends.',
      analogy: 'Value stocks are like finding designer clothes at a thrift store. The quality is there, but for some reason, they\'re priced lower than they should be, creating a bargain opportunity.'
    },
    'sector': {
      definition: 'A sector is a group of companies that operate in the same industry or have similar business activities, such as technology, healthcare, or energy.',
      analogy: 'Sectors are like different neighborhoods in a city. The tech sector is like Silicon Valley (innovative and fast-paced), while utilities are like the quiet residential area (stable and essential).'
    },
    'market order': {
      definition: 'A market order is an instruction to buy or sell a stock immediately at the current market price, guaranteeing execution but not the price.',
      analogy: 'A market order is like going to a busy restaurant and saying "I\'ll take whatever table is available right now." You\'re guaranteed to get seated, but you might not get the best table.'
    },
    'limit order': {
      definition: 'A limit order is an instruction to buy or sell a stock only at a specific price or better, giving you price control but no guarantee of execution.',
      analogy: 'A limit order is like telling a restaurant "I\'ll only sit at a window table." You might get exactly what you want, or you might not get seated at all if your conditions aren\'t met.'
    },
    'stop loss': {
      definition: 'A stop-loss order is designed to limit an investor\'s loss on a position by automatically selling when the stock reaches a predetermined price.',
      analogy: 'A stop-loss is like setting an alarm to wake you up if your house gets too cold. It automatically takes action (turns on heat/sells stock) when things reach an uncomfortable level.'
    },
    'earnings': {
      definition: 'Earnings represent a company\'s profit after all expenses, taxes, and costs have been subtracted from revenue. It\'s a key measure of company performance.',
      analogy: 'Earnings are like your take-home pay after all deductions. It\'s what the company actually gets to keep after paying all its bills, just like your salary after taxes and expenses.'
    },
    'revenue': {
      definition: 'Revenue is the total amount of money a company receives from its business operations before any expenses are deducted. It\'s also called the "top line."',
      analogy: 'Revenue is like the total amount of money a lemonade stand collects from selling lemonade, before subtracting the cost of lemons, sugar, and cups.'
    },
    'margin': {
      definition: 'Margin in investing can refer to profit margin (percentage of revenue that becomes profit) or buying on margin (borrowing money to purchase securities).',
      analogy: 'Profit margin is like keeping $2 from every $10 you earn (20% margin). Buying on margin is like using a credit card to buy investments - you\'re borrowing money hoping to make more than the interest costs.'
    },
    'short selling': {
      definition: 'Short selling is betting that a stock\'s price will fall by borrowing shares, selling them, and hoping to buy them back later at a lower price.',
      analogy: 'Short selling is like borrowing your friend\'s bike, selling it for $100, then hoping to buy an identical bike later for $80 to return to your friend, keeping the $20 difference.'
    },
    'options': {
      definition: 'Options are contracts that give you the right (but not obligation) to buy or sell a stock at a specific price within a certain time period.',
      analogy: 'Options are like putting a deposit on a house. You pay a small fee for the right to buy it at a set price within 30 days, but you don\'t have to if you change your mind.'
    },
    'futures': {
      definition: 'Futures are contracts to buy or sell an asset at a predetermined price on a specific future date, commonly used for commodities and financial instruments.',
      analogy: 'Futures are like pre-ordering a video game. You agree today to pay $60 for a game that will be delivered in 6 months, regardless of what the price might be then.'
    },
    'commodity': {
      definition: 'Commodities are basic goods used in commerce that are interchangeable with other goods of the same type, such as gold, oil, wheat, or coffee.',
      analogy: 'Commodities are like the basic ingredients in cooking. Whether you buy flour from Store A or Store B, flour is flour - it\'s a standardized product that\'s essentially the same everywhere.'
    },
    'reit': {
      definition: 'A Real Estate Investment Trust (REIT) is a company that owns, operates, or finances income-producing real estate, allowing investors to buy shares in real estate portfolios.',
      analogy: 'A REIT is like owning a piece of a shopping mall without having to buy the whole thing. You get a share of the rent money from all the stores, but you don\'t have to deal with maintenance or tenants.'
    },
    'index fund': {
      definition: 'An index fund is a type of mutual fund or ETF designed to track the performance of a specific market index, like the S&P 500, providing broad market exposure.',
      analogy: 'An index fund is like buying a sampler platter at a restaurant. Instead of picking individual dishes (stocks), you get a little bit of everything the restaurant offers, representing the whole menu.'
    },
    'expense ratio': {
      definition: 'The expense ratio is the annual fee charged by mutual funds and ETFs, expressed as a percentage of your investment, covering management and operational costs.',
      analogy: 'An expense ratio is like a gym membership fee. If you invest $1,000 and the expense ratio is 1%, you pay $10 per year for the fund company to manage your investments.'
    },
    'beta': {
      definition: 'Beta measures how much a stock\'s price moves relative to the overall market. A beta of 1 moves with the market, above 1 is more volatile, below 1 is less volatile.',
      analogy: 'Beta is like measuring how much a boat rocks compared to the ocean waves. A beta of 1 means it rocks exactly with the waves, higher means it rocks more dramatically, lower means it\'s more stable.'
    },
    'alpha': {
      definition: 'Alpha measures an investment\'s performance relative to a market benchmark. Positive alpha means the investment outperformed the market after adjusting for risk.',
      analogy: 'Alpha is like a student\'s grade compared to the class average. If the class average is 80% and you get 85%, your alpha is +5% - you performed better than expected.'
    },
    'sharpe ratio': {
      definition: 'The Sharpe ratio measures risk-adjusted returns by comparing an investment\'s excess return to its volatility, helping evaluate if higher returns justify the additional risk.',
      analogy: 'The Sharpe ratio is like comparing restaurants based on both food quality and price. A fancy restaurant might have great food, but if it\'s too expensive, the value (Sharpe ratio) might be low.'
    },
    'market maker': {
      definition: 'Market makers are firms that provide liquidity to markets by continuously buying and selling securities, profiting from the bid-ask spread.',
      analogy: 'Market makers are like the middleman at a farmers market who always has produce to sell and is always willing to buy from farmers, keeping the market flowing smoothly.'
    },
    'bid ask spread': {
      definition: 'The bid-ask spread is the difference between the highest price a buyer is willing to pay (bid) and the lowest price a seller will accept (ask) for a security.',
      analogy: 'The bid-ask spread is like haggling at a flea market. You offer $20 (bid), the seller wants $25 (ask), and the $5 difference is the spread you need to negotiate.'
    },
    'volume': {
      definition: 'Volume refers to the number of shares traded in a security during a specific period, indicating the level of investor interest and liquidity.',
      analogy: 'Volume is like the number of people at a concert. High volume means lots of people are buying and selling (popular concert), low volume means few people are interested (empty venue).'
    },
    'market timing': {
      definition: 'Market timing is the strategy of making buy or sell decisions by attempting to predict future market price movements, which is notoriously difficult to do consistently.',
      analogy: 'Market timing is like trying to predict exactly when it will rain to plan your picnic. Even meteorologists with all their tools get it wrong sometimes - the market is even more unpredictable.'
    },
    'rebalancing': {
      definition: 'Rebalancing is the process of realigning your portfolio\'s asset allocation by buying or selling investments to maintain your desired risk level and investment strategy.',
      analogy: 'Rebalancing is like adjusting the ingredients in your favorite recipe. If you accidentally add too much salt (one investment grows too large), you add more of other ingredients to get back to the perfect taste.'
    },
    'tax loss harvesting': {
      definition: 'Tax-loss harvesting involves selling investments at a loss to offset capital gains taxes, potentially reducing your overall tax burden while maintaining your investment strategy.',
      analogy: 'Tax-loss harvesting is like using a coupon to reduce your grocery bill. You\'re strategically timing your purchases (selling losing investments) to save money on taxes.'
    },
    'capital gains': {
      definition: 'Capital gains are profits from selling an investment for more than you paid for it. Short-term gains (held less than a year) are taxed as ordinary income, long-term gains have preferential tax rates.',
      analogy: 'Capital gains are like profit from selling a collectible card. If you bought it for $10 and sold it for $15, your capital gain is $5 - the government wants a share of that profit.'
    },
    'dividend yield': {
      definition: 'Dividend yield is the annual dividend payment divided by the stock price, expressed as a percentage, showing how much income you receive relative to your investment.',
      analogy: 'Dividend yield is like the interest rate on a savings account. If a stock costs $100 and pays $4 in annual dividends, the yield is 4% - that\'s your annual income rate.'
    },
    'payout ratio': {
      definition: 'The payout ratio is the percentage of a company\'s earnings paid out as dividends to shareholders, indicating how much profit is returned versus reinvested in the business.',
      analogy: 'Payout ratio is like deciding how much of your paycheck to spend versus save. A company with a 50% payout ratio gives half its profits to shareholders and keeps half for growth.'
    },
    'book value': {
      definition: 'Book value represents a company\'s net worth according to its balance sheet, calculated as total assets minus total liabilities, often compared to market value.',
      analogy: 'Book value is like the official value of your car according to Kelley Blue Book, based on its age and condition, which might be different from what someone would actually pay for it.'
    },
    'price to book': {
      definition: 'Price-to-book ratio compares a company\'s market value to its book value, helping investors determine if a stock is overvalued or undervalued relative to its assets.',
      analogy: 'Price-to-book is like comparing a house\'s selling price to its assessed value for taxes. If it sells for much more than the assessed value, it might be overpriced.'
    },
    'return on equity': {
      definition: 'Return on Equity (ROE) measures how efficiently a company uses shareholders\' equity to generate profits, calculated as net income divided by shareholders\' equity.',
      analogy: 'ROE is like measuring how good a chef is by looking at how much profit a restaurant makes relative to the money invested in kitchen equipment and ingredients.'
    },
    'debt to equity': {
      definition: 'Debt-to-equity ratio compares a company\'s total debt to shareholders\' equity, indicating how much the company relies on borrowing versus owner investment to finance operations.',
      analogy: 'Debt-to-equity is like comparing how much of your house purchase was financed with a mortgage versus your down payment. Higher ratios mean more borrowing, which can be riskier.'
    },
    'current ratio': {
      definition: 'Current ratio measures a company\'s ability to pay short-term obligations by comparing current assets to current liabilities, indicating financial health and liquidity.',
      analogy: 'Current ratio is like checking if you have enough money in your checking account to pay this month\'s bills. A ratio above 1 means you can cover your short-term expenses.'
    },
    'working capital': {
      definition: 'Working capital is the difference between a company\'s current assets and current liabilities, representing the short-term financial health and operational efficiency.',
      analogy: 'Working capital is like having enough cash flow to run your household smoothly - paying bills, buying groceries, and handling unexpected expenses without stress.'
    },
    'free cash flow': {
      definition: 'Free cash flow is the cash a company generates after accounting for capital expenditures needed to maintain or expand its asset base, available for dividends, debt reduction, or growth.',
      analogy: 'Free cash flow is like your disposable income after paying all necessary expenses and setting aside money for home maintenance. It\'s what you can freely spend or save.'
    },
    'enterprise value': {
      definition: 'Enterprise value represents the total value of a company, including market capitalization plus debt minus cash, giving a more complete picture than market cap alone.',
      analogy: 'Enterprise value is like the true cost of buying a house, including the mortgage you\'d assume minus any cash the seller leaves behind. It\'s the real price of ownership.'
    },
    'moat': {
      definition: 'An economic moat refers to a company\'s competitive advantages that protect it from competitors, such as brand strength, patents, network effects, or cost advantages.',
      analogy: 'A moat is like a castle\'s protective water barrier. Companies with strong moats (like Coca-Cola\'s brand or Google\'s search dominance) are harder for competitors to attack.'
    },
    'cyclical': {
      definition: 'Cyclical stocks are shares of companies whose performance closely follows economic cycles, doing well during expansions and poorly during recessions.',
      analogy: 'Cyclical stocks are like ice cream sales - they do great in summer (good economy) but struggle in winter (recession). Their fortunes rise and fall with economic seasons.'
    },
    'defensive': {
      definition: 'Defensive stocks are shares of companies that tend to remain stable during economic downturns, often in industries like utilities, healthcare, or consumer staples.',
      analogy: 'Defensive stocks are like umbrella companies - people need umbrellas whether the economy is good or bad, so these businesses stay relatively stable in all weather.'
    },
    'penny stock': {
      definition: 'Penny stocks are shares of small companies that trade for less than $5 per share, often characterized by high volatility, low liquidity, and higher risk.',
      analogy: 'Penny stocks are like lottery tickets - they\'re cheap to buy and could potentially make you rich, but most of the time you\'ll lose your money. They\'re very speculative bets.'
    },
    'insider trading': {
      definition: 'Insider trading involves buying or selling securities based on material, non-public information about a company, which is illegal when done by corporate insiders or their associates.',
      analogy: 'Insider trading is like cheating on a test by getting the answers beforehand. It\'s unfair to other students (investors) and against the rules, so you get in serious trouble if caught.'
    },
    'sec': {
      definition: 'The Securities and Exchange Commission (SEC) is the U.S. federal agency responsible for regulating the securities markets and protecting investors from fraud and manipulation.',
      analogy: 'The SEC is like the referee in a sports game, making sure everyone follows the rules, calling fouls when they see cheating, and keeping the game fair for all players.'
    },
    'prospectus': {
      definition: 'A prospectus is a legal document that provides details about an investment offering, including risks, financial information, and terms, required for public securities offerings.',
      analogy: 'A prospectus is like the detailed menu at a restaurant that lists all ingredients, nutritional information, and potential allergens - it tells you everything you need to know before ordering.'
    },
    '10k': {
      definition: 'A 10-K is an annual report that public companies must file with the SEC, providing a comprehensive overview of the business, financial condition, and results of operations.',
      analogy: 'A 10-K is like a company\'s annual report card that it must show to its parents (investors and regulators), detailing how it performed and what challenges it faces.'
    },
    'earnings call': {
      definition: 'An earnings call is a conference call where company executives discuss quarterly financial results with analysts and investors, often including guidance for future performance.',
      analogy: 'An earnings call is like a quarterly parent-teacher conference where the company (student) reports its grades (earnings) and discusses what to expect next semester.'
    },
    'guidance': {
      definition: 'Guidance refers to forward-looking statements from company management about expected future financial performance, helping investors set expectations.',
      analogy: 'Guidance is like a weather forecast from the company - they\'re telling you what they expect the business climate to look like in the coming months, though it might not be perfectly accurate.'
    },
    'analyst': {
      definition: 'A financial analyst is a professional who evaluates securities, companies, and market trends to provide investment recommendations and price targets to investors.',
      analogy: 'An analyst is like a professional food critic who tastes dishes (analyzes companies) and writes reviews with ratings (buy/sell recommendations) to help diners (investors) choose where to eat.'
    },
    'rating': {
      definition: 'A rating is an analyst\'s recommendation on a stock, typically expressed as Buy, Hold, or Sell, based on their analysis of the company\'s prospects and valuation.',
      analogy: 'A rating is like a movie review - critics watch the film (analyze the company) and give it thumbs up (buy), thumbs sideways (hold), or thumbs down (sell) to guide your viewing choices.'
    },
    'target price': {
      definition: 'A target price is an analyst\'s projection of where a stock\'s price should be in the next 12 months, based on their valuation models and assumptions.',
      analogy: 'A target price is like a GPS destination - it\'s where the analyst thinks the stock should end up, though the actual route and arrival time might be different than expected.'
    },
    'consensus': {
      definition: 'Consensus refers to the average of all analyst estimates for metrics like earnings, revenue, or price targets, representing the collective market expectation.',
      analogy: 'Consensus is like asking 10 friends to guess how many jellybeans are in a jar and taking the average. It\'s often more accurate than any single guess, but still might be wrong.'
    }
  }

  const handleSearch = async () => {
    if (!term.trim()) {
      setError('Please enter a term to search')
      return
    }

    setLoading(true)
    setError('')
    setDefinition('')
    setAnalogy('')
    setHasSearched(false)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const searchTerm = term.trim().toLowerCase()
      const response = simulatedResponses[searchTerm]

      if (response) {
        setDefinition(response.definition)
        setAnalogy(response.analogy)
        setHasSearched(true)

        // Record learning activity for achievements
        await recordLearningActivity('term_searched', 5)
      } else {
        // Fallback for terms not in our database
        setDefinition(`${term} is an important investment concept. While we don't have a detailed explanation for this specific term yet, we recommend checking our learning articles or consulting financial education resources for more information.`)
        setAnalogy(`Think of learning about ${term} like building a puzzle - each new concept you understand helps complete the bigger picture of investing knowledge.`)
        setHasSearched(true)
        await recordLearningActivity('term_searched', 2)
      }

    } catch (err) {
      console.error('Error in simulated search:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearResults = () => {
    setTerm('')
    setDefinition('')
    setAnalogy('')
    setError('')
    setHasSearched(false)
  }

  const popularTerms = [
    'Dividend', 'Bull Market', 'P/E Ratio', 'ETF', 'Volatility', 'Diversification',
    'Compound Interest', 'Dollar Cost Averaging', 'Market Cap', 'Beta', 'REIT',
    'Index Fund', 'Blue Chip', 'Growth Stock', 'Value Stock', 'Options'
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-purple-50 rounded-full mr-3">
          <Lightbulb className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI Term Explainer</h2>
          <p className="text-sm text-gray-600">Get instant explanations for any investment term</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Enter any investment term (e.g., 'compound interest', 'ETF', 'bull market')"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !term.trim()}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Explain'
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3 text-purple-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg font-medium">Getting AI explanation...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && definition && analogy && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              "{term}"
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                +5 Learning Points
              </span>
              <button
                onClick={clearResults}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Definition */}
          <div className="bg-blue-50 rounded-lg p-5">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-full mr-4 flex-shrink-0">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Definition</h4>
                <p className="text-blue-800 leading-relaxed">{definition}</p>
              </div>
            </div>
          </div>

          {/* Analogy */}
          <div className="bg-green-50 rounded-lg p-5">
            <div className="flex items-start">
              <div className="p-2 bg-green-100 rounded-full mr-4 flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Real-World Analogy</h4>
                <p className="text-green-800 leading-relaxed">{analogy}</p>
              </div>
            </div>
          </div>

          {/* Helpful Note */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 text-center">
              💡 <strong>Tip:</strong> Try searching for terms like "diversification", "market cap", "yield", or any other investment concept you're curious about!
            </p>
          </div>
        </div>
      )}

      {/* Empty State with Popular Terms */}
      {!hasSearched && !loading && !error && (
        <div className="text-center py-8">
          <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Learn?</h3>
          <p className="text-gray-600 mb-6">
            Enter any investment term above and get an instant AI-powered explanation with real-world analogies.
          </p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Terms to Try:</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {popularTerms.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setTerm(suggestion)}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            Our AI can explain over 100+ investment terms with simple analogies!
          </p>
        </div>
      )}
    </div>
  )
}

export default GlossarySearch