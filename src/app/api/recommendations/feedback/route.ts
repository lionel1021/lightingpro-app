// =====================================================
// API Route: Recommendation Feedback Collection
// 收集用户对推荐结果的反馈，用于算法优化
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { UserFeedback } from '@/lib/recommendation-trainer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      questionnaireId, 
      productId, 
      feedbackType, 
      viewDuration, 
      rating, 
      reasonCode 
    } = body

    // Validate required fields
    if (!questionnaireId || !productId || !feedbackType) {
      return NextResponse.json(
        { error: 'Missing required fields: questionnaireId, productId, feedbackType' },
        { status: 400 }
      )
    }

    // Validate feedback type
    const validFeedbackTypes = ['view', 'click', 'favorite', 'purchase', 'ignore', 'dislike']
    if (!validFeedbackTypes.includes(feedbackType)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Store feedback in database
    const feedback: UserFeedback = {
      userId: userId || null,
      questionnaireId,
      productId,
      feedbackType,
      timestamp: new Date(),
      viewDuration: viewDuration || null,
      rating: rating || null,
      reasonCode: reasonCode || null
    }

    const { data, error } = await supabase
      .from('recommendation_feedback')
      .insert({
        user_id: feedback.userId,
        questionnaire_id: feedback.questionnaireId,
        product_id: feedback.productId,
        feedback_type: feedback.feedbackType,
        created_at: feedback.timestamp.toISOString(),
        view_duration: feedback.viewDuration,
        rating: feedback.rating,
        reason_codes: feedback.reasonCode
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to store feedback:', error)
      return NextResponse.json(
        { error: 'Failed to store feedback' },
        { status: 500 }
      )
    }

    // Update recommendation performance metrics (optional)
    if (feedbackType === 'purchase') {
      await updateRecommendationMetrics(supabase, questionnaireId, 'conversion')
    } else if (feedbackType === 'click') {
      await updateRecommendationMetrics(supabase, questionnaireId, 'click')
    }

    return NextResponse.json({
      success: true,
      feedbackId: data.id,
      message: 'Feedback recorded successfully'
    })

  } catch (error) {
    console.error('Feedback API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to record feedback',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// GET: Retrieve feedback analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionnaireId = searchParams.get('questionnaire_id')
    const userId = searchParams.get('user_id')
    const timeRange = searchParams.get('time_range') || '7d' // 7d, 30d, 90d

    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Calculate time filter
    const timeFilter = new Date()
    switch (timeRange) {
      case '7d':
        timeFilter.setDate(timeFilter.getDate() - 7)
        break
      case '30d':
        timeFilter.setDate(timeFilter.getDate() - 30)
        break
      case '90d':
        timeFilter.setDate(timeFilter.getDate() - 90)
        break
    }

    // Build query
    let query = supabase
      .from('recommendation_feedback')
      .select('*')
      .gte('created_at', timeFilter.toISOString())

    if (questionnaireId) {
      query = query.eq('questionnaire_id', questionnaireId)
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: feedback, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    // Calculate analytics
    const analytics = calculateFeedbackAnalytics(feedback || [])

    return NextResponse.json({
      success: true,
      feedback: feedback || [],
      analytics,
      timeRange,
      totalRecords: feedback?.length || 0
    })

  } catch (error) {
    console.error('Feedback analytics API error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve feedback analytics',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// Helper function to update recommendation metrics
async function updateRecommendationMetrics(
  supabase: any,
  questionnaireId: string,
  metricType: 'click' | 'conversion'
) {
  try {
    // Get current metrics
    const { data: existing } = await supabase
      .from('recommendation_metrics')
      .select('*')
      .eq('questionnaire_id', questionnaireId)
      .single()

    if (existing) {
      // Update existing metrics
      const updates: any = {
        updated_at: new Date().toISOString()
      }

      if (metricType === 'click') {
        updates.total_clicks = (existing.total_clicks || 0) + 1
        updates.click_through_rate = updates.total_clicks / (existing.total_impressions || 1)
      } else if (metricType === 'conversion') {
        updates.total_conversions = (existing.total_conversions || 0) + 1
        updates.conversion_rate = updates.total_conversions / (existing.total_clicks || 1)
      }

      await supabase
        .from('recommendation_metrics')
        .update(updates)
        .eq('questionnaire_id', questionnaireId)
    } else {
      // Create new metrics record
      await supabase
        .from('recommendation_metrics')
        .insert({
          questionnaire_id: questionnaireId,
          total_impressions: 1,
          total_clicks: metricType === 'click' ? 1 : 0,
          total_conversions: metricType === 'conversion' ? 1 : 0,
          click_through_rate: metricType === 'click' ? 1.0 : 0.0,
          conversion_rate: metricType === 'conversion' ? 1.0 : 0.0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error('Failed to update recommendation metrics:', error)
  }
}

// Helper function to calculate feedback analytics
function calculateFeedbackAnalytics(feedback: any[]) {
  const total = feedback.length
  
  if (total === 0) {
    return {
      totalFeedback: 0,
      feedbackByType: {},
      averageRating: 0,
      averageViewDuration: 0,
      conversionRate: 0,
      clickThroughRate: 0
    }
  }

  // Count feedback by type
  const feedbackByType = feedback.reduce((acc, f) => {
    acc[f.feedback_type] = (acc[f.feedback_type] || 0) + 1
    return acc
  }, {})

  // Calculate average rating
  const ratingsWithValues = feedback.filter(f => f.rating !== null)
  const averageRating = ratingsWithValues.length > 0
    ? ratingsWithValues.reduce((sum, f) => sum + f.rating, 0) / ratingsWithValues.length
    : 0

  // Calculate average view duration
  const viewsWithDuration = feedback.filter(f => f.view_duration !== null)
  const averageViewDuration = viewsWithDuration.length > 0
    ? viewsWithDuration.reduce((sum, f) => sum + f.view_duration, 0) / viewsWithDuration.length
    : 0

  // Calculate rates
  const impressions = feedbackByType.view || 0
  const clicks = feedbackByType.click || 0
  const conversions = feedbackByType.purchase || 0

  const clickThroughRate = impressions > 0 ? clicks / impressions : 0
  const conversionRate = clicks > 0 ? conversions / clicks : 0

  return {
    totalFeedback: total,
    feedbackByType,
    averageRating: Math.round(averageRating * 100) / 100,
    averageViewDuration: Math.round(averageViewDuration * 100) / 100,
    conversionRate: Math.round(conversionRate * 10000) / 100, // Percentage with 2 decimals
    clickThroughRate: Math.round(clickThroughRate * 10000) / 100 // Percentage with 2 decimals
  }
}