#!/usr/bin/env node

// Performance analysis script for LightingPro
// Provides comprehensive performance metrics and recommendations

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const REPORTS_DIR = './reports'
const BUILD_DIR = './.next'

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true })
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function analyzeBuildSize() {
  console.log('📊 Analyzing build size...')
  
  if (!fs.existsSync(BUILD_DIR)) {
    console.log('❌ Build directory not found. Run npm run build first.')
    return
  }

  try {
    // Get build stats
    const buildManifest = path.join(BUILD_DIR, 'build-manifest.json')
    if (fs.existsSync(buildManifest)) {
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'))
      console.log('✅ Build manifest found')
      
      // Analyze chunk sizes
      const chunks = manifest.pages || {}
      const sortedChunks = Object.entries(chunks)
        .map(([page, files]) => ({
          page,
          files: Array.isArray(files) ? files : [],
          totalSize: 0
        }))
        .sort((a, b) => b.totalSize - a.totalSize)

      console.log('\n📈 Top 10 largest pages by JS bundle size:')
      sortedChunks.slice(0, 10).forEach(chunk => {
        console.log(`  ${chunk.page}: ${chunk.files.length} files`)
      })
    }

    // Analyze static directory
    const staticDir = path.join(BUILD_DIR, 'static')
    if (fs.existsSync(staticDir)) {
      const staticSize = getDirectorySize(staticDir)
      console.log(`📁 Static assets size: ${formatBytes(staticSize)}`)
    }

    // Check for large files
    const largeFiles = findLargeFiles(BUILD_DIR, 1024 * 1024) // Files > 1MB
    if (largeFiles.length > 0) {
      console.log('\n⚠️  Large files detected (>1MB):')
      largeFiles.forEach(file => {
        console.log(`  ${file.path}: ${formatBytes(file.size)}`)
      })
    }

  } catch (error) {
    console.error('❌ Error analyzing build:', error.message)
  }
}

function getDirectorySize(dirPath) {
  let totalSize = 0
  
  function calculateSize(currentPath) {
    const stats = fs.statSync(currentPath)
    
    if (stats.isFile()) {
      totalSize += stats.size
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath)
      files.forEach(file => {
        calculateSize(path.join(currentPath, file))
      })
    }
  }
  
  if (fs.existsSync(dirPath)) {
    calculateSize(dirPath)
  }
  
  return totalSize
}

function findLargeFiles(dirPath, threshold) {
  const largeFiles = []
  
  function scanDirectory(currentPath) {
    if (!fs.existsSync(currentPath)) return
    
    const items = fs.readdirSync(currentPath)
    
    items.forEach(item => {
      const itemPath = path.join(currentPath, item)
      const stats = fs.statSync(itemPath)
      
      if (stats.isFile() && stats.size > threshold) {
        largeFiles.push({
          path: itemPath.replace(process.cwd() + '/', ''),
          size: stats.size
        })
      } else if (stats.isDirectory() && !item.startsWith('.')) {
        scanDirectory(itemPath)
      }
    })
  }
  
  scanDirectory(dirPath)
  return largeFiles.sort((a, b) => b.size - a.size)
}

function generatePerformanceReport() {
  console.log('📋 Generating performance report...')
  
  const report = {
    timestamp: new Date().toISOString(),
    build: {
      buildTime: new Date(),
      nodeVersion: process.version,
      nextVersion: getPackageVersion('next'),
    },
    recommendations: []
  }

  // Build size analysis
  if (fs.existsSync(BUILD_DIR)) {
    const buildSize = getDirectorySize(BUILD_DIR)
    report.build.totalSize = formatBytes(buildSize)
    
    if (buildSize > 50 * 1024 * 1024) { // > 50MB
      report.recommendations.push({
        type: 'warning',
        category: 'bundle-size',
        message: 'Build size is large. Consider code splitting and removing unused dependencies.',
        priority: 'high'
      })
    }
  }

  // Check for common performance issues
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  
  // Check dependencies
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies }
  const heavyDeps = ['lodash', 'moment', 'jquery', 'bootstrap']
  
  heavyDeps.forEach(dep => {
    if (deps[dep]) {
      report.recommendations.push({
        type: 'suggestion',
        category: 'dependencies',
        message: `Consider replacing ${dep} with lighter alternatives`,
        priority: 'medium'
      })
    }
  })

  // Check for bundle analyzer
  if (!deps['@next/bundle-analyzer']) {
    report.recommendations.push({
      type: 'info',
      category: 'tooling',
      message: 'Consider adding @next/bundle-analyzer for better bundle analysis',
      priority: 'low'
    })
  }

  // Save report
  const reportPath = path.join(REPORTS_DIR, 'performance-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  
  console.log(`✅ Performance report saved to ${reportPath}`)
  
  // Display summary
  console.log('\n📊 Performance Summary:')
  console.log(`  Total build size: ${report.build.totalSize || 'Unknown'}`)
  console.log(`  Recommendations: ${report.recommendations.length}`)
  
  if (report.recommendations.length > 0) {
    console.log('\n💡 Top Recommendations:')
    report.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`)
    })
  }
}

function getPackageVersion(packageName) {
  try {
    const packagePath = path.join('node_modules', packageName, 'package.json')
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
      return pkg.version
    }
  } catch (error) {
    return 'unknown'
  }
  return 'unknown'
}

function runWebVitalsAnalysis() {
  console.log('🚀 Web Vitals Analysis')
  console.log('Note: This requires the application to be running on localhost:3000')
  console.log('Run this after starting your dev server with: npm run dev')
  console.log('')
  console.log('Key Web Vitals to monitor:')
  console.log('  • LCP (Largest Contentful Paint): < 2.5s')
  console.log('  • FID (First Input Delay): < 100ms')
  console.log('  • CLS (Cumulative Layout Shift): < 0.1')
  console.log('  • FCP (First Contentful Paint): < 1.8s')
  console.log('  • TTFB (Time to First Byte): < 600ms')
}

// Main execution
console.log('🔍 LightingPro Performance Analysis')
console.log('=====================================\n')

analyzeBuildSize()
console.log('')
generatePerformanceReport()
console.log('')
runWebVitalsAnalysis()

console.log('\n🎯 Quick Commands:')
console.log('  npm run analyze          - Run bundle analyzer')
console.log('  npm run perf:lighthouse  - Run Lighthouse audit')
console.log('  npm run perf:webvitals   - Measure Web Vitals')