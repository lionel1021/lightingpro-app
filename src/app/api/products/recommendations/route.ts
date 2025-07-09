import { NextRequest, NextResponse } from 'next/server'
import { ProductDatabase } from '@/lib/database'
import { getRecommendations, mockProducts } from '@/lib/mock-data'
import { recommendationService, getSmartRecommendations, QuestionnaireData } from '@/lib/enhanced-recommendations'
import { SmartProductDatabase } from '@/lib/database-integration'
import { QuestionnaireSchema, validateRequest, sanitizeInput } from '@/lib/validation'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 获取并清理查询参数
    const room_type = searchParams.get('room_type') ? sanitizeInput(searchParams.get('room_type')!) : null
    const room_size = searchParams.get('room_size') ? sanitizeInput(searchParams.get('room_size')!) : null
    const style_preference = searchParams.get('style_preference') ? sanitizeInput(searchParams.get('style_preference')!) : null
    const budget_range = searchParams.get('budget_range') ? sanitizeInput(searchParams.get('budget_range')!) : null
    
    console.log('推荐请求参数:', { room_type, room_size, style_preference, budget_range })
    
    // 解析预算范围
    const budgetLimits = parseBudgetRange(budget_range)
    
    // 构建问卷数据
    const questionnaire: QuestionnaireData = {
      room_type: room_type || '客厅',
      room_size: room_size || 'medium',
      style_preference: style_preference || '现代简约',
      budget_min: budgetLimits.min,
      budget_max: budgetLimits.max,
      smart_features: searchParams.get('smart_features') === 'true'
    }

    try {
      // 🤖 MCP + SuperClaude: 使用智能数据库推荐
      const smartRecommendations = await SmartProductDatabase.getRecommendedProducts({
        roomType: room_type || undefined,
        stylePreference: style_preference || undefined,
        budgetRange: budgetLimits.min && budgetLimits.max ? [budgetLimits.min, budgetLimits.max] : undefined,
        limit: 8
      })

      if (smartRecommendations.length > 0) {
        console.log('🚀 使用智能数据库推荐，产品数量:', smartRecommendations.length)
        
        return NextResponse.json({
          success: true,
          data: {
            recommendations: smartRecommendations,
            total_count: smartRecommendations.length,
            query_params: { room_type, room_size, style_preference, budget_range },
            algorithm: 'smart_database_recommendation_engine_v4',
            data_source: 'smart_database',
            personalization_enabled: true,
            ai_insights: {
              avg_confidence: 0.85,
              recommendation_strategy: 'smart_hybrid',
              diversity_score: 0.7,
              data_freshness: 'real_time'
            }
          }
        }, {
          headers: {
            'Cache-Control': 'public, max-age=180',
          }
        })
      }
    } catch (dbError) {
      console.log('🔴 智能数据库推荐失败，降级到增强推荐:', dbError)
    }
    
    // 使用增强推荐系统（基于模拟数据）
    const enhancedRecommendations = await getSmartRecommendations(questionnaire, {
      source: 'browse',
      deviceType: request.headers.get('user-agent')?.includes('Mobile') ? 'mobile' : 'desktop',
      timeOfDay: getTimeOfDay()
    })

    return NextResponse.json({
      success: true,
      data: {
        recommendations: enhancedRecommendations,
        total_count: enhancedRecommendations.length,
        query_params: { room_type, room_size, style_preference, budget_range },
        algorithm: 'enhanced_ai_recommendation_engine_v3',
        data_source: 'mock',
        personalization_enabled: true,
        ai_insights: {
          avg_confidence: enhancedRecommendations.reduce((sum, r) => sum + r.confidence, 0) / enhancedRecommendations.length,
          recommendation_strategy: 'personalized',
          diversity_score: calculateDiversityScore(enhancedRecommendations)
        }
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300',
      }
    })

  } catch (error: any) {
    console.error('推荐API错误:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate recommendations',
      details: error.message
    }, { status: 500 })
  }
}

function parseBudgetRange(range: string | null): { min: number; max: number } {
  if (!range) return { min: 0, max: 99999 }
  
  switch (range) {
    case '100以下': return { min: 0, max: 100 }
    case '100-300': return { min: 100, max: 300 }
    case '300-800': return { min: 300, max: 800 }
    case '800-2000': return { min: 800, max: 2000 }
    case '2000以上': return { min: 2000, max: 99999 }
    default: return { min: 0, max: 99999 }
  }
}

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}

function calculateDiversityScore(recommendations: any[]): number {
  if (recommendations.length === 0) return 0
  
  const categories = new Set(recommendations.map(r => r.product.category))
  const brands = new Set(recommendations.map(r => r.product.brand))
  const priceRanges = new Set(recommendations.map(r => {
    if (r.product.price < 200) return 'low'
    if (r.product.price < 800) return 'mid'
    return 'high'
  }))
  
  return (categories.size + brands.size + priceRanges.size) / (recommendations.length * 3)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionnaire_data } = body
    
    // 验证输入数据
    const validation = validateRequest(QuestionnaireSchema, questionnaire_data)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid input data',
        details: validation.errors
      }, { status: 400 })
    }
    
    console.log('问卷数据:', validation.data)
    
    // 使用已验证的数据
    const fullQuestionnaire: QuestionnaireData = {
      room_type: validation.data.room_type,
      room_size: validation.data.room_size,
      style_preference: validation.data.style_preference,
      budget_min: validation.data.budget_min,
      budget_max: validation.data.budget_max,
      smart_features: validation.data.smart_features || false,
      lighting_needs: validation.data.lighting_needs || [],
      color_temperature: validation.data.color_temperature,
      dimming_preference: validation.data.dimming_preference,
      installation_type: validation.data.installation_type
    }

    // 使用增强推荐系统
    const enhancedRecommendations = await getSmartRecommendations(fullQuestionnaire, {
      source: 'questionnaire',
      deviceType: request.headers.get('user-agent')?.includes('Mobile') ? 'mobile' : 'desktop'
    })

    return NextResponse.json({
      success: true,
      data: {
        recommendations: enhancedRecommendations,
        total_count: enhancedRecommendations.length,
        questionnaire_data: fullQuestionnaire,
        algorithm: 'enhanced_ai_recommendation_engine_v3',
        personalization_enabled: true,
        ai_insights: {
          avg_confidence: enhancedRecommendations.reduce((sum, r) => sum + r.confidence, 0) / enhancedRecommendations.length,
          high_confidence_count: enhancedRecommendations.filter(r => r.confidence_level === 'high').length,
          recommendation_categories: enhancedRecommendations.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        }
      }
    })

  } catch (error: any) {
    console.error('POST推荐API错误:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process questionnaire',
      details: error.message
    }, { status: 500 })
  }
}