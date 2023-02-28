/** @format */

import { round } from '../utils/utils'
import { getInstance } from './axios-instance'

export interface IImageCompressRequest {
  file: Blob
  fileName: string
  fileType: string // eg: image/jpeg
  model: string // model name, eg: 'mbt2018'
  metric: 'mse' | 'ms-ssim'
  quality: number
}

export interface IImageCompressResponse {
  data: Blob
  metrics: Record<string, string>
}

export async function compressImage(options: IImageCompressRequest): Promise<IImageCompressResponse> {
  const { file, fileName, fileType, model, metric, quality } = options

  const reqData = {
    filename: fileName,
    model,
    filetype: fileType,
    metric,
    quality: quality.toString(),
    file,
  }

  let formData = new FormData()
  Object.entries(reqData).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return compressRequest('/api/compress', formData, file)
}

export interface IAutoImageCompressRequest {
  file: Blob
  fileName: string
  fileType: string // eg: image/jpeg
  metric: 'mse' | 'ms-ssim'
  quality: 'high' | 'low' | 'medium' | 'auto'
}

export interface IAutoImageCompressResponse {
  data: Blob
  metrics: Record<string, string>
}

export async function autoCompressImage(options: IAutoImageCompressRequest): Promise<IAutoImageCompressResponse> {
  const { file, fileName, fileType, metric, quality } = options
  const reqData = {
    filename: fileName,
    filetype: fileType,
    metric,
    file,
    quality,
  }

  let formData = new FormData()
  Object.entries(reqData).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return compressRequest('/api/auto-compress', formData, file)
}

async function compressRequest(
  path: string,
  formData: FormData,
  file: Blob,
): Promise<IImageCompressResponse | IAutoImageCompressResponse> {
  const resp = await getInstance().post(path, formData, {
    responseType: 'blob',
  })
  // extract metrics from response header
  const metrics = JSON.parse(resp.headers['x-metrics'])
  // 获取文件大小
  const respData = resp.data
  const compressedSize = round(respData.size / 1024, 2)
  metrics.compressed_size = compressedSize

  // 替换 original size 和 compression ratio
  const originalSize = round(file.size / 1024, 2)
  const compressionRatio = round((1 - compressedSize / originalSize) * 100, 4)
  metrics.original_size = originalSize
  metrics.compressed_ratio = compressionRatio

  return {
    data: respData,
    metrics: metrics,
  }
}
