-- =====================================================
-- LightingPro Production Database Schema
-- 生产环境完整数据库结构
-- =====================================================

-- 启用必要扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 1. 用户系统表
-- =====================================================

-- 用户配置表 (扩展auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 用户会话追踪
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  page_views INTEGER DEFAULT 0,
  questionnaire_completed BOOLEAN DEFAULT false,
  recommendations_viewed INTEGER DEFAULT 0,
  products_clicked INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT
);

-- =====================================================
-- 2. 产品系统表
-- =====================================================

-- 品牌表
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 产品分类表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 主产品表
CREATE TABLE IF NOT EXISTS lighting_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  sku TEXT UNIQUE,
  
  -- 基本信息
  description TEXT,
  short_description TEXT,
  features TEXT[] DEFAULT '{}',
  
  -- 定价
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  cost DECIMAL(10,2),
  currency TEXT DEFAULT 'CNY',
  
  -- 规格参数
  specifications JSONB DEFAULT '{}',
  dimensions JSONB DEFAULT '{}', -- {height, width, depth, weight}
  
  -- 评价数据
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  
  -- 媒体资源
  image_urls TEXT[] DEFAULT '{}',
  video_urls TEXT[] DEFAULT '{}',
  
  -- 库存和状态
  inventory_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  is_featured BOOLEAN DEFAULT false,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 联盟营销链接表
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES lighting_products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- amazon, jd, tmall, etc.
  affiliate_url TEXT NOT NULL,
  original_url TEXT,
  commission_rate DECIMAL(5,2) NOT NULL,
  tracking_code TEXT,
  is_active BOOLEAN DEFAULT true,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, platform)
);

-- =====================================================
-- 3. 推荐系统表
-- =====================================================

-- 问卷回答表
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  session_id UUID,
  
  -- 问卷数据
  room_type TEXT NOT NULL,
  room_size TEXT NOT NULL,
  style_preference TEXT NOT NULL,
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  current_lighting TEXT,
  special_requirements TEXT[],
  additional_notes TEXT,
  
  -- 元数据
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 推荐结果表
CREATE TABLE IF NOT EXISTS recommendation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID REFERENCES questionnaire_responses(id),
  user_id UUID REFERENCES user_profiles(user_id),
  
  -- 推荐产品
  recommended_products JSONB NOT NULL, -- Array of product IDs with scores
  algorithm_version TEXT DEFAULT 'v1.0',
  recommendation_score DECIMAL(5,2),
  
  -- 用户反馈
  user_feedback JSONB DEFAULT '{}',
  conversion_tracked BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  product_id UUID REFERENCES lighting_products(id) ON DELETE CASCADE,
  notes TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 用户行为追踪表
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id),
  session_id UUID,
  
  -- 交互数据
  interaction_type TEXT NOT NULL, -- view, click, favorite, purchase, etc.
  product_id UUID REFERENCES lighting_products(id),
  page_url TEXT,
  referrer_url TEXT,
  
  -- 上下文数据
  interaction_data JSONB DEFAULT '{}',
  duration_seconds INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. 性能优化索引
-- =====================================================

-- 产品表索引
CREATE INDEX IF NOT EXISTS idx_products_brand ON lighting_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON lighting_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON lighting_products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON lighting_products(rating);
CREATE INDEX IF NOT EXISTS idx_products_status ON lighting_products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON lighting_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created ON lighting_products(created_at);

-- 用户相关索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_product ON user_favorites(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_type ON user_interactions(interaction_type);

-- 推荐系统索引
CREATE INDEX IF NOT EXISTS idx_questionnaire_user ON questionnaire_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_questionnaire_created ON questionnaire_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendation_results(user_id);

-- 全文搜索索引
CREATE INDEX IF NOT EXISTS idx_products_search ON lighting_products 
USING gin(to_tsvector('chinese', name || ' ' || COALESCE(description, '')));

-- =====================================================
-- 5. 触发器和函数
-- =====================================================

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为产品表添加更新时间戳触发器
CREATE TRIGGER update_lighting_products_updated_at 
    BEFORE UPDATE ON lighting_products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 为用户配置表添加更新时间戳触发器
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. 行级安全策略 (RLS)
-- =====================================================

-- 启用行级安全
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的数据
CREATE POLICY "Users can only access their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own questionnaire responses" ON questionnaire_responses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own recommendations" ON recommendation_results
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own interactions" ON user_interactions
    FOR ALL USING (auth.uid() = user_id);

-- 产品表对所有人可读
CREATE POLICY "Products are publicly readable" ON lighting_products
    FOR SELECT USING (true);

CREATE POLICY "Brands are publicly readable" ON brands
    FOR SELECT USING (true);

CREATE POLICY "Categories are publicly readable" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Affiliate links are publicly readable" ON affiliate_links
    FOR SELECT USING (true);