-- =====================================================
-- LightingPro 数据库初始化脚本
-- =====================================================

-- 创建产品表
CREATE TABLE IF NOT EXISTS lighting_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  specifications JSONB DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  affiliate_links JSONB DEFAULT '{}',
  commission_rate DECIMAL(5,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建问卷回答表
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  room_type TEXT NOT NULL,
  room_size TEXT NOT NULL,
  style_preference TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  current_lighting TEXT,
  special_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入示例产品数据
INSERT INTO lighting_products (
  name, brand, category, price, description, specifications, 
  image_urls, affiliate_links, commission_rate, rating, review_count, features
) VALUES 
(
  'LED吸顶灯 现代简约',
  'Philips',
  '吸顶灯',
  299.00,
  '现代简约风格LED吸顶灯，适合客厅卧室使用，亮度可调节，节能环保。',
  '{"wattage": 36, "lumens": 3600, "color_temperature": "3000K-6500K", "dimmable": true, "smart_compatible": true}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400'],
  '{"amazon": "https://amazon.cn/dp/example1", "jd": "https://item.jd.com/example1.html"}'::jsonb,
  5.5,
  4.5,
  127,
  ARRAY['可调光', '智能控制', '节能', '现代设计']
),
(
  '水晶吊灯 欧式奢华',
  'OSRAM',
  '吊灯',
  1299.00,
  '欧式奢华水晶吊灯，适合客厅餐厅，营造优雅氛围。',
  '{"wattage": 60, "lumens": 4800, "color_temperature": "2700K", "dimmable": false, "smart_compatible": false}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
  '{"amazon": "https://amazon.cn/dp/example2", "tmall": "https://detail.tmall.com/example2.htm"}'::jsonb,
  8.0,
  4.3,
  89,
  ARRAY['水晶装饰', '奢华设计', '高亮度', '欧式风格']
),
(
  '北欧风台灯 原木质感',
  'IKEA',
  '台灯',
  199.00,
  '北欧风原木台灯，温馨舒适，适合卧室书房使用。',
  '{"wattage": 12, "lumens": 800, "color_temperature": "2700K", "dimmable": true, "smart_compatible": false}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'],
  '{"ikea": "https://www.ikea.cn/example3", "amazon": "https://amazon.cn/dp/example3"}'::jsonb,
  4.0,
  4.7,
  203,
  ARRAY['原木材质', '北欧设计', '护眼光源', '可调光']
),
(
  'LED筒灯 嵌入式',
  'Panasonic',
  '筒灯',
  89.00,
  '嵌入式LED筒灯，适合天花板安装，节能高效。',
  '{"wattage": 9, "lumens": 900, "color_temperature": "4000K", "dimmable": false, "smart_compatible": false}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
  '{"amazon": "https://amazon.cn/dp/example4", "suning": "https://product.suning.com/example4.html"}'::jsonb,
  6.0,
  4.2,
  156,
  ARRAY['嵌入式', '节能', '高亮度', '简约']
),
(
  '创意壁灯 工业风',
  'Industrial',
  '壁灯',
  159.00,
  '工业风创意壁灯，金属质感，适合现代简约风格装修。',
  '{"wattage": 15, "lumens": 1200, "color_temperature": "2700K", "dimmable": true, "smart_compatible": false}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
  '{"amazon": "https://amazon.cn/dp/example5", "taobao": "https://item.taobao.com/example5.htm"}'::jsonb,
  7.5,
  4.6,
  98,
  ARRAY['工业风格', '金属材质', '创意设计', '可调光']
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_lighting_products_category ON lighting_products(category);
CREATE INDEX IF NOT EXISTS idx_lighting_products_price ON lighting_products(price);
CREATE INDEX IF NOT EXISTS idx_lighting_products_rating ON lighting_products(rating);
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_created_at ON questionnaire_responses(created_at);

-- 显示创建结果
SELECT 'Database initialization completed!' as status;
SELECT COUNT(*) as product_count FROM lighting_products;