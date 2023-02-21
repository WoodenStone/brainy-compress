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
  // log file size
  console.log('file size: ', file.size)

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

  const resp = await getInstance().post('/api/compress', formData, {
    responseType: 'blob',
  })
  // extract metrics from response header
  const metrics = JSON.parse(resp.headers['x-metrics'])

  // 替换 original size 和 compression ratio
  const originalSize = round(file.size / 1024, 2)
  const compressionRatio = round((1 - metrics?.compressed_size / originalSize) * 100, 4)
  metrics.original_size = originalSize
  metrics.compressed_ratio = compressionRatio

  const respData = resp.data
  console.log(metrics)
  return {
    data: respData,
    metrics: metrics,
  }
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

  const resp = await getInstance().post('/api/auto-compress', formData, {
    responseType: 'blob',
  })
  // extract metrics from response header
  const metrics = JSON.parse(resp.headers['x-metrics'])

  const respData = resp.data
  return {
    data: respData,
    metrics: metrics,
  }
}
