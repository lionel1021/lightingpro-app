'use client'

import React from 'react'
import { BaseChart } from '@/components/charts/BaseChart'
import { FunnelChart, Funnel, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { AnalyticsReport } from '@/lib/analytics'

interface FunnelAnalysisPanelProps {
  report: AnalyticsReport | null
  loading: boolean
}

export const FunnelAnalysisPanel: React.FC<FunnelAnalysisPanelProps> = ({ report, loading }) => {
  const funnelData = [
    { name: 'Visitors', value: 1000, fill: '#0088FE' },
    { name: 'Product Views', value: 750, fill: '#00C49F' },
    { name: 'Questionnaire', value: 450, fill: '#FFBB28' },
    { name: 'Recommendations', value: 320, fill: '#FF8042' },
    { name: 'Add to Cart', value: 180, fill: '#8884d8' },
    { name: 'Purchases', value: 67, fill: '#82ca9d' }
  ]

  const conversionData = funnelData.map((step, index) => {
    const previousValue = index > 0 ? funnelData[index - 1].value : step.value
    const conversionRate = ((step.value / previousValue) * 100).toFixed(1)
    
    return {
      ...step,
      conversionRate: index === 0 ? 100 : parseFloat(conversionRate),
      dropOff: index === 0 ? 0 : previousValue - step.value
    }
  })

  const calculateOverallConversion = () => {
    const first = funnelData[0]?.value || 1
    const last = funnelData[funnelData.length - 1]?.value || 0
    return ((last / first) * 100).toFixed(2)
  }

  return (
    <div className="space-y-6">
      {/* Funnel Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
            <BaseChart height={400} loading={loading}>
              <FunnelChart>
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </BaseChart>
          </div>
        </div>

        {/* Funnel Stats */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="font-semibold mb-4">Conversion Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Overall Conversion:</span>
                <span className="font-semibold text-green-600">{calculateOverallConversion()}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Visitors:</span>
                <span className="font-semibold">{funnelData[0]?.value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Conversions:</span>
                <span className="font-semibold">{funnelData[funnelData.length - 1]?.value}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Impact:</span>
                <span className="font-semibold text-blue-600">$6,730</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h4 className="font-semibold mb-4">Biggest Drop-offs</h4>
            <div className="space-y-3">
              {conversionData
                .filter(step => step.dropOff > 0)
                .sort((a, b) => b.dropOff - a.dropOff)
                .slice(0, 3)
                .map((step, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{step.name}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        -{step.dropOff}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step.conversionRate}% conversion
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Step Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Step-by-Step Analysis</h3>
        <BaseChart height={300} loading={loading}>
          <BarChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'value') return [value, 'Users']
                if (name === 'conversionRate') return [`${value}%`, 'Conversion Rate']
                return [value, name]
              }}
            />
            <Bar yAxisId="left" dataKey="value" fill="#0088FE" />
            <Bar yAxisId="right" dataKey="conversionRate" fill="#00C49F" />
          </BarChart>
        </BaseChart>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">🎯 Immediate Actions</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Optimize questionnaire flow (450→320 drop-off)</li>
              <li>• Improve recommendation relevance</li>
              <li>• Simplify add-to-cart process</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-green-800">📈 Growth Opportunities</h4>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• A/B test shorter questionnaire</li>
              <li>• Add exit-intent popups</li>
              <li>• Implement cart abandonment emails</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}