-- ================================
-- 🚀 MCP + SuperClaude 紧急修复迁移
-- 修复关键数据库问题
-- 执行时间: 立即
-- ================================

-- 1. 创建缺失的用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES lighting_products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 确保用户不能重复收藏同一产品
  UNIQUE(user_id, product_id)
);

-- 为用户收藏表创建索引
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_product_id ON user_favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at);

-- 2. 修复用户档案表字段不匹配问题
-- 添加user_id列，与认证系统保持一致
DO $$
BEGIN
  -- 检查user_id列是否已存在
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'user_id'
  ) THEN
    -- 添加user_id列
    ALTER TABLE user_profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
    -- 将现有的auth_user_id数据迁移到user_id
    UPDATE user_profiles SET user_id = auth_user_id WHERE auth_user_id IS NOT NULL;
    
    -- 设置user_id为必填字段
    ALTER TABLE user_profiles ALTER COLUMN user_id SET NOT NULL;
    
    -- 创建唯一索引
    CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
  END IF;
END $$;

-- 3. 修复问卷响应表预算字段问题
-- 添加数值型预算字段
DO $$
BEGIN
  -- 添加budget_min和budget_max字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questionnaire_responses' AND column_name = 'budget_min'
  ) THEN
    ALTER TABLE questionnaire_responses 
    ADD COLUMN budget_min INTEGER,
    ADD COLUMN budget_max INTEGER;
  END IF;
END $$;

-- 迁移现有的budget_range数据到新字段
UPDATE questionnaire_responses 
SET 
  budget_min = CASE responses->>'budget'
    WHEN 'low' THEN 50
    WHEN 'medium' THEN 150
    WHEN 'high' THEN 300
    WHEN 'premium' THEN 500
    WHEN 'luxury' THEN 1000
    ELSE 0
  END,
  budget_max = CASE responses->>'budget'
    WHEN 'low' THEN 150
    WHEN 'medium' THEN 300
    WHEN 'high' THEN 500
    WHEN 'premium' THEN 1000
    WHEN 'luxury' THEN 5000
    ELSE 1000
  END
WHERE responses->>'budget' IS NOT NULL AND budget_min IS NULL;

-- 4. 修复产品图片字段结构
-- 将image_urls从text[]改为符合TypeScript预期的JSONB结构
DO $$
BEGIN
  -- 检查是否需要更新图片字段结构
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lighting_products' 
    AND column_name = 'image_urls' 
    AND data_type = 'ARRAY'
  ) THEN
    -- 添加新的images字段
    ALTER TABLE lighting_products ADD COLUMN images JSONB DEFAULT '[]'::jsonb;
    
    -- 迁移现有图片数据到新结构
    UPDATE lighting_products 
    SET images = (
      SELECT jsonb_agg(
        jsonb_build_object(
          'url', url,
          'alt', name || ' - Image ' || row_number() OVER(),
          'is_primary', row_number() OVER() = 1
        )
      )
      FROM unnest(image_urls) AS url
    )
    WHERE image_urls IS NOT NULL AND array_length(image_urls, 1) > 0;
  END IF;
END $$;

-- 5. 创建用户偏好设置表（支持个性化推荐）
CREATE TABLE IF NOT EXISTS user_preference_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 房间类型偏好
  preferred_room_types TEXT[] DEFAULT '{}',
  
  -- 风格偏好
  preferred_styles TEXT[] DEFAULT '{}',
  
  -- 预算范围
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 1000,
  
  -- 品牌偏好
  preferred_brands UUID[] DEFAULT '{}',
  
  -- 颜色偏好
  preferred_colors TEXT[] DEFAULT '{}',
  
  -- 智能家居偏好
  smart_home_preference BOOLEAN DEFAULT false,
  
  -- 节能偏好
  energy_efficiency_priority BOOLEAN DEFAULT true,
  
  -- 个性化设置
  notification_preferences JSONB DEFAULT '{"email": true, "push": false, "recommendations": true}'::jsonb,
  
  -- 推荐算法偏好
  algorithm_preference TEXT DEFAULT 'DEFAULT' CHECK (algorithm_preference IN ('DEFAULT', 'HIGH_CONVERSION', 'EXPLORATION', 'DIVERSITY')),
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 唯一约束
  UNIQUE(user_id)
);

-- 为用户偏好表创建索引
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preference_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_updated_at ON user_preference_profiles(updated_at);

-- 6. 创建用户行为追踪表（用于机器学习）
CREATE TABLE IF NOT EXISTS user_behavior_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID NOT NULL,
  
  -- 行为类型
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view', 'product_view', 'product_like', 'product_unlike',
    'search', 'filter_apply', 'recommendation_click', 'purchase_intent',
    'questionnaire_start', 'questionnaire_complete', 'cart_add', 'cart_remove'
  )),
  
  -- 事件数据
  event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- 产品相关
  product_id UUID REFERENCES lighting_products(id) ON DELETE SET NULL,
  
  -- 页面信息
  page_url TEXT,
  referrer_url TEXT,
  
  -- 设备信息
  user_agent TEXT,
  device_type TEXT,
  
  -- 地理位置
  country_code CHAR(2),
  city TEXT,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 为行为分析表创建索引
CREATE INDEX IF NOT EXISTS idx_user_behavior_user_id ON user_behavior_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_session_id ON user_behavior_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_event_type ON user_behavior_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_behavior_created_at ON user_behavior_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_user_behavior_product_id ON user_behavior_analytics(product_id);

-- 7. 创建推荐日志表（追踪推荐效果）
CREATE TABLE IF NOT EXISTS recommendation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID NOT NULL,
  
  -- 推荐算法信息
  algorithm_used TEXT NOT NULL,
  algorithm_version TEXT DEFAULT '1.0',
  
  -- 推荐参数
  input_preferences JSONB,
  algorithm_parameters JSONB,
  
  -- 推荐结果
  recommended_products UUID[] NOT NULL,
  total_score DECIMAL(5,2),
  confidence_score DECIMAL(5,2),
  
  -- 用户反馈
  user_clicked_products UUID[] DEFAULT '{}',
  user_liked_products UUID[] DEFAULT '{}',
  user_purchased_products UUID[] DEFAULT '{}',
  
  -- 效果指标
  click_through_rate DECIMAL(5,4),
  conversion_rate DECIMAL(5,4),
  user_satisfaction_score INTEGER CHECK (user_satisfaction_score BETWEEN 1 AND 5),
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 为推荐日志表创建索引
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_user_id ON recommendation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_algorithm ON recommendation_logs(algorithm_used);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_created_at ON recommendation_logs(created_at);

-- 8. 更新updated_at字段的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建更新触发器
CREATE TRIGGER update_user_favorites_updated_at 
  BEFORE UPDATE ON user_favorites 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preference_profiles_updated_at 
  BEFORE UPDATE ON user_preference_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recommendation_logs_updated_at 
  BEFORE UPDATE ON recommendation_logs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. 启用行级安全策略 (RLS)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preference_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_logs ENABLE ROW LEVEL SECURITY;

-- 用户只能访问自己的收藏
CREATE POLICY "Users can view their own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 用户只能访问自己的偏好设置
CREATE POLICY "Users can manage their own preferences" ON user_preference_profiles
  FOR ALL USING (auth.uid() = user_id);

-- 用户行为分析策略（允许匿名数据收集）
CREATE POLICY "Allow behavior analytics" ON user_behavior_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own analytics" ON user_behavior_analytics
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- 推荐日志策略
CREATE POLICY "Allow recommendation logging" ON recommendation_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own recommendation logs" ON recommendation_logs
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- ================================
-- 数据完整性检查和修复
-- ================================

-- 检查并修复orphaned records
DELETE FROM questionnaire_responses 
WHERE user_id IS NOT NULL 
AND user_id NOT IN (SELECT id FROM auth.users);

-- 检查产品数据完整性
UPDATE lighting_products 
SET rating = 0 WHERE rating IS NULL;

UPDATE lighting_products 
SET review_count = 0 WHERE review_count IS NULL;

-- ================================
-- 性能优化
-- ================================

-- 分析表统计信息
ANALYZE user_favorites;
ANALYZE user_preference_profiles;
ANALYZE user_behavior_analytics;
ANALYZE recommendation_logs;
ANALYZE lighting_products;
ANALYZE questionnaire_responses;

-- ================================
-- 完成迁移
-- ================================

-- 记录迁移完成
INSERT INTO migration_tracking (
  version, 
  description, 
  executed_at, 
  execution_time_ms
) VALUES (
  '006',
  '🚀 SuperClaude + MCP 紧急修复: 用户收藏、字段匹配、行为分析、推荐日志',
  NOW(),
  0 -- 将由实际执行时间更新
);