// =====================================================
// API Route: Product Recommendations with Caching
// High-performance cached recommendations endpoint
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { CacheManager, CacheKeys, getCachedRecommendations, getCacheHeaders } from '@/lib/cache'
import { SmartRecommendationEngine, createRecommendationEngine, UserPreferences, QuestionnaireData } from '@/lib/recommendations'
import { LightingProduct } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionnaireId = searchParams.get('questionnaire_id')
    
    if (!questionnaireId) {
      return NextResponse.json(
        { error: 'questionnaire_id is required' },
        { status: 400 }
      )
    }

    // Initialize Supabase client
    const cookieStore = await cookies()
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

    // Get cached recommendations or generate using smart algorithm
    const recommendations = await getCachedRecommendations(
      questionnaireId,
      async () => {
        // Get questionnaire data
        const { data: questionnaireData, error: qError } = await supabase
          .from('questionnaire_responses')
          .select('*')
          .eq('id', questionnaireId)
          .single()
        
        if (qError) throw qError

        // Get all products
        const { data: products, error: pError } = await supabase
          .from('lighting_products')
          .select('*')
        
        if (pError) throw pError

        // Get user interaction data if available
        const userId = questionnaireData.user_id
        let userFavorites: string[] = []
        let userInteractions: any[] = []
        
        if (userId) {
          const { data: favorites } = await supabase
            .from('user_favorites')
            .select('product_id')
            .eq('user_id', userId)
          
          userFavorites = favorites?.map(f => f.product_id) || []
          
          // Get user interaction history (if you have this table)
          // const { data: interactions } = await supabase
          //   .from('user_interactions')
          //   .select('*')
          //   .eq('user_id', userId)
          //   .order('created_at', { ascending: false })
          //   .limit(100)
          // userInteractions = interactions || []
        }

        // Prepare user preferences
        const userPreferences: UserPreferences = {
          userId: userId,
          questionnaire: {
            room_type: questionnaireData.room_type,
            room_size: questionnaireData.room_size,
            style_preference: questionnaireData.style_preference,
            budget_min: questionnaireData.budget_min,
            budget_max: questionnaireData.budget_max
          },
          favoriteHistory: userFavorites
        }

        // Create recommendation engine and generate recommendations
        const engine = createRecommendationEngine(products, 'DEFAULT')
        const results = await engine.generateRecommendations(userPreferences)
        
        // Convert results to expected format
        return results.map(result => ({
          ...result.product,
          recommendation_score: result.score,
          recommendation_confidence: result.confidence,
          recommendation_reasons: result.reasons,
          recommendation_category: result.category
        }))
      }
    )

    // Track cache performance
    await CacheManager.incr(`api_calls:recommendations:${new Date().getHours()}`, 3600)

    return NextResponse.json(
      {
        success: true,
        data: recommendations,
        cache_key: CacheKeys.PRODUCT_RECOMMENDATIONS(questionnaireId),
        total: recommendations.length
      },
      { 
        status: 200,
        headers: getCacheHeaders('api')
      }
    )

  } catch (error) {
    console.error('Recommendations API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recommendations',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// =====================================================
// POST: Create new questionnaire and get recommendations
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { room_type, room_size, style_preference, budget_min, budget_max, user_id } = body

    // Validate required fields
    if (!room_type || !room_size || !style_preference || !budget_min || !budget_max) {
      return NextResponse.json(
        { error: 'Missing required questionnaire fields' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
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

    // Create questionnaire response
    const { data: questionnaire, error: questionnaireError } = await supabase
      .from('questionnaire_responses')
      .insert({
        user_id: user_id || null,
        room_type,
        room_size,
        style_preference,
        budget_min: parseInt(budget_min),
        budget_max: parseInt(budget_max),
        recommendations_generated: false
      })
      .select('id')
      .single()

    if (questionnaireError) throw questionnaireError

    // Generate recommendations immediately using smart algorithm
    const recommendations = await getCachedRecommendations(
      questionnaire.id,
      async () => {
        // Get all products
        const { data: products, error: pError } = await supabase
          .from('lighting_products')
          .select('*')
        
        if (pError) throw pError

        // Prepare user preferences from form data
        const userPreferences: UserPreferences = {
          userId: user_id,
          questionnaire: {
            room_type,
            room_size,
            style_preference,
            budget_min: parseInt(budget_min),
            budget_max: parseInt(budget_max)
          }
        }

        // Create recommendation engine and generate recommendations
        const engine = createRecommendationEngine(products, 'DEFAULT')
        const results = await engine.generateRecommendations(userPreferences)

        // Update questionnaire as processed
        await supabase
          .from('questionnaire_responses')
          .update({ 
            recommendations_generated: true,
            recommendation_count: results.length
          })
          .eq('id', questionnaire.id)

        // Convert results to expected format
        return results.map(result => ({
          ...result.product,
          recommendation_score: result.score,
          recommendation_confidence: result.confidence,
          recommendation_reasons: result.reasons,
          recommendation_category: result.category
        }))
      }
    )

    return NextResponse.json(
      {
        success: true,
        questionnaire_id: questionnaire.id,
        recommendations,
        total: recommendations.length
      },
      { 
        status: 201,
        headers: getCacheHeaders('api')
      }
    )

  } catch (error) {
    console.error('Create questionnaire error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create questionnaire and recommendations',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}