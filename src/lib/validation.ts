/**
 * 🔐 API输入验证 - 安全数据验证
 */

import { z } from 'zod';

// 问卷数据验证
export const QuestionnaireSchema = z.object({
  room_type: z.string().min(1, '房间类型不能为空').max(50, '房间类型过长'),
  room_size: z.enum(['small', 'medium', 'large'], {
    errorMap: () => ({ message: '房间尺寸必须是small、medium或large' })
  }),
  style_preference: z.string().min(1, '风格偏好不能为空').max(100, '风格偏好过长'),
  budget_min: z.number().min(0, '最小预算不能为负数').max(999999, '预算过高'),
  budget_max: z.number().min(0, '最大预算不能为负数').max(999999, '预算过高'),
  smart_features: z.boolean().optional(),
  lighting_needs: z.array(z.string()).optional(),
  color_temperature: z.enum(['warm', 'neutral', 'cool']).optional(),
  dimming_preference: z.boolean().optional(),
  installation_type: z.enum(['ceiling', 'wall', 'floor', 'table']).optional()
}).refine(data => data.budget_min <= data.budget_max, {
  message: '最小预算不能大于最大预算',
  path: ['budget_min']
});

// 产品搜索验证
export const ProductSearchSchema = z.object({
  query: z.string().max(100, '搜索关键词过长').optional(),
  category: z.string().max(50, '分类名称过长').optional(),
  brand: z.string().max(50, '品牌名称过长').optional(),
  price_min: z.number().min(0, '最小价格不能为负数').max(999999, '价格过高').optional(),
  price_max: z.number().min(0, '最大价格不能为负数').max(999999, '价格过高').optional(),
  page: z.number().min(1, '页码必须大于0').max(100, '页码过大').default(1),
  limit: z.number().min(1, '每页数量必须大于0').max(50, '每页数量过大').default(20)
});

// 用户交互验证
export const UserInteractionSchema = z.object({
  product_id: z.string().uuid('产品ID格式错误'),
  interaction_type: z.enum(['view', 'click', 'favorite', 'share', 'compare', 'purchase_click'], {
    errorMap: () => ({ message: '交互类型无效' })
  }),
  source: z.string().max(100, '来源信息过长').optional(),
  page_url: z.string().url('页面URL格式错误').optional(),
  referrer: z.string().url('推荐来源URL格式错误').optional()
});

// 用户资料验证
export const UserProfileSchema = z.object({
  full_name: z.string().min(1, '姓名不能为空').max(100, '姓名过长').optional(),
  email: z.string().email('邮箱格式错误').optional(),
  avatar_url: z.string().url('头像URL格式错误').optional(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.enum(['zh-CN', 'en-US']).optional(),
    notification_enabled: z.boolean().optional()
  }).optional()
});

// 错误处理辅助函数
export function formatValidationError(error: z.ZodError): { 
  field: string; 
  message: string; 
}[] {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message
  }));
}

// 验证中间件
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: { field: string; message: string }[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatValidationError(error) };
    }
    return { success: false, errors: [{ field: 'unknown', message: '验证失败' }] };
  }
}

// 清理和消毒输入
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // 移除潜在的HTML标签
    .replace(/javascript:/gi, '') // 移除JavaScript协议
    .replace(/on\w+=/gi, '') // 移除事件处理器
    .substring(0, 1000); // 限制长度
}

// 验证文件上传
export const FileUploadSchema = z.object({
  file: z.object({
    name: z.string().min(1, '文件名不能为空'),
    type: z.string().refine(
      type => ['image/jpeg', 'image/png', 'image/webp'].includes(type),
      '只支持JPEG、PNG、WebP格式图片'
    ),
    size: z.number().max(5 * 1024 * 1024, '文件大小不能超过5MB')
  })
});

// Rate limiting 验证
export const RateLimitSchema = z.object({
  ip: z.string().ip('IP地址格式错误'),
  endpoint: z.string().min(1, '接口路径不能为空'),
  timestamp: z.date()
});