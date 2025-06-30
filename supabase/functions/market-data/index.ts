import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface MarketDataRequest {
  symbols?: string[]
  type?: 'quote' | 'historical' | 'search'
  period?: '1D' | '1W' | '1M' | '3M' | '1Y'
  query?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { symbols, type = 'quote', period = '1D', query } = await req.json() as MarketDataRequest

    // For demo purposes, we'll return mock data
    // In production, you would integrate with real APIs like Alpha Vantage, Finnhub, etc.
    
    if (type === 'search' && query) {
      // Search for investment options
      const { data: searchResults } = await supabaseClient
        .from('investment_options')
        .select('*')
        .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
        .eq('is_active', true)
        .limit(10)

      return new Response(
        JSON.stringify({ results: searchResults }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (type === 'historical' && symbols) {
      // Generate mock historical data
      const historicalData = symbols.map(symbol => ({
        symbol,
        data: generateMockHistoricalData(period)
      }))

      return new Response(
        JSON.stringify({ historical: historicalData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (type === 'quote' && symbols) {
      // Get current quotes from database and add some mock real-time updates
      const { data: quotes } = await supabaseClient
        .from('investment_options')
        .select('*')
        .in('symbol', symbols)

      const updatedQuotes = quotes?.map(quote => ({
        ...quote,
        current_price: addRandomVariation(quote.current_price),
        price_change: addRandomVariation(quote.price_change, 0.5),
        price_change_percent: addRandomVariation(quote.price_change_percent, 0.1),
        last_updated: new Date().toISOString()
      }))

      return new Response(
        JSON.stringify({ quotes: updatedQuotes }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request parameters' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Market data error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateMockHistoricalData(period: string) {
  const dataPoints = period === '1D' ? 24 : period === '1W' ? 7 : period === '1M' ? 30 : period === '3M' ? 90 : 365
  const data = []
  let basePrice = 100 + Math.random() * 400
  
  for (let i = 0; i < dataPoints; i++) {
    const date = new Date()
    if (period === '1D') {
      date.setHours(date.getHours() - (dataPoints - i))
    } else {
      date.setDate(date.getDate() - (dataPoints - i))
    }
    
    basePrice += (Math.random() - 0.5) * 5
    data.push({
      timestamp: date.toISOString(),
      price: Math.max(basePrice, 1),
      volume: Math.floor(Math.random() * 1000000)
    })
  }
  
  return data
}

function addRandomVariation(value: number, maxVariation: number = 2) {
  const variation = (Math.random() - 0.5) * maxVariation
  return Math.max(value + variation, 0.01)
}