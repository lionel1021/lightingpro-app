import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// 本地文件上传API
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const rawUploadPath = formData.get('path') as string || 'general'
    
    // 安全验证和清理上传路径
    const sanitizeUploadPath = (path: string): string => {
      // 移除危险字符，只允许字母数字和连字符
      return path.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50)
    }
    
    const uploadPath = sanitizeUploadPath(rawUploadPath)
    
    if (!uploadPath || uploadPath === '') {
      return NextResponse.json(
        { error: 'Invalid upload path' },
        { status: 400 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // 验证文件大小（5MB限制）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // 创建上传目录
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', uploadPath)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const basename = path.basename(file.name, fileExtension)
    const filename = `${timestamp}_${basename}${fileExtension}`
    const filepath = path.join(uploadsDir, filename)

    // 将文件保存到磁盘
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // 返回文件信息
    return NextResponse.json({
      success: true,
      filename: `${uploadPath}/${filename}`,
      originalName: file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${uploadPath}/${filename}`
    })

  } catch (error) {
    // Log error for monitoring (use proper logging service in production)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Upload failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// 删除本地文件
export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json()

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }

    // 安全验证文件名
    const sanitizeFilename = (filename: string): string => {
      return filename.replace(/[^a-zA-Z0-9-_.]/g, '').slice(0, 100)
    }
    
    const safeFilename = sanitizeFilename(filename)
    const filepath = path.join(process.cwd(), 'public', 'uploads', safeFilename)

    // 检查文件是否存在
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // 删除文件
    await unlink(filepath)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Delete failed',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}