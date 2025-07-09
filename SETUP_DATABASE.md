# 🗄️ Supabase 数据库手动设置指南

## 📋 设置步骤

### 1. 打开 Supabase 控制台
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单中的 "SQL Editor"

### 2. 执行数据库脚本
1. 复制 `database-setup.sql` 文件的完整内容
2. 粘贴到 SQL Editor 中
3. 点击 "Run" 按钮执行

### 3. 验证设置结果
执行以下命令验证数据库设置：
```bash
node scripts/verify-database-integration.js
```

### 4. 生成产品数据
数据库设置完成后，运行：
```bash
node scripts/generate-rich-product-data.js
```

## 🎯 快速验证命令

检查表是否创建成功：
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
```

检查品牌和分类数据：
```sql
SELECT COUNT(*) as brand_count FROM brands;
SELECT COUNT(*) as category_count FROM categories;
```

## ⚠️ 常见问题

### 问题1: 表已存在错误
如果看到 "already exists" 错误，这是正常的。SQL脚本使用了 `IF NOT EXISTS` 来避免重复创建。

### 问题2: 权限错误
确保你有项目的管理员权限，或者使用 Service Role Key。

### 问题3: 数据插入失败
检查 RLS (Row Level Security) 策略是否正确配置。

## 🚀 后续步骤

1. ✅ **数据库表结构创建完成**
2. ✅ **基础数据填充完成** (品牌、分类)
3. 🔄 **产品数据生成** (即将执行)
4. 🔄 **API集成测试**
5. 🔄 **前端界面优化**

## 🔗 相关文件

- `database-setup.sql` - 完整表结构脚本
- `scripts/verify-database-integration.js` - 验证脚本
- `scripts/generate-rich-product-data.js` - 产品数据生成
- `src/lib/database-integration.ts` - 数据库集成代码