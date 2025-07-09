'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Eye, Plus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { createUploadManager, UploadResult } from '@/lib/upload';

interface ImageUploadProps {
  onUpload?: (results: UploadResult[]) => void;
  maxFiles?: number;
  folder?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  showPreview?: boolean;
  acceptedTypes?: string[];
}

interface UploadState {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  result?: UploadResult;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxFiles = 5,
  folder = 'products',
  multiple = true,
  disabled = false,
  className = '',
  showPreview = true,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [uploadStates, setUploadStates] = useState<UploadState[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadManager = createUploadManager({
    provider: 'local', // 使用本地存储
    allowedTypes: acceptedTypes
  });

  const handleFiles = useCallback(async (files: File[]) => {
    if (disabled) return;

    const filesToProcess = multiple 
      ? files.slice(0, maxFiles - uploadStates.length)
      : files.slice(0, 1);

    // 创建预览状态
    const newStates: UploadState[] = filesToProcess.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false
    }));

    if (!multiple) {
      // 单文件模式，清除之前的状态
      uploadStates.forEach(state => URL.revokeObjectURL(state.preview));
      setUploadStates(newStates);
    } else {
      setUploadStates(prev => [...prev, ...newStates]);
    }

    // 开始上传
    const results: UploadResult[] = [];
    
    for (let i = 0; i < newStates.length; i++) {
      const state = newStates[i];
      const stateIndex = multiple ? uploadStates.length + i : i;

      // 更新上传状态
      setUploadStates(prev => {
        const updated = [...prev];
        updated[stateIndex] = { ...updated[stateIndex], uploading: true };
        return updated;
      });

      try {
        const result = await uploadManager.uploadSingle(state.file, folder);
        
        if (result.success) {
          results.push(result);
          
          // 更新成功状态
          setUploadStates(prev => {
            const updated = [...prev];
            updated[stateIndex] = {
              ...updated[stateIndex],
              uploading: false,
              uploaded: true,
              result
            };
            return updated;
          });
        } else {
          // 更新错误状态
          setUploadStates(prev => {
            const updated = [...prev];
            updated[stateIndex] = {
              ...updated[stateIndex],
              uploading: false,
              error: result.error
            };
            return updated;
          });
        }
      } catch (error) {
        setUploadStates(prev => {
          const updated = [...prev];
          updated[stateIndex] = {
            ...updated[stateIndex],
            uploading: false,
            error: error instanceof Error ? error.message : 'Upload failed'
          };
          return updated;
        });
      }
    }

    // 通知上传完成
    if (results.length > 0 && onUpload) {
      onUpload(results);
    }
  }, [uploadStates, multiple, maxFiles, folder, disabled, onUpload, uploadManager]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setUploadStates(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const openFilePicker = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const canAddMore = uploadStates.length < maxFiles;
  const acceptString = acceptedTypes.join(',');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {(canAddMore || !multiple) && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-all duration-200
            ${dragActive
              ? 'border-blue-500 bg-blue-50'
              : disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }
          `}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFilePicker}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptString}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-3">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
              disabled ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600'
            }`}>
              <Upload className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                {multiple ? '上传图片' : '选择图片'}
              </h3>
              <p className={`text-sm ${disabled ? 'text-gray-300' : 'text-gray-600'}`}>
                拖拽文件到此处或点击选择文件
              </p>
              <p className={`text-xs mt-1 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
                支持 {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} 格式
                {multiple && ` (最多 ${maxFiles} 个文件)`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Grid */}
      {showPreview && uploadStates.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadStates.map((state, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={state.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(state.preview, '_blank');
                      }}
                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                      title="预览"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                      title="删除"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute top-2 right-2">
                {state.uploading ? (
                  <div className="bg-blue-600 text-white p-1 rounded-full">
                    <Loader2 className="w-3 h-3 animate-spin" />
                  </div>
                ) : state.uploaded ? (
                  <div className="bg-green-600 text-white p-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                ) : state.error ? (
                  <div className="bg-red-600 text-white p-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                ) : null}
              </div>

              {/* Error Message */}
              {state.error && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-red-600 text-white text-xs px-2 py-1 rounded truncate">
                    {state.error}
                  </div>
                </div>
              )}

              {/* File Name */}
              <div className="mt-2 text-xs text-gray-600 truncate">
                {state.file.name}
              </div>
            </div>
          ))}

          {/* Add More Button */}
          {multiple && canAddMore && (
            <div
              onClick={openFilePicker}
              className={`
                aspect-square border-2 border-dashed border-gray-300 rounded-lg 
                flex items-center justify-center cursor-pointer
                hover:border-blue-400 hover:bg-blue-50 transition-colors
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-xs text-gray-500">添加更多</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Summary */}
      {uploadStates.length > 0 && (
        <div className="text-sm text-gray-600">
          已选择 {uploadStates.length} 个文件
          {uploadStates.filter(s => s.uploaded).length > 0 && (
            <span className="text-green-600 ml-2">
              • {uploadStates.filter(s => s.uploaded).length} 个已上传
            </span>
          )}
          {uploadStates.filter(s => s.uploading).length > 0 && (
            <span className="text-blue-600 ml-2">
              • {uploadStates.filter(s => s.uploading).length} 个上传中
            </span>
          )}
          {uploadStates.filter(s => s.error).length > 0 && (
            <span className="text-red-600 ml-2">
              • {uploadStates.filter(s => s.error).length} 个失败
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;