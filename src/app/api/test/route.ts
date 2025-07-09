import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  try {
    // 使用模拟数据进行测试
    const sampleProducts = mockProducts.slice(0, 5);

    return NextResponse.json({
      success: true,
      message: 'API is working with mock data!',
      data: {
        products_count: mockProducts.length,
        sample_products: sampleProducts,
        database_status: 'Using mock data for development'
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error.message
    }, { status: 500 })
  }
}