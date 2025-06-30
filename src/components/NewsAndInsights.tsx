import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Newspaper, 
  ExternalLink, 
  Clock, 
  Filter,
  BookOpen,
  TrendingUp,
  Globe,
  Star,
  Eye
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface NewsArticle {
  id: string
  title: string
  url: string
  image_url?: string
  snippet: string
  source: string
  published_at: string
  category: string
}

interface EducationalContent {
  id: string
  title: string
  content: string
  author: string
  published_at: string
  topic: string
  image_url?: string
  read_time_minutes: number
  is_featured: boolean
}

const NewsAndInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'insights'>('news')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [news, setNews] = useState<NewsArticle[]>([])
  const [insights, setInsights] = useState<EducationalContent[]>([])
  const [loading, setLoading] = useState(true)

  const newsCategories = [
    { key: 'all', label: 'All News', icon: Globe },
    { key: 'market', label: 'Market Updates', icon: TrendingUp },
    { key: 'economy', label: 'Economy', icon: Newspaper },
    { key: 'company', label: 'Company News', icon: BookOpen },
    { key: 'commodities', label: 'Commodities', icon: Star }
  ]

  useEffect(() => {
    fetchNewsAndInsights()
  }, [selectedCategory])

  const fetchNewsAndInsights = async () => {
    setLoading(true)
    try {
      // Fetch news from edge function using Supabase client
      try {
        const { data: newsData, error: newsError } = await supabase.functions.invoke('news-feed', {
          body: { 
            category: selectedCategory === 'all' ? undefined : selectedCategory,
            limit: 20 
          }
        })
        
        if (newsError) {
          console.error('News fetch error:', newsError)
        } else {
          setNews(newsData?.news || [])
        }
      } catch (newsError) {
        console.error('Error fetching news:', newsError)
        // Set empty array if news fetch fails
        setNews([])
      }

      // Fetch educational content from Supabase
      const { data: insightsData, error: insightsError } = await supabase
        .from('educational_content')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10)

      if (insightsError) {
        console.error('Insights fetch error:', insightsError)
        setInsights([])
      } else {
        setInsights(insightsData || [])
      }
    } catch (error) {
      console.error('Error fetching news and insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      market: 'bg-blue-100 text-blue-800',
      economy: 'bg-green-100 text-green-800',
      company: 'bg-purple-100 text-purple-800',
      commodities: 'bg-yellow-100 text-yellow-800',
      crypto: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Newspaper className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">News & Insights</h2>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'news'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Globe className="h-4 w-4 inline mr-2" />
            News
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'insights'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Insights
          </motion.button>
        </div>
      </div>

      {/* Category Filter for News */}
      {activeTab === 'news' && (
        <div className="flex flex-wrap gap-2 mb-6">
          {newsCategories.map((category) => {
            const Icon = category.icon
            return (
              <motion.button
                key={category.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{category.label}</span>
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Content Area */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'news' ? (
          <div className="space-y-4">
            {news.length === 0 ? (
              <div className="text-center py-8">
                <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No news articles available</p>
              </div>
            ) : (
              news.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {article.title}
                      </h3>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </motion.a>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {article.snippet}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">{article.source}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(article.published_at)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No insights available</p>
              </div>
            ) : (
              insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    {insight.image_url && (
                      <img
                        src={insight.image_url}
                        alt={insight.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {insight.title}
                        </h3>
                        {insight.is_featured && (
                          <Star className="h-4 w-4 text-yellow-500 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                        {insight.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {insight.topic}
                          </span>
                          <span className="text-xs text-gray-500">by {insight.author}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{insight.read_time_minutes} min read</span>
                          </div>
                          <span>{formatTimeAgo(insight.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* View More Button */}
      <div className="mt-6 text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          View More {activeTab === 'news' ? 'News' : 'Insights'}
        </motion.button>
      </div>
    </div>
  )
}

export default NewsAndInsights