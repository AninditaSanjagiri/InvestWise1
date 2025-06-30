import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  BookOpen, 
  Star, 
  Filter, 
  Clock,
  User,
  Tag,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  X,
  Eye,
  ThumbsUp
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import GlossarySearch from '../components/GlossarySearch'
import LoadingSpinner from '../components/LoadingSpinner'

interface LearningContent {
  id: string
  title: string
  content_type: string
  category: string
  body: string
  keywords: string[]
  reading_time_minutes: number
  associated_risk_profile: string
  created_at: string
}

const Learn: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedContentType, setSelectedContentType] = useState('All')
  const [learningContent, setLearningContent] = useState<LearningContent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContent, setSelectedContent] = useState<LearningContent | null>(null)
  const [showContentModal, setShowContentModal] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [readArticles, setReadArticles] = useState<string[]>([])

  useEffect(() => {
    fetchLearningContent()
    // Load favorites and read articles from localStorage
    const savedFavorites = localStorage.getItem('learning_favorites')
    const savedReadArticles = localStorage.getItem('read_articles')
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedReadArticles) setReadArticles(JSON.parse(savedReadArticles))
  }, [])

  const fetchLearningContent = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('learning_content')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLearningContent(data || [])
    } catch (error) {
      console.error('Error fetching learning content:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...Array.from(new Set(learningContent.map(content => content.category)))]
  const contentTypes = ['All', ...Array.from(new Set(learningContent.map(content => content.content_type)))]

  const filteredContent = learningContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || content.category === selectedCategory
    const matchesType = selectedContentType === 'All' || content.content_type === selectedContentType
    
    return matchesSearch && matchesCategory && matchesType
  })

  const toggleFavorite = (contentId: string) => {
    const newFavorites = favorites.includes(contentId)
      ? favorites.filter(id => id !== contentId)
      : [...favorites, contentId]
    
    setFavorites(newFavorites)
    localStorage.setItem('learning_favorites', JSON.stringify(newFavorites))
  }

  const markAsRead = (contentId: string) => {
    if (!readArticles.includes(contentId)) {
      const newReadArticles = [...readArticles, contentId]
      setReadArticles(newReadArticles)
      localStorage.setItem('read_articles', JSON.stringify(newReadArticles))
    }
  }

  const openContentModal = (content: LearningContent) => {
    setSelectedContent(content)
    setShowContentModal(true)
    markAsRead(content.id)
  }

  const getRiskProfileIcon = (profile: string) => {
    switch (profile?.toLowerCase()) {
      case 'conservative': return Shield
      case 'moderate': return TrendingUp
      case 'aggressive': return Zap
      default: return BookOpen
    }
  }

  const getRiskProfileColor = (profile: string) => {
    switch (profile?.toLowerCase()) {
      case 'conservative': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-blue-600 bg-blue-100'
      case 'aggressive': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'FAQ': return Lightbulb
      case 'Article': return BookOpen
      case 'Deep Dive': return TrendingUp
      case 'Interactive Guide': return Star
      default: return BookOpen
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'FAQ': return 'bg-yellow-100 text-yellow-800'
      case 'Article': return 'bg-blue-100 text-blue-800'
      case 'Deep Dive': return 'bg-purple-100 text-purple-800'
      case 'Interactive Guide': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading learning content..." />
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Enhanced Header with Animation */}
      <motion.div
        variants={itemVariants}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 200,
            damping: 15
          }}
          className="inline-flex items-center space-x-3 mb-4"
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"
          >
            <BookOpen className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Investment Learning Center
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Master investment concepts with AI-powered explanations, comprehensive articles, and expert insights
        </motion.p>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Learning Articles', value: learningContent.length, icon: BookOpen, color: 'blue' },
          { label: 'Categories', value: categories.length - 1, icon: Filter, color: 'green' },
          { label: 'Your Favorites', value: favorites.length, icon: Star, color: 'yellow' },
          { label: 'Articles Read', value: readArticles.length, icon: Eye, color: 'purple' }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <motion.p 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                    className="text-3xl font-bold text-gray-900"
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-3 bg-${stat.color}-50 rounded-full`}
                >
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* AI Term Explainer with Enhanced Design */}
      <motion.div
        variants={itemVariants}
        className="relative"
      >
        <motion.div 
          animate={{ 
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"
        />
        <div className="relative">
          <GlossarySearch />
        </div>
      </motion.div>

      {/* Enhanced Search and Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="space-y-4">
          <motion.div 
            whileFocus={{ scale: 1.02 }}
            className="relative"
          >
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </motion.div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </motion.select>
            </div>
            
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {contentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </motion.select>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredContent.map((content, index) => {
            const ContentTypeIcon = getContentTypeIcon(content.content_type)
            const RiskIcon = getRiskProfileIcon(content.associated_risk_profile)
            const isRead = readArticles.includes(content.id)
            const isFavorite = favorites.includes(content.id)
            
            return (
              <motion.div
                key={content.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => openContentModal(content)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`p-2 rounded-full ${getContentTypeColor(content.content_type)}`}
                      >
                        <ContentTypeIcon className="h-4 w-4" />
                      </motion.div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getContentTypeColor(content.content_type)}`}>
                        {content.content_type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isRead && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-1 bg-green-100 rounded-full"
                        >
                          <Eye className="h-3 w-3 text-green-600" />
                        </motion.div>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(content.id)
                        }}
                        className={`p-1 rounded-full transition-colors ${
                          isFavorite
                            ? 'text-yellow-500 bg-yellow-100'
                            : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                        }`}
                      >
                        <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {content.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {content.body.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{content.reading_time_minutes} min read</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{content.category}</span>
                    </div>
                    
                    {content.associated_risk_profile && (
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getRiskProfileColor(content.associated_risk_profile)}`}>
                        <RiskIcon className="h-3 w-3" />
                        <span>{content.associated_risk_profile}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-1">
                      {content.keywords.slice(0, 3).map((keyword, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          <Tag className="h-2 w-2 mr-1" />
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-blue-600 text-sm font-medium"
                    >
                      Read More
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredContent.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">No content found</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Enhanced Content Modal */}
      <AnimatePresence>
        {showContentModal && selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowContentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-2 rounded-full ${getContentTypeColor(selectedContent.content_type)}`}
                  >
                    {(() => {
                      const Icon = getContentTypeIcon(selectedContent.content_type)
                      return <Icon className="h-5 w-5" />
                    })()}
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedContent.title}</h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{selectedContent.category}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{selectedContent.reading_time_minutes} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(selectedContent.id)}
                    className={`p-2 rounded-full transition-colors ${
                      favorites.includes(selectedContent.id)
                        ? 'text-yellow-500 bg-yellow-100'
                        : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                    }`}
                  >
                    <Star className={`h-5 w-5 ${favorites.includes(selectedContent.id) ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowContentModal(false)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="prose prose-lg max-w-none"
                >
                  {selectedContent.body.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <motion.h3 
                          key={index} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-xl font-semibold text-gray-900 mt-6 mb-3"
                        >
                          {paragraph.replace(/\*\*/g, '')}
                        </motion.h3>
                      )
                    }
                    if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                      const [title, ...content] = paragraph.split(':**')
                      return (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="mb-4"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {title.replace(/\*\*/g, '')}:
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {content.join(':**')}
                          </p>
                        </motion.div>
                      )
                    }
                    return (
                      <motion.p 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-gray-700 leading-relaxed mb-4"
                      >
                        {paragraph}
                      </motion.p>
                    )
                  })}
                </motion.div>
                
                {selectedContent.keywords.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 pt-6 border-t border-gray-200"
                  >
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Related Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.keywords.map((keyword, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {keyword}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Learn