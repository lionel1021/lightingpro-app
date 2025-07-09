-- =====================================================
-- LightingPro 生产级数据库表结构
-- 在Supabase SQL编辑器中执行此脚本
-- =====================================================

-- 1. 用户资料表
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id)
);

-- 2. 品牌表
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  country TEXT DEFAULT 'China',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. 分类表  
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_en TEXT,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  image_url TEXT,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. 照明产品表（核心表）
CREATE TABLE IF NOT EXISTS lighting_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  description TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'CNY',
  
  -- 产品规格
  specifications JSONB DEFAULT '{}',
  dimensions JSONB DEFAULT '{}',
  weight DECIMAL(8,3),
  
  -- 媒体资源
  image_urls TEXT[] DEFAULT '{}',
  video_urls TEXT[] DEFAULT '{}',
  
  -- 商业信息
  affiliate_links JSONB DEFAULT '{}',
  commission_rate DECIMAL(5,2) DEFAULT 0.0,
  
  -- 评价和统计
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  
  -- 产品特性
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- 状态管理
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 999,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
  
  -- SEO和搜索
  seo_title TEXT,
  seo_description TEXT,
  search_keywords TEXT[] DEFAULT '{}',
  
  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. 联盟链接表
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES lighting_products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 0.0,
  click_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(product_id, platform)
);

-- 6. 用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES lighting_products(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, product_id)
);

-- 7. 推荐历史表
CREATE TABLE IF NOT EXISTS recommendation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  questionnaire_data JSONB NOT NULL,
  recommended_products UUID[] DEFAULT '{}',
  algorithm_version TEXT DEFAULT 'v1',
  confidence_score DECIMAL(3,2),
  user_feedback JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. 用户行为追踪表
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID REFERENCES lighting_products(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'click', 'favorite', 'unfavorite', 'share', 'purchase')),
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. 产品评价表
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES lighting_products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  pros TEXT[],
  cons TEXT[],
  helpful_count INTEGER DEFAULT 0,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 创建索引以优化查询性能
-- =====================================================

-- 用户相关索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);

-- 产品相关索引
CREATE INDEX IF NOT EXISTS idx_lighting_products_brand_id ON lighting_products(brand_id);
CREATE INDEX IF NOT EXISTS idx_lighting_products_category_id ON lighting_products(category_id);
CREATE INDEX IF NOT EXISTS idx_lighting_products_price ON lighting_products(price);
CREATE INDEX IF NOT EXISTS idx_lighting_products_rating ON lighting_products(rating);
CREATE INDEX IF NOT EXISTS idx_lighting_products_status ON lighting_products(status);
CREATE INDEX IF NOT EXISTS idx_lighting_products_featured ON lighting_products(is_featured);
CREATE INDEX IF NOT EXISTS idx_lighting_products_available ON lighting_products(is_available);
CREATE INDEX IF NOT EXISTS idx_lighting_products_created_at ON lighting_products(created_at);

-- 搜索优化索引
CREATE INDEX IF NOT EXISTS idx_lighting_products_name_trgm ON lighting_products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_lighting_products_features ON lighting_products USING gin (features);
CREATE INDEX IF NOT EXISTS idx_lighting_products_tags ON lighting_products USING gin (tags);

-- 其他关联表索引
CREATE INDEX IF NOT EXISTS idx_affiliate_links_product_id ON affiliate_links(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_recommendation_history_user_id ON recommendation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_history_session_id ON recommendation_history(session_id);

-- =====================================================
-- 启用行级安全 (RLS)
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS 安全策略
-- =====================================================

-- 用户资料策略
CREATE POLICY IF NOT EXISTS "用户只能查看和更新自己的资料" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

-- 用户收藏策略
CREATE POLICY IF NOT EXISTS "用户只能管理自己的收藏" ON user_favorites
  FOR ALL USING (auth.uid() = user_id);

-- 推荐历史策略
CREATE POLICY IF NOT EXISTS "用户只能查看自己的推荐历史" ON recommendation_history
  FOR ALL USING (auth.uid() = user_id);

-- 用户行为策略  
CREATE POLICY IF NOT EXISTS "用户只能查看自己的行为数据" ON user_interactions
  FOR ALL USING (auth.uid() = user_id);

-- 产品评价策略
CREATE POLICY IF NOT EXISTS "用户可以查看所有评价，只能编辑自己的评价" ON product_reviews
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "用户只能编辑自己的评价" ON product_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "用户只能更新自己的评价" ON product_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- 公共表的读取权限
CREATE POLICY IF NOT EXISTS "所有人都可以查看产品" ON lighting_products
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "所有人都可以查看品牌" ON brands
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "所有人都可以查看分类" ON categories
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "所有人都可以查看联盟链接" ON affiliate_links
  FOR SELECT USING (true);

-- =====================================================
-- 数据完整性触发器
-- =====================================================

-- 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建触发器
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lighting_products_updated_at BEFORE UPDATE ON lighting_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 插入基础数据
-- =====================================================

-- 插入品牌数据
INSERT INTO brands (name, description, logo_url, website_url, country) VALUES
('飞利浦 (Philips)', '全球领先的照明品牌，以创新技术和高品质著称', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.philips.com.cn', 'Netherlands'),
('欧司朗 (OSRAM)', '德国专业照明制造商，技术领先的工业照明解决方案', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.osram.com.cn', 'Germany'),
('松下 (Panasonic)', '日本知名电器品牌，提供全方位的照明产品', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.panasonic.com.cn', 'Japan'),
('小米 (Xiaomi)', '智能家居生态链领导者，专注智能照明解决方案', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.mi.com', 'China'),
('雷士照明 (NVC)', '中国照明行业领导者，专业的照明解决方案提供商', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.nvc.com', 'China'),
('三雄极光 (PAK)', '中国知名照明品牌，专注LED照明产品', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.pak.com.cn', 'China'),
('宜家 (IKEA)', '瑞典家居品牌，提供简约实用的照明产品', 'https://images.unsplash.com/photo-1558618711-fcd25c85cd64?w=100', 'https://www.ikea.cn', 'Sweden')
ON CONFLICT (name) DO NOTHING;

-- 插入分类数据
INSERT INTO categories (name, name_en, description, icon_name, sort_order) VALUES
('吸顶灯', 'Ceiling Light', '安装在天花板上的主要照明设备，适合客厅、卧室等空间', 'ceiling', 1),
('吊灯', 'Pendant Light', '悬挂式装饰照明灯具，营造优雅氛围', 'pendant', 2),
('台灯', 'Table Lamp', '桌面使用的局部照明，适合阅读和工作', 'table-lamp', 3),
('壁灯', 'Wall Light', '安装在墙壁上的装饰照明，节省空间', 'wall-light', 4),
('射灯', 'Spotlight', '方向性强的重点照明，突出展示物品', 'spotlight', 5),
('筒灯', 'Recessed Light', '嵌入式天花板照明，简洁美观', 'recessed', 6),
('落地灯', 'Floor Lamp', '立式装饰照明灯具，移动灵活', 'floor-lamp', 7),
('灯带', 'LED Strip', '柔性LED灯带，用于氛围照明和装饰', 'led-strip', 8),
('智能照明', 'Smart Light', '可调节智能控制灯具，支持APP控制', 'smart-light', 9),
('户外照明', 'Outdoor Light', '室外使用的防水照明设备', 'outdoor', 10)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 完成消息
-- =====================================================

-- 显示创建结果
DO $$
BEGIN
    RAISE NOTICE '✅ LightingPro数据库表结构创建完成！';
    RAISE NOTICE '📊 已创建 % 个表', 
        (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%lighting%' OR table_name LIKE '%user_%' OR table_name LIKE '%brand%' OR table_name LIKE '%categor%' OR table_name LIKE '%affiliat%' OR table_name LIKE '%review%' OR table_name LIKE '%recommend%' OR table_name LIKE '%interact%');
    RAISE NOTICE '🔍 已创建 % 个索引', 
        (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%');
    RAISE NOTICE '🔐 已启用行级安全策略';
    RAISE NOTICE '🚀 数据库已准备就绪，可以开始使用真实数据！';
END $$;