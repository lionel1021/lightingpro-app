'use client';

import { useEffect } from 'react';

export const PerformanceMonitor = () => {
  useEffect(() => {
    // 🎯 Monitor Core Web Vitals after render optimization
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        // First Contentful Paint (FCP)
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint') {
              console.log(`🎨 ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
            }
            
            if (entry.entryType === 'largest-contentful-paint') {
              console.log(`🖼️ LCP: ${entry.startTime.toFixed(2)}ms`);
            }
            
            if (entry.entryType === 'layout-shift') {
              console.log(`📐 CLS: ${entry.value.toFixed(4)}`);
            }
          }
        });

        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });

        // DOM Content Loaded and Load times
        window.addEventListener('DOMContentLoaded', () => {
          const domTime = performance.now();
          console.log(`🏗️ DOM Ready: ${domTime.toFixed(2)}ms`);
        });

        window.addEventListener('load', () => {
          const loadTime = performance.now();
          console.log(`✅ Page Load Complete: ${loadTime.toFixed(2)}ms`);
          
          // Navigation timing
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            console.log('📊 Performance Metrics:');
            console.log(`  DNS Lookup: ${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`);
            console.log(`  TCP Connect: ${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`);
            console.log(`  Request/Response: ${(navigation.responseEnd - navigation.requestStart).toFixed(2)}ms`);
            console.log(`  DOM Processing: ${(navigation.domComplete - navigation.domLoading).toFixed(2)}ms`);
            console.log(`  Total Load Time: ${(navigation.loadEventEnd - navigation.fetchStart).toFixed(2)}ms`);
          }
        });

        // Resource timing for CSS files
        setTimeout(() => {
          const resources = performance.getEntriesByType('resource');
          const cssResources = resources.filter(resource => 
            resource.name.includes('.css') || 
            resource.name.includes('stylesheet')
          );
          
          if (cssResources.length > 0) {
            console.log('🎨 CSS Resource Performance:');
            cssResources.forEach(resource => {
              console.log(`  ${resource.name.split('/').pop()}: ${resource.duration.toFixed(2)}ms`);
            });
          }
        }, 1000);
      }
    };

    measurePerformance();
  }, []);

  return null;
};

export default PerformanceMonitor;