// =====================================================
// 图片上传和存储管理模块
// 支持多种存储后端：Supabase Storage, Cloudflare R2, 本地存储
// =====================================================

export interface UploadConfig {
  provider: 'supabase' | 'cloudflare' | 'local'
  maxFileSize: number // bytes
  allowedTypes: string[]
  quality: number // 0-1
  maxWidth?: number
  maxHeight?: number
  generateThumbnail: boolean
  thumbnailSizes: { width: number; height: number; suffix: string }[]
}

export interface UploadResult {
  success: boolean
  url?: string
  thumbnails?: { size: string; url: string }[]
  filename?: string
  error?: string
  metadata?: {
    size: number
    type: string
    dimensions?: { width: number; height: number }
  }
}

export interface ImageProcessingOptions {
  quality?: number
  maxWidth?: number
  maxHeight?: number
  format?: 'jpeg' | 'png' | 'webp'
  preserveAspectRatio?: boolean
}

// 默认配置
export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  provider: 'supabase',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
  generateThumbnail: true,
  thumbnailSizes: [
    { width: 150, height: 150, suffix: 'thumb' },
    { width: 400, height: 300, suffix: 'medium' },
    { width: 800, height: 600, suffix: 'large' }
  ]
}

// 图片压缩和处理工具
export class ImageProcessor {
  static async compressImage(
    file: File,
    options: ImageProcessingOptions = {}
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          const {
            quality = 0.8,
            maxWidth = 1920,
            maxHeight = 1080,
            format = 'jpeg',
            preserveAspectRatio = true
          } = options

          let { width, height } = img

          // 计算新尺寸
          if (preserveAspectRatio) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            if (ratio < 1) {
              width *= ratio
              height *= ratio
            }
          } else {
            width = Math.min(width, maxWidth)
            height = Math.min(height, maxHeight)
          }

          // 设置画布尺寸
          canvas.width = width
          canvas.height = height

          // 绘制图片
          ctx?.drawImage(img, 0, 0, width, height)

          // 转换为Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: `image/${format}`,
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              } else {
                reject(new Error('Image compression failed'))
              }
            },
            `image/${format}`,
            quality
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  static async generateThumbnail(
    file: File,
    width: number,
    height: number
  ): Promise<File> {
    return this.compressImage(file, {
      maxWidth: width,
      maxHeight: height,
      quality: 0.8,
      preserveAspectRatio: true
    })
  }

  static validateFile(file: File, config: UploadConfig): { valid: boolean; error?: string } {
    // 检查文件类型
    if (!config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `不支持的文件类型。支持的类型：${config.allowedTypes.join(', ')}`
      }
    }

    // 检查文件大小
    if (file.size > config.maxFileSize) {
      const maxSizeMB = config.maxFileSize / (1024 * 1024)
      return {
        valid: false,
        error: `文件太大。最大允许 ${maxSizeMB.toFixed(1)}MB`
      }
    }

    return { valid: true }
  }

  static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }
}

// Supabase存储适配器
export class SupabaseStorageAdapter {
  private supabase: any
  private bucketName: string

  constructor(supabaseClient: any, bucketName = 'product-images') {
    this.supabase = supabaseClient
    this.bucketName = bucketName
  }

  async upload(
    file: File,
    path: string,
    options: { upsert?: boolean; metadata?: Record<string, any> } = {}
  ): Promise<UploadResult> {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(path, file, {
          upsert: options.upsert || false,
          metadata: options.metadata
        })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      // 获取公共URL
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(path)

      return {
        success: true,
        url: urlData.publicUrl,
        filename: data.path,
        metadata: {
          size: file.size,
          type: file.type
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  async delete(path: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([path])

      return !error
    } catch {
      return false
    }
  }

  getPublicUrl(path: string): string {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}

// 本地存储适配器（开发环境）
export class LocalStorageAdapter {
  private baseUrl: string

  constructor(baseUrl = '/uploads') {
    this.baseUrl = baseUrl
  }

  async upload(file: File, path: string): Promise<UploadResult> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', path)

      const response = await fetch('/api/upload/local', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      
      return {
        success: true,
        url: `${this.baseUrl}/${result.filename}`,
        filename: result.filename,
        metadata: {
          size: file.size,
          type: file.type
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  async delete(filename: string): Promise<boolean> {
    try {
      const response = await fetch('/api/upload/local', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename })
      })

      return response.ok
    } catch {
      return false
    }
  }
}

// 主上传管理器
export class UploadManager {
  private config: UploadConfig
  private adapter: SupabaseStorageAdapter | LocalStorageAdapter

  constructor(config: UploadConfig, adapter: SupabaseStorageAdapter | LocalStorageAdapter) {
    this.config = config
    this.adapter = adapter
  }

  async uploadSingle(
    file: File,
    folder = 'products',
    customFilename?: string
  ): Promise<UploadResult> {
    try {
      // 验证文件
      const validation = ImageProcessor.validateFile(file, this.config)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        }
      }

      // 生成文件名
      const timestamp = Date.now()
      const filename = customFilename || `${timestamp}_${file.name}`
      const path = `${folder}/${filename}`

      // 压缩图片
      const compressedFile = await ImageProcessor.compressImage(file, {
        quality: this.config.quality,
        maxWidth: this.config.maxWidth,
        maxHeight: this.config.maxHeight
      })

      // 获取图片尺寸
      const dimensions = await ImageProcessor.getImageDimensions(compressedFile)

      // 上传主图片
      const mainResult = await this.adapter.upload(compressedFile, path)
      if (!mainResult.success) {
        return mainResult
      }

      const result: UploadResult = {
        ...mainResult,
        metadata: {
          ...mainResult.metadata,
          size: mainResult.metadata?.size || 0,
          type: mainResult.metadata?.type || 'image/jpeg',
          dimensions
        }
      }

      // 生成缩略图
      if (this.config.generateThumbnail) {
        const thumbnails: { size: string; url: string }[] = []

        for (const thumbConfig of this.config.thumbnailSizes) {
          try {
            const thumbnail = await ImageProcessor.generateThumbnail(
              compressedFile,
              thumbConfig.width,
              thumbConfig.height
            )

            const thumbPath = `${folder}/thumbnails/${thumbConfig.suffix}_${filename}`
            const thumbResult = await this.adapter.upload(thumbnail, thumbPath)

            if (thumbResult.success && thumbResult.url) {
              thumbnails.push({
                size: thumbConfig.suffix,
                url: thumbResult.url
              })
            }
          } catch (error) {
            console.warn(`Failed to generate ${thumbConfig.suffix} thumbnail:`, error)
          }
        }

        result.thumbnails = thumbnails
      }

      return result
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  async uploadMultiple(
    files: File[],
    folder = 'products'
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = []

    for (const file of files) {
      const result = await this.uploadSingle(file, folder)
      results.push(result)
    }

    return results
  }

  async deleteFile(filename: string): Promise<boolean> {
    return await this.adapter.delete(filename)
  }
}

// 工厂函数
export const createUploadManager = (
  config: Partial<UploadConfig> = {},
  supabaseClient?: any
): UploadManager => {
  const finalConfig = { ...DEFAULT_UPLOAD_CONFIG, ...config }
  
  let adapter: SupabaseStorageAdapter | LocalStorageAdapter
  
  if (finalConfig.provider === 'supabase' && supabaseClient) {
    adapter = new SupabaseStorageAdapter(supabaseClient)
  } else {
    adapter = new LocalStorageAdapter()
  }

  return new UploadManager(finalConfig, adapter)
}

export default UploadManager