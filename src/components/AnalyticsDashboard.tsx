// Legacy AnalyticsDashboard - Redirects to new modular version
'use client'

import { AnalyticsDashboard as NewAnalyticsDashboard } from './analytics/AnalyticsDashboard'

// Re-export the new modular component for backward compatibility
export const AnalyticsDashboard = NewAnalyticsDashboard
export default AnalyticsDashboard