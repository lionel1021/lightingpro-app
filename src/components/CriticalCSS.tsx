'use client';

import { useEffect } from 'react';

// 🎯 Critical CSS for above-the-fold content - inline for instant rendering
export const CriticalCSSInline = () => (
  <style jsx global>{`
    /* Critical styles for immediate render */
    html, body {
      margin: 0;
      padding: 0;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    * {
      box-sizing: border-box;
    }
    
    /* Essential layout classes */
    .min-h-screen { min-height: 100vh; }
    .bg-black { background-color: #000; }
    .text-white { color: #fff; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .text-center { text-align: center; }
    .relative { position: relative; }
    .absolute { position: absolute; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .overflow-hidden { overflow: hidden; }
    .pointer-events-none { pointer-events: none; }
    
    /* Loading animation */
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Essential sizing */
    .w-4 { width: 1rem; }
    .h-4 { height: 1rem; }
    .w-12 { width: 3rem; }
    .h-12 { height: 3rem; }
    .w-16 { width: 4rem; }
    .h-16 { height: 4rem; }
    
    /* Essential spacing */
    .mx-auto { margin-left: auto; margin-right: auto; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .p-4 { padding: 1rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    
    /* Essential typography */
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-2xl { font-size: 1.5rem; line-height: 2rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-base { font-size: 1rem; line-height: 1.5rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .font-bold { font-weight: 700; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .leading-tight { line-height: 1.25; }
    .leading-snug { line-height: 1.375; }
    .leading-relaxed { line-height: 1.625; }
    
    /* Essential borders */
    .rounded-full { border-radius: 9999px; }
    .rounded-lg { border-radius: 0.5rem; }
    .border-2 { border-width: 2px; }
    .border-blue-400 { border-color: #60a5fa; }
    
    /* Critical gradients */
    .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
    .from-blue-400 { --tw-gradient-from: #60a5fa; --tw-gradient-to: rgb(96 165 250 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
    .via-purple-400 { --tw-gradient-to: rgb(196 181 253 / 0); --tw-gradient-stops: var(--tw-gradient-from), #c4b5fd, var(--tw-gradient-to); }
    .to-pink-400 { --tw-gradient-to: #f472b6; }
    .from-slate-900 { --tw-gradient-from: #0f172a; --tw-gradient-to: rgb(15 23 42 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
    .via-purple-900 { --tw-gradient-to: rgb(88 28 135 / 0); --tw-gradient-stops: var(--tw-gradient-from), #581c87, var(--tw-gradient-to); }
    .to-slate-900 { --tw-gradient-to: #0f172a; }
    
    /* Text effects - Critical for gradient text */
    .bg-clip-text { 
      background-clip: text; 
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .text-transparent { color: transparent; }
    
    /* Mobile-first font size utilities with clamp() */
    .text-clamp-base { font-size: clamp(1rem, 4vw, 1.25rem); }
    .text-clamp-lg { font-size: clamp(1.125rem, 4.5vw, 1.5rem); }
    .text-clamp-xl { font-size: clamp(1.25rem, 5vw, 2rem); }
    .text-clamp-2xl { font-size: clamp(1.5rem, 6vw, 2.5rem); }
    .text-clamp-3xl { font-size: clamp(1.75rem, 8vw, 3rem); }
    .text-clamp-4xl { font-size: clamp(2rem, 10vw, 4rem); }
    .text-clamp-5xl { font-size: clamp(2.25rem, 12vw, 5rem); }
    
    /* Enhanced gradient text rendering */
    .gradient-text {
      background: linear-gradient(135deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    
    /* Force anti-aliasing for better mobile text rendering */
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }
    
    /* Essential colors */
    .text-gray-300 { color: #d1d5db; }
    .text-gray-400 { color: #9ca3af; }
    .text-green-400 { color: #4ade80; }
    .text-blue-400 { color: #60a5fa; }
    .text-purple-400 { color: #c4b5fd; }
    
    /* Backdrop effects */
    .bg-white\\/10 { background-color: rgb(255 255 255 / 0.1); }
    .backdrop-blur-sm { backdrop-filter: blur(4px); }
    
    /* Layout spacing */
    .space-y-3 > :not([hidden]) ~ :not([hidden]) {
      --tw-space-y-reverse: 0;
      margin-top: calc(0.75rem * calc(1 - var(--tw-space-y-reverse)));
      margin-bottom: calc(0.75rem * var(--tw-space-y-reverse));
    }
    
    .max-w-xs { max-width: 20rem; }
    .max-w-sm { max-width: 24rem; }
    .max-w-2xl { max-width: 42rem; }
    .block { display: block; }
    
    /* Mobile-first responsive design */
    @media (min-width: 640px) {
      .sm\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
      .sm\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
      .sm\:text-base { font-size: 1rem; line-height: 1.5rem; }
      .sm\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
      .sm\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .sm\:max-w-sm { max-width: 24rem; }
      .sm\:px-4 { padding-left: 1rem; padding-right: 1rem; }
      .sm\:hidden { display: none; }
    }
    
    /* Ensure proper viewport units support */
    @supports (font-size: clamp(1rem, 4vw, 2rem)) {
      .mobile-optimized-text {
        font-size: clamp(1rem, 4vw, 2rem) !important;
        line-height: 1.2 !important;
      }
    }
    
    /* Fallback for older browsers */
    @supports not (font-size: clamp(1rem, 4vw, 2rem)) {
      .mobile-optimized-text {
        font-size: 1.5rem !important;
        line-height: 1.2 !important;
      }
      
      @media (max-width: 480px) {
        .mobile-optimized-text {
          font-size: 1.25rem !important;
        }
      }
    }
  `}</style>
);

// 🚀 Non-critical CSS loader - loads after critical rendering
export const NonCriticalCSSLoader = () => {
  useEffect(() => {
    // Defer loading of non-critical CSS
    const loadNonCriticalCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/_next/static/css/app/layout.css';
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
      document.head.appendChild(link);
    };

    // Load after critical render
    requestIdleCallback ? requestIdleCallback(loadNonCriticalCSS) : setTimeout(loadNonCriticalCSS, 0);
  }, []);

  return null;
};

export default CriticalCSSInline;