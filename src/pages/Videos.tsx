import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Search, 
  Filter,
  BookOpen,
  TrendingUp,
  DollarSign,
  PieChart,
  Star,
  X,
  ExternalLink,
  Volume2,
  Maximize,
  Users
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import LoadingSpinner from '../components/LoadingSpinner'

interface Video {
  id: string
  title: string
  youtube_id: string
  description: string
  category: string
  thumbnail_url: string
  duration_seconds: number
  views_count: number
  likes_count: number
  channel_name: string
  difficulty_level: string
  created_at: string
}

const Videos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [watchedVideos, setWatchedVideos] = useState<string[]>([])

  useEffect(() => {
    fetchVideos()
    // Load watched videos from localStorage
    const savedWatched = localStorage.getItem('watched_videos')
    if (savedWatched) setWatchedVideos(JSON.parse(savedWatched))
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('video_links')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Add thumbnail URLs for YouTube videos
      const videosWithThumbnails = data?.map(video => ({
        ...video,
        thumbnail_url: `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
      })) || []
      
      setVideos(videosWithThumbnails)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...Array.from(new Set(videos.map(video => video.category)))]
  const difficulties = ['All', ...Array.from(new Set(videos.map(video => video.difficulty_level)))]

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.channel_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || video.difficulty_level === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const markAsWatched = (videoId: string) => {
    if (!watchedVideos.includes(videoId)) {
      const newWatchedVideos = [...watchedVideos, videoId]
      setWatchedVideos(newWatchedVideos)
      localStorage.setItem('watched_videos', JSON.stringify(newWatchedVideos))
    }
  }

  const openVideoModal = (video: Video) => {
    setSelectedVideo(video)
    setShowVideoModal(true)
    markAsWatched(video.id)
  }

  const openInYouTube = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank')
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Beginner Basics': return BookOpen
      case 'Investment Strategy': return TrendingUp
      case 'Financial Analysis': return PieChart
      case 'Investment Types': return DollarSign
      default: return Play
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading educational videos..." />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center space-x-3 mb-4"
        >
          <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
            <Play className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Learning Videos
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Curated educational content from top financial educators to boost your investment knowledge
        </motion.p>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Videos', value: videos.length, icon: Play, color: 'red' },
          { label: 'Total Views', value: `${formatViews(videos.reduce((sum, v) => sum + v.views_count, 0))}`, icon: Eye, color: 'blue' },
          { label: 'Categories', value: categories.length - 1, icon: Filter, color: 'purple' },
          { label: 'Videos Watched', value: watchedVideos.length, icon: Star, color: 'green' }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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

      {/* Enhanced Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search videos by title, description, or channel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredVideos.map((video, index) => {
            const CategoryIcon = getCategoryIcon(video.category)
            const isWatched = watchedVideos.includes(video.id)
            
            return (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Enhanced Thumbnail */}
                <div className="relative cursor-pointer" onClick={() => openVideoModal(video)}>
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`
                      }}
                    />
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="bg-red-600 bg-opacity-90 rounded-full p-4 shadow-lg"
                    >
                      <Play className="h-8 w-8 text-white ml-1" />
                    </motion.div>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                    {formatDuration(video.duration_seconds)}
                  </div>
                  
                  {/* Watched Indicator */}
                  {isWatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Watched</span>
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="p-1 bg-red-50 rounded-full"
                      >
                        <CategoryIcon className="h-4 w-4 text-red-600" />
                      </motion.div>
                      <span className="text-xs font-medium text-red-600">{video.category}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(video.difficulty_level)}`}>
                      {video.difficulty_level}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span className="font-medium">{video.channel_name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(video.views_count)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{formatViews(video.likes_count)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openVideoModal(video)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Watch Now</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openInYouTube(video.youtube_id)}
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Open in YouTube"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filteredVideos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-500 mb-2">No videos found</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}

      {/* Enhanced Video Modal with Embedded YouTube Player */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-red-50 rounded-full">
                    <Play className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">{selectedVideo.channel_name}</span>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Eye className="h-3 w-3" />
                        <span>{formatViews(selectedVideo.views_count)} views</span>
                      </div>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(selectedVideo.duration_seconds)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openInYouTube(selectedVideo.youtube_id)}
                    className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Open in YouTube"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowVideoModal(false)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6">
                {/* YouTube Embed */}
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {/* Video Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(selectedVideo.difficulty_level)}`}>
                        {selectedVideo.difficulty_level}
                      </span>
                      <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                        {selectedVideo.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{formatViews(selectedVideo.likes_count)} likes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About this video</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedVideo.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 text-center"
      >
        <Play className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">More Content Coming Soon!</h3>
        <p className="text-gray-600 mb-4">
          We're constantly adding new educational videos from top financial educators and market experts.
        </p>
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <span>• Live Market Analysis</span>
          <span>• Expert Interviews</span>
          <span>• Case Studies</span>
          <span>• Interactive Tutorials</span>
        </div>
      </motion.div>
    </div>
  )
}

export default Videos