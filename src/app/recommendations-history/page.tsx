'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Star, Trash2, RefreshCw, TrendingUp, Filter, Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// Mock recommendation history data in English
const mockRecommendationHistory = [
  {
    id: '1',
    user_id: 'user-1',
    session_id: 'session-1',
    questionnaire_data: {
      room_type: 'Living Room',
      room_size: 'large',
      style_preference: 'Modern',
      budget_min: 300,
      budget_max: 1000
    },
    recommendations: [
      {
        product: {
          id: '1',
          name: 'Modern LED Ceiling Light',
          brand: 'Philips',
          category: 'Ceiling Light',
          price: 299.00,
          description: 'Modern LED ceiling light suitable for living room and bedroom use, adjustable brightness, energy-saving.',
          rating: 4.5,
          review_count: 127,
          features: ['Dimmable', 'Smart Control', 'Energy Efficient', 'Modern Design'],
          image_urls: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400'],
          created_at: '2024-01-01T00:00:00Z'
        },
        score: 0.85,
        confidence: 0.9,
        reasons: ['Within budget', 'Matches modern style', 'Suitable for living room'],
        category: 'perfect_match' as const,
        priceRatio: 0.3,
        explanation: 'Recommended Modern LED Ceiling Light, fits your budget and matches modern style perfectly for your living room.',
        confidence_level: 'high' as const,
        personalization_strength: 0.8
      }
    ],
    created_at: '2024-01-15T10:30:00Z',
    feedback: {
      liked_products: ['1'],
      disliked_products: [],
      overall_satisfaction: 5,
      comments: 'Great recommendation, already purchased!'
    }
  },
  {
    id: '2',
    user_id: 'user-1',
    session_id: 'session-2',
    questionnaire_data: {
      room_type: 'Bedroom',
      room_size: 'medium',
      style_preference: 'Nordic',
      budget_min: 100,
      budget_max: 500
    },
    recommendations: [
      {
        product: {
          id: '3',
          name: 'Nordic Wood Table Lamp',
          brand: 'IKEA',
          category: 'Table Lamp',
          price: 199.00,
          description: 'Nordic style wooden table lamp, warm and comfortable, suitable for bedroom and study use.',
          rating: 4.7,
          review_count: 203,
          features: ['Wood Material', 'Nordic Design', 'Eye-care Light', 'Dimmable'],
          image_urls: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'],
          created_at: '2024-01-03T00:00:00Z'
        },
        score: 0.78,
        confidence: 0.85,
        reasons: ['Matches Nordic style', 'Suitable for bedroom', 'Reasonable price'],
        category: 'style_match' as const,
        priceRatio: 0.25,
        explanation: 'Recommended Nordic table lamp that matches your preferred Nordic style, perfect for your bedroom.',
        confidence_level: 'high' as const,
        personalization_strength: 0.7
      }
    ],
    created_at: '2024-01-10T14:20:00Z'
  }
]

export default function RecommendationHistoryPage() {
  const [historyData, setHistoryData] = useState(mockRecommendationHistory)
  const [filteredHistory, setFilteredHistory] = useState(mockRecommendationHistory)
  const [loading, setLoading] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all')
  const [selectedSatisfaction, setSelectedSatisfaction] = useState<string>('all')
  
  const router = useRouter()

  useEffect(() => {
    // Apply filters
    applyFilters()
  }, [historyData, selectedTimeRange, selectedSatisfaction])

  const applyFilters = () => {
    let filtered = [...historyData]
    
    // Time filter
    if (selectedTimeRange !== 'all') {
      const now = new Date()
      const days = parseInt(selectedTimeRange)
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(item => 
        new Date(item.created_at) >= cutoffDate
      )
    }
    
    // Satisfaction filter
    if (selectedSatisfaction !== 'all') {
      const minSatisfaction = parseInt(selectedSatisfaction)
      filtered = filtered.filter(item => 
        item.feedback && item.feedback.overall_satisfaction >= minSatisfaction
      )
    }
    
    setFilteredHistory(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleLikeProduct = async (historyId: string, productId: string) => {
    // Update user feedback
    setHistoryData(prev => prev.map(item => {
      if (item.id === historyId) {
        const feedback = item.feedback || {
          liked_products: [],
          disliked_products: [],
          overall_satisfaction: 3
        }
        
        const isLiked = feedback.liked_products.includes(productId)
        
        return {
          ...item,
          feedback: {
            ...feedback,
            liked_products: isLiked 
              ? feedback.liked_products.filter(id => id !== productId)
              : [...feedback.liked_products, productId],
            disliked_products: feedback.disliked_products.filter(id => id !== productId)
          }
        }
      }
      return item
    }))
  }

  const regenerateRecommendations = async (questionnaire: any) => {
    router.push('/questionnaire')
  }

  const deleteHistoryItem = (historyId: string) => {
    if (confirm('Are you sure you want to delete this recommendation history?')) {
      setHistoryData(prev => prev.filter(item => item.id !== historyId))
    }
  }

  // Statistics
  const stats = {
    totalRecommendations: historyData.length,
    totalProducts: historyData.reduce((sum, item) => sum + item.recommendations.length, 0),
    avgSatisfaction: historyData
      .filter(item => item.feedback)
      .reduce((sum, item) => sum + (item.feedback?.overall_satisfaction || 0), 0) / 
      historyData.filter(item => item.feedback).length || 0,
    likedProducts: historyData.reduce((sum, item) => 
      sum + (item.feedback?.liked_products.length || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recommendation history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recommendation History</h1>
              <p className="text-sm text-gray-500">View your personalized recommendation records and feedback</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => router.push('/questionnaire')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Recommendation
              </Button>
              <Button 
                onClick={() => router.push('/')}
                variant="outline"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Recommendations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRecommendations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Products Recommended</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.avgSatisfaction > 0 ? `${stats.avgSatisfaction.toFixed(1)}/5` : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Liked Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.likedProducts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Satisfaction</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedSatisfaction}
                  onChange={(e) => setSelectedSatisfaction(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSelectedTimeRange('all')
                    setSelectedSatisfaction('all')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation History List */}
        <div className="space-y-6">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendation history yet</h3>
                <p className="text-gray-500 mb-6">Start your first lighting recommendation!</p>
                <Button 
                  onClick={() => router.push('/questionnaire')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Recommendation
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((history) => (
              <Card key={history.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {history.questionnaire_data.room_type} • {history.questionnaire_data.style_preference}
                      </CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(history.created_at)}
                        </div>
                        <div>
                          Budget: ${history.questionnaire_data.budget_min} - ${history.questionnaire_data.budget_max}
                        </div>
                        <div>
                          Room size: {history.questionnaire_data.room_size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {history.feedback && (
                        <div className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          <Star className="h-4 w-4" />
                          {history.feedback.overall_satisfaction}/5
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateRecommendations(history.questionnaire_data)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteHistoryItem(history.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {history.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <img
                            src={rec.product.image_urls?.[0] || '/placeholder-product.jpg'}
                            alt={rec.product.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{rec.product.name}</h4>
                            <p className="text-sm text-gray-600">{rec.product.brand}</p>
                            <p className="text-lg font-bold text-green-600">${rec.product.price}</p>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                rec.confidence_level === 'high' ? 'bg-green-100 text-green-800' :
                                rec.confidence_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {rec.confidence_level === 'high' ? 'High Match' :
                                 rec.confidence_level === 'medium' ? 'Medium Match' : 'Low Match'}
                              </span>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`p-1 ${
                                  history.feedback?.liked_products.includes(rec.product.id)
                                    ? 'text-red-600'
                                    : 'text-gray-400'
                                }`}
                                onClick={() => handleLikeProduct(history.id, rec.product.id)}
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {rec.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {history.feedback?.comments && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Your feedback:</strong> {history.feedback.comments}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}