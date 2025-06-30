import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface NewsRequest {
  category?: string
  limit?: number
  offset?: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { category, limit = 20, offset = 0 } = await req.json() as NewsRequest

    // Get cached news articles
    let query = supabaseClient
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: cachedNews, error } = await query

    if (error) {
      throw error
    }

    // In production, you would also fetch fresh news from external APIs
    // and cache them in the database. For demo, we'll use cached data.
    
    // Simulate fetching fresh news (in production, integrate with NewsAPI, Finnhub, etc.)
    const freshNews = await fetchFreshNews(category)
    
    // Combine cached and fresh news
    const allNews = [...freshNews, ...(cachedNews || [])]
    
    return new Response(
      JSON.stringify({ 
        news: allNews.slice(0, limit),
        total: allNews.length,
        hasMore: allNews.length > offset + limit
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('News feed error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function fetchFreshNews(category?: string) {
  // Mock fresh news - in production, integrate with real news APIs
  const mockNews = [
    {
      id: 'fresh-1',
      title: 'Market Opens Higher on Positive Economic Data',
      url: 'https://example.com/market-higher',
      image_url: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400',
      snippet: 'Stock markets opened higher today following the release of positive economic indicators.',
      source: 'Financial News',
      published_at: new Date().toISOString(),
      category: 'market'
    },
    {
      id: 'fresh-2',
      title: 'Cryptocurrency Market Shows Signs of Recovery',
      url: 'https://example.com/crypto-recovery',
      image_url: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=400',
      snippet: 'Major cryptocurrencies are showing signs of recovery after weeks of volatility.',
      source: 'Crypto Daily',
      published_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      category: 'crypto'
    }
  ]

  return category ? mockNews.filter(news => news.category === category) : mockNews
}