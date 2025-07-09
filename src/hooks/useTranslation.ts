'use client';

import { useState, useEffect } from 'react';

// 简化的翻译数据
const translations = {
  en: {
    nav: {
      recommendations: 'Smart Recommendations',
      search: 'Product Search', 
      favorites: 'My Favorites'
    },
    home: {
      title: 'AI-Powered Lighting Expert',
      subtitle: 'Get personalized lighting recommendations based on your room type, style, and budget. Featuring 56+ curated products from 7 premium brands.',
      heroProducts: '🎉 Now featuring 56+ real products',
      startRecommendation: 'Start Smart Recommendations',
      browseProducts: 'Browse All Products',
      featuredProducts: '🔥 Featured Products',
      featuredSubtitle: 'Smart recommendations from our database featuring Philips, Xiaomi, IKEA and other premium brands',
      viewAllProducts: 'View All 56+ Products →',
      whyChoose: 'Why Choose LightingPro?',
      smartAI: '🧠 AI Smart Recommendations',
      smartAIDesc: 'Personalized recommendations based on room type, decorating style, and budget range. 56 products that precisely match your needs.',
      premiumBrands: '🏆 Premium Brands',
      premiumBrandsDesc: 'Featuring Philips, Osram, Xiaomi, IKEA and 7 other renowned brands. Every product is carefully selected for quality assurance.',
      fastConvenient: '⚡ Fast & Convenient',
      fastConvenientDesc: 'Complete the questionnaire in 2 minutes and get instant professional recommendations. Compare online, save favorites, direct purchase links.',
      howItWorks: '🚀 How It Works',
      step1Title: '1. Fill Questionnaire',
      step1Desc: 'Tell us your room type, decorating style and budget range',
      step2Title: '2. Get Recommendations', 
      step2Desc: 'AI algorithm matches the most suitable lighting products for you',
      step3Title: '3. Purchase & Install',
      step3Desc: 'Direct links to official purchase with brand warranty service',
      readyToTransform: '🏠 Ready to Transform Your Space?',
      readySubtitle: 'Now featuring 56 curated products, 7 premium brands, AI smart recommendations',
      startNow: 'Start Recommendations Now',
      footer: '© 2024 LightingPro. All rights reserved.'
    },
    auth: {
      // Sign Up Page
      signup: {
        title: 'Create Account',
        subtitle: 'Join LightingPro and start your smart lighting journey',
        brandSubtitle: 'Create your smart lighting recommendation account',
        fullName: 'Full Name',
        optional: '(optional)',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        agreeToTerms: 'I agree to the',
        userAgreement: 'User Agreement',
        and: 'and',
        privacyPolicy: 'Privacy Policy',
        createAccount: 'Create Account',
        signingUp: 'Signing up...',
        orUse: 'or use',
        googleSignup: 'Google Sign Up (Coming Soon)',
        alreadyHaveAccount: 'Already have an account?',
        signInNow: 'Sign In Now',
        continueAsGuest: 'or continue browsing as a guest',
        backToHome: 'Back to Home',
        // Validation messages
        pleaseFieldRequired: 'Please fill in all required fields',
        passwordMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 6 characters',
        agreeRequired: 'Please agree to the User Agreement and Privacy Policy',
        signupFailed: 'Sign up failed',
        signupError: 'An error occurred during sign up',
        // Success state
        signupSuccess: 'Registration Successful!',
        welcomeMessage: 'Welcome to LightingPro, redirecting to homepage...',
        // Email verification
        verifyEmail: 'Verify Your Email',
        verificationSent: 'We have sent a verification email to',
        clickLinkToActivate: 'Please click the link in the email to activate your account.',
        resendVerification: 'Resend Verification Email',
        backToSignin: 'Back to Sign In',
        // Placeholders
        yourName: 'Your name',
        emailPlaceholder: 'your@email.com',
        passwordPlaceholder: 'At least 6 characters',
        confirmPasswordPlaceholder: 'Enter password again'
      },
      // Sign In Page  
      signin: {
        title: 'Welcome Back',
        subtitle: 'Sign in with your email and password',
        brandSubtitle: 'Sign in to your smart lighting recommendation account',
        email: 'Email Address',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signIn: 'Sign In',
        signingIn: 'Signing in...',
        orUse: 'or use',
        googleSignin: 'Google Sign In (Coming Soon)',
        noAccount: "Don't have an account?",
        signUpNow: 'Sign Up Now',
        continueAsGuest: 'or continue browsing as a guest',
        backToHome: 'Back to Home',
        // Error messages
        signinFailed: 'Sign in failed',
        signinError: 'An error occurred during sign in',
        // Placeholders
        emailPlaceholder: 'your@email.com',
        passwordPlaceholder: 'Enter your password'
      }
    },
    // Auth Status Component
    authStatus: {
      loading: 'Loading...',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      user: 'User',
      member: 'Member',
      profile: 'Profile',
      myFavorites: 'My Favorites',
      myOrders: 'My Orders',
      accountSettings: 'Account Settings',
      signOut: 'Sign Out'
    }
  },
  zh: {
    nav: {
      recommendations: '智能推荐',
      search: '产品搜索',
      favorites: '我的收藏'
    },
    home: {
      title: 'AI智能照明推荐专家',
      subtitle: '基于房间类型、装修风格和预算，为您推荐最合适的照明产品。来自飞利浦、小米、宜家等7大品牌，56款精选产品。',
      heroProducts: '🎉 现已上线 56+ 真实产品',
      startRecommendation: '开始智能推荐',
      browseProducts: '浏览所有产品',
      featuredProducts: '🔥 热门推荐产品',
      featuredSubtitle: '基于真实数据库的智能推荐，来自飞利浦、小米、宜家等知名品牌',
      viewAllProducts: '查看全部 56+ 产品 →',
      whyChoose: '为什么选择 LightingPro？',
      smartAI: '🧠 AI智能推荐',
      smartAIDesc: '基于房间类型、装修风格、预算范围，提供个性化的智能推荐。56款产品，精准匹配您的需求。',
      premiumBrands: '🏆 精选品牌',
      premiumBrandsDesc: '汇聚飞利浦、欧司朗、小米、宜家等7大知名品牌，每款产品都经过严格筛选，品质有保障。',
      fastConvenient: '⚡ 快速便捷',
      fastConvenientDesc: '2分钟完成问卷，立即获得专业推荐。支持在线对比、一键收藏、直达购买链接。',
      howItWorks: '🚀 使用步骤',
      step1Title: '1. 填写问卷',
      step1Desc: '告诉我们您的房间类型、装修风格和预算范围',
      step2Title: '2. 获得推荐',
      step2Desc: 'AI算法为您匹配最适合的照明产品',
      step3Title: '3. 购买安装',
      step3Desc: '直达官方购买链接，享受品牌保障服务',
      readyToTransform: '🏠 准备好改造您的空间了吗？',
      readySubtitle: '现已有56款精选产品等您发现，7大知名品牌，AI智能推荐',
      startNow: '立即开始推荐',
      footer: '© 2024 LightingPro. 版权所有.'
    },
    auth: {
      // 注册页面
      signup: {
        title: '创建账户',
        subtitle: '加入 LightingPro，开始您的智能照明之旅',
        brandSubtitle: '创建您的智能照明推荐账户',
        fullName: '姓名',
        optional: '(可选)',
        email: '邮箱地址',
        password: '密码',
        confirmPassword: '确认密码',
        agreeToTerms: '我同意',
        userAgreement: '用户协议',
        and: '和',
        privacyPolicy: '隐私政策',
        createAccount: '创建账户',
        signingUp: '注册中...',
        orUse: '或使用',
        googleSignup: 'Google注册 (即将推出)',
        alreadyHaveAccount: '已有账户？',
        signInNow: '立即登录',
        continueAsGuest: '或者以访客身份继续浏览',
        backToHome: '返回首页',
        // 验证信息
        pleaseFieldRequired: '请填写所有必填字段',
        passwordMismatch: '两次输入的密码不一致',
        passwordTooShort: '密码长度至少为6个字符',
        agreeRequired: '请同意用户协议和隐私政策',
        signupFailed: '注册失败',
        signupError: '注册过程中出现错误',
        // 成功状态
        signupSuccess: '注册成功！',
        welcomeMessage: '欢迎加入 LightingPro，正在为您跳转到主页...',
        // 邮箱验证
        verifyEmail: '验证您的邮箱',
        verificationSent: '我们已向',
        clickLinkToActivate: '发送了验证邮件。请点击邮件中的链接来激活您的账户。',
        resendVerification: '重新发送验证邮件',
        backToSignin: '返回登录',
        // 占位符
        yourName: '您的姓名',
        emailPlaceholder: 'your@email.com',
        passwordPlaceholder: '至少6个字符',
        confirmPasswordPlaceholder: '再次输入密码'
      },
      // 登录页面
      signin: {
        title: '欢迎回来',
        subtitle: '使用您的邮箱和密码登录',
        brandSubtitle: '登录您的智能照明推荐账户',
        email: '邮箱地址',
        password: '密码',
        rememberMe: '记住我',
        forgotPassword: '忘记密码？',
        signIn: '登录',
        signingIn: '登录中...',
        orUse: '或使用',
        googleSignin: 'Google登录 (即将推出)',
        noAccount: '还没有账户？',
        signUpNow: '立即注册',
        continueAsGuest: '或者以访客身份继续浏览',
        backToHome: '返回首页',
        // 错误信息
        signinFailed: '登录失败',
        signinError: '登录过程中出现错误',
        // 占位符
        emailPlaceholder: 'your@email.com',
        passwordPlaceholder: '输入您的密码'
      }
    },
    // 认证状态组件
    authStatus: {
      loading: '加载中...',
      signIn: '登录',
      signUp: '注册',
      user: '用户',
      member: '会员',
      profile: '个人资料',
      myFavorites: '我的收藏',
      myOrders: '我的订单',
      accountSettings: '账户设置',
      signOut: '退出登录'
    }
  },
  es: {
    nav: {
      recommendations: 'Recomendaciones Inteligentes',
      search: 'Búsqueda de Productos',
      favorites: 'Mis Favoritos'
    },
    home: {
      title: 'Experto en Iluminación con IA',
      subtitle: 'Obtén recomendaciones personalizadas de iluminación basadas en el tipo de habitación, estilo y presupuesto. Con 56+ productos seleccionados de 7 marcas premium.',
      heroProducts: '🎉 Ahora con 56+ productos reales',
      startRecommendation: 'Comenzar Recomendaciones Inteligentes',
      browseProducts: 'Ver Todos los Productos',
      featuredProducts: '🔥 Productos Destacados',
      featuredSubtitle: 'Recomendaciones inteligentes de nuestra base de datos con Philips, Xiaomi, IKEA y otras marcas premium',
      viewAllProducts: 'Ver Todos los 56+ Productos →',
      whyChoose: '¿Por Qué Elegir LightingPro?',
      smartAI: '🧠 Recomendaciones IA Inteligentes',
      smartAIDesc: 'Recomendaciones personalizadas basadas en tipo de habitación, estilo de decoración y rango de presupuesto.',
      premiumBrands: '🏆 Marcas Premium',
      premiumBrandsDesc: 'Con Philips, Osram, Xiaomi, IKEA y 7 otras marcas reconocidas.',
      fastConvenient: '⚡ Rápido y Conveniente',
      fastConvenientDesc: 'Completa el cuestionario en 2 minutos y obtén recomendaciones profesionales instantáneas.',
      howItWorks: '🚀 Cómo Funciona',
      step1Title: '1. Completar Cuestionario',
      step1Desc: 'Cuéntanos sobre tu tipo de habitación, estilo de decoración y rango de presupuesto',
      step2Title: '2. Obtener Recomendaciones',
      step2Desc: 'El algoritmo de IA encuentra los productos de iluminación más adecuados para ti',
      step3Title: '3. Comprar e Instalar',
      step3Desc: 'Enlaces directos a compra oficial con servicio de garantía de marca',
      readyToTransform: '🏠 ¿Listo para Transformar tu Espacio?',
      readySubtitle: 'Ahora con 56 productos seleccionados, 7 marcas premium, recomendaciones inteligentes con IA',
      startNow: 'Comenzar Recomendaciones Ahora',
      footer: '© 2024 LightingPro. Todos los derechos reservados.'
    }
  },
  fr: {
    nav: {
      recommendations: 'Recommandations Intelligentes',
      search: 'Recherche de Produits',
      favorites: 'Mes Favoris'
    },
    home: {
      title: 'Expert en Éclairage IA',
      subtitle: 'Obtenez des recommandations d\'éclairage personnalisées basées sur le type de pièce, le style et le budget. Avec 56+ produits sélectionnés de 7 marques premium.',
      heroProducts: '🎉 Maintenant avec 56+ vrais produits',
      startRecommendation: 'Commencer les Recommandations Intelligentes',
      browseProducts: 'Parcourir Tous les Produits',
      featuredProducts: '🔥 Produits en Vedette',
      featuredSubtitle: 'Recommandations intelligentes de notre base de données avec Philips, Xiaomi, IKEA et autres marques premium',
      viewAllProducts: 'Voir Tous les 56+ Produits →',
      whyChoose: 'Pourquoi Choisir LightingPro ?',
      smartAI: '🧠 Recommandations IA Intelligentes',
      smartAIDesc: 'Recommandations personnalisées basées sur le type de pièce, le style de décoration et la gamme de budget.',
      premiumBrands: '🏆 Marques Premium',
      premiumBrandsDesc: 'Avec Philips, Osram, Xiaomi, IKEA et 7 autres marques reconnues.',
      fastConvenient: '⚡ Rapide et Pratique',
      fastConvenientDesc: 'Complétez le questionnaire en 2 minutes et obtenez des recommandations professionnelles instantanées.',
      howItWorks: '🚀 Comment Ça Marche',
      step1Title: '1. Remplir le Questionnaire',
      step1Desc: 'Parlez-nous de votre type de pièce, style de décoration et gamme de budget',
      step2Title: '2. Obtenir des Recommandations',
      step2Desc: 'L\'algorithme IA trouve les produits d\'éclairage les plus adaptés pour vous',
      step3Title: '3. Acheter et Installer', 
      step3Desc: 'Liens directs vers l\'achat officiel avec service de garantie de marque',
      readyToTransform: '🏠 Prêt à Transformer Votre Espace ?',
      readySubtitle: 'Maintenant avec 56 produits sélectionnés, 7 marques premium, recommandations intelligentes IA',
      startNow: 'Commencer les Recommandations Maintenant',
      footer: '© 2024 LightingPro. Tous droits réservés.'
    }
  }
};

export function useTranslation() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // 监听语言切换事件
    const handleLanguageChange = (event: any) => {
      setCurrentLang(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[currentLang as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return { t, currentLang, setCurrentLang };
}