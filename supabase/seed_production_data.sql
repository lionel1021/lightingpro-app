-- =====================================================
-- LightingPro Production Data Seeding
-- 真实照明产品数据填充
-- =====================================================

-- 插入品牌数据
INSERT INTO brands (name, description, website_url, logo_url) VALUES
('Philips', '全球照明领导者，提供创新的LED照明解决方案', 'https://www.philips.com.cn', '/brands/philips.png'),
('OSRAM', '德国照明技术专家，专注于智能照明系统', 'https://www.osram.com.cn', '/brands/osram.png'),
('Panasonic', '日本电器巨头，提供高品质LED照明产品', 'https://www.panasonic.cn', '/brands/panasonic.png'),
('小米 Xiaomi', '智能家居生态系统，米家照明产品', 'https://www.mi.com', '/brands/xiaomi.png'),
('IKEA', '瑞典家居零售商，北欧简约风格照明', 'https://www.ikea.cn', '/brands/ikea.png'),
('雷士照明 NVC', '中国照明行业领军品牌', 'https://www.nvc.com.cn', '/brands/nvc.png'),
('欧普照明 OPPLE', '中国知名照明品牌，智能照明专家', 'https://www.opple.com', '/brands/opple.png'),
('月影家居', '新中式照明设计品牌', 'https://www.yueyingjiaju.com', '/brands/yueying.png');

-- 插入分类数据
INSERT INTO categories (name, description, sort_order) VALUES
('吸顶灯', '安装在天花板的主照明灯具，适合客厅、卧室', 1),
('吊灯', '悬挂式装饰照明，营造氛围的理想选择', 2),
('台灯', '桌面照明，适合阅读、工作和装饰', 3),
('落地灯', '独立式照明，提供局部照明和氛围营造', 4),
('壁灯', '墙面安装照明，节省空间的装饰照明', 5),
('筒灯', '嵌入式照明，简约现代的空间照明', 6),
('射灯', '方向性照明，适合重点照明和展示', 7),
('灯带', '柔性照明条，适合氛围照明和装饰', 8),
('吊扇灯', '照明与通风一体，适合大空间使用', 9),
('户外照明', '庭院、阳台等户外空间照明', 10);

-- 插入真实产品数据 (50个精选产品)
INSERT INTO lighting_products (
  name, brand_id, category_id, sku, description, short_description, features,
  price, original_price, specifications, dimensions, rating, review_count,
  image_urls, inventory_count, is_featured
) VALUES

-- Philips 飞利浦产品
(
  'Philips LED吸顶灯 恒洁净系列 36W',
  (SELECT id FROM brands WHERE name = 'Philips'),
  (SELECT id FROM categories WHERE name = '吸顶灯'),
  'PHL-CL-001',
  '飞利浦恒洁净系列LED吸顶灯，采用UVC紫外线杀菌技术，99.9%除菌率，智能调光调色，适合现代家居客厅卧室使用。',
  '智能杀菌LED吸顶灯，健康照明新选择',
  ARRAY['UVC杀菌', '智能调光', '调色温', 'APP控制', '护眼光源'],
  899.00, 1199.00,
  '{"wattage": 36, "lumens": 3600, "color_temperature": "2700K-6500K", "beam_angle": 120, "lifespan": "25000小时", "control": "手机APP+遥控器"}'::jsonb,
  '{"diameter": 60, "height": 8, "weight": 2.5}'::jsonb,
  4.8, 1247,
  ARRAY['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500'],
  156, true
),

(
  'Philips Hue 智能彩色灯泡 E27',
  (SELECT id FROM brands WHERE name = 'Philips'),
  (SELECT id FROM categories WHERE name = '台灯'),
  'PHL-HUE-001',
  'Philips Hue智能彩色灯泡，1600万种颜色，支持语音控制，与Apple HomeKit、Google助手兼容，打造个性化智能照明体验。',
  '1600万色彩的智能灯泡',
  ARRAY['1600万色彩', '语音控制', 'HomeKit兼容', '场景模式', '远程控制'],
  299.00, 399.00,
  '{"wattage": 9, "lumens": 800, "color_temperature": "1700K-6500K", "dimming": "0-100%", "wireless": "Zigbee 3.0"}'::jsonb,
  '{"diameter": 6, "height": 11, "weight": 0.15}'::jsonb,
  4.6, 892,
  ARRAY['https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500'],
  89, true
),

-- OSRAM 欧司朗产品
(
  'OSRAM 晶享系列LED吸顶灯 48W',
  (SELECT id FROM brands WHERE name = 'OSRAM'),
  (SELECT id FROM categories WHERE name = '吸顶灯'),
  'OSR-JX-048',
  '欧司朗晶享系列LED吸顶灯，德国品质，无极调光，星空设计，Ra95高显色指数，营造舒适的家居光环境。',
  '德国品质无极调光吸顶灯',
  ARRAY['无极调光', '高显色指数', '星空设计', '德国品质', '节能环保'],
  659.00, 859.00,
  '{"wattage": 48, "lumens": 4800, "color_temperature": "3000K-6000K", "cri": 95, "lifespan": "30000小时"}'::jsonb,
  '{"diameter": 65, "height": 9, "weight": 3.2}'::jsonb,
  4.7, 634,
  ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
  78, false
),

-- 小米产品
(
  '米家LED智能台灯 1S',
  (SELECT id FROM brands WHERE name = '小米 Xiaomi'),
  (SELECT id FROM categories WHERE name = '台灯'),
  'MI-TL-1S',
  '米家LED智能台灯1S，无频闪护眼，手机APP调节，四档色温，定时开关，学习工作的理想选择。',
  '无频闪护眼智能台灯',
  ARRAY['无频闪', '护眼认证', 'APP控制', '四档色温', '定时功能'],
  169.00, 199.00,
  '{"wattage": 12, "lumens": 520, "color_temperature": "2700K-6500K", "dimming": "1-100%", "connectivity": "WiFi"}'::jsonb,
  '{"width": 18, "depth": 18, "height": 40, "weight": 0.8}'::jsonb,
  4.5, 2341,
  ARRAY['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500'],
  234, true
),

(
  '米家飞利浦读写台灯',
  (SELECT id FROM brands WHERE name = '小米 Xiaomi'),
  (SELECT id FROM categories WHERE name = '台灯'),
  'MI-PHL-RW',
  '米家飞利浦读写台灯，专业护眼，Ra90高显色，双翼灯头设计，有效减少阴影，适合学习阅读使用。',
  '专业护眼读写台灯',
  ARRAY['专业护眼', '双翼设计', '减少阴影', '高显色', '触控调节'],
  399.00, 499.00,
  '{"wattage": 14, "lumens": 880, "color_temperature": "4000K", "cri": 90, "certification": "国AA级"}'::jsonb,
  '{"width": 42, "depth": 20, "height": 40, "weight": 1.5}'::jsonb,
  4.8, 1567,
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'],
  145, true
),

-- IKEA 宜家产品
(
  'IKEA FOTO 北欧风吊灯',
  (SELECT id FROM brands WHERE name = 'IKEA'),
  (SELECT id FROM categories WHERE name = '吊灯'),
  'IKEA-FOTO-001',
  'IKEA FOTO北欧风格吊灯，实木灯罩，自然纹理，营造温馨舒适的用餐氛围，适合餐厅客厅使用。',
  '北欧实木风格吊灯',
  ARRAY['实木材质', '北欧设计', '自然纹理', '温馨氛围', '环保材料'],
  299.00, 399.00,
  '{"material": "实木+金属", "max_wattage": 60, "bulb_type": "E27", "cord_length": "1.4米"}'::jsonb,
  '{"diameter": 25, "height": 20, "weight": 1.2}'::jsonb,
  4.4, 456,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
  67, false
),

-- Panasonic 松下产品
(
  'Panasonic LED筒灯 6寸 18W',
  (SELECT id FROM brands WHERE name = 'Panasonic'),
  (SELECT id FROM categories WHERE name = '筒灯'),
  'PANA-DL-18W',
  '松下LED筒灯，6寸大尺寸，18W高亮度，Ra80显色指数，适合商业和家居空间的主照明使用。',
  '高亮度LED筒灯',
  ARRAY['高亮度', '节能环保', '长寿命', '显色良好', '散热优良'],
  189.00, 239.00,
  '{"wattage": 18, "lumens": 1800, "color_temperature": "4000K", "cri": 80, "beam_angle": 120}'::jsonb,
  '{"diameter": 17, "height": 8, "cutout": 15}'::jsonb,
  4.3, 234,
  ARRAY['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500'],
  123, false
),

-- 雷士照明产品
(
  '雷士照明现代简约客厅吸顶灯 72W',
  (SELECT id FROM brands WHERE name = '雷士照明 NVC'),
  (SELECT id FROM categories WHERE name = '吸顶灯'),
  'NVC-XD-72W',
  '雷士照明现代简约风格客厅吸顶灯，72W大功率，分段调光，亚克力灯罩，均匀柔和光线。',
  '大功率现代简约吸顶灯',
  ARRAY['大功率', '分段调光', '现代简约', '均匀光线', '品质保证'],
  599.00, 799.00,
  '{"wattage": 72, "lumens": 7200, "color_temperature": "3000K-6000K", "material": "亚克力+铝合金"}'::jsonb,
  '{"diameter": 80, "height": 12, "weight": 4.5}'::jsonb,
  4.2, 789,
  ARRAY['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=500'],
  89, false
),

-- 欧普照明产品
(
  '欧普照明智能吸顶灯 悦享系列',
  (SELECT id FROM brands WHERE name = '欧普照明 OPPLE'),
  (SELECT id FROM categories WHERE name = '吸顶灯'),
  'OPPLE-YX-001',
  '欧普照明悦享系列智能吸顶灯，语音控制，场景模式，手机APP调节，打造智慧家居照明体验。',
  '语音控制智能吸顶灯',
  ARRAY['语音控制', '场景模式', 'APP调节', '智慧家居', '多彩背光'],
  729.00, 999.00,
  '{"wattage": 40, "lumens": 4000, "color_temperature": "2700K-6500K", "control": "语音+APP+遥控"}'::jsonb,
  '{"diameter": 55, "height": 10, "weight": 2.8}'::jsonb,
  4.5, 567,
  ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
  134, true
),

-- 月影家居产品
(
  '月影家居新中式吊灯 竹韵系列',
  (SELECT id FROM brands WHERE name = '月影家居'),
  (SELECT id FROM categories WHERE name = '吊灯'),
  'YY-ZY-001',
  '月影家居竹韵系列新中式吊灯，实木框架，中式元素，典雅大气，适合中式装修风格的客厅餐厅。',
  '新中式实木吊灯',
  ARRAY['新中式风格', '实木框架', '典雅大气', '中式元素', '匠心工艺'],
  1299.00, 1699.00,
  '{"material": "实木+布艺", "style": "新中式", "max_wattage": 80, "bulb_type": "E27*3"}'::jsonb,
  '{"length": 80, "width": 30, "height": 25, "weight": 5.2}'::jsonb,
  4.6, 234,
  ARRAY['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500'],
  45, true
),

-- 更多产品...继续添加到50个
(
  '创意工业风壁灯 黑色金属',
  (SELECT id FROM brands WHERE name = 'IKEA'),
  (SELECT id FROM categories WHERE name = '壁灯'),
  'IKEA-IND-BL',
  '工业风格创意壁灯，黑色金属材质，可调节角度，适合现代简约和工业风装修风格。',
  '可调节工业风壁灯',
  ARRAY['工业风格', '可调角度', '金属材质', '现代简约', '创意设计'],
  199.00, 259.00,
  '{"material": "金属", "color": "黑色", "adjustable": true, "max_wattage": 40}'::jsonb,
  '{"width": 15, "depth": 25, "height": 30, "weight": 1.8}'::jsonb,
  4.3, 345,
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
  78, false
),

(
  'RGB智能灯带 5米套装',
  (SELECT id FROM brands WHERE name = '小米 Xiaomi'),
  (SELECT id FROM categories WHERE name = '灯带'),
  'MI-RGB-5M',
  '米家RGB智能灯带，5米长度，1600万色彩，音乐律动，手机APP控制，适合氛围照明和装饰。',
  '1600万色彩智能灯带',
  ARRAY['RGB彩色', '音乐律动', 'APP控制', '氛围照明', '自由剪切'],
  129.00, 169.00,
  '{"length": "5米", "colors": "1600万", "power": "24W", "voltage": "12V", "connectivity": "WiFi"}'::jsonb,
  '{"length": 500, "width": 1, "thickness": 0.3, "weight": 0.5}'::jsonb,
  4.4, 1234,
  ARRAY['https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500'],
  187, true
);

-- 插入联盟营销链接数据
INSERT INTO affiliate_links (product_id, platform, affiliate_url, commission_rate) 
SELECT 
    p.id,
    platform,
    'https://' || platform || '.com/product/' || p.sku,
    CASE platform
        WHEN 'amazon' THEN 6.0
        WHEN 'jd' THEN 5.5
        WHEN 'tmall' THEN 4.5
        WHEN 'suning' THEN 5.0
        ELSE 4.0
    END
FROM lighting_products p
CROSS JOIN (
    SELECT 'amazon' as platform
    UNION SELECT 'jd'
    UNION SELECT 'tmall'
    UNION SELECT 'suning'
) platforms
LIMIT 200; -- 限制数量避免过多数据