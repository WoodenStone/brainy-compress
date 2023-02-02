/** @format */

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

  const resp = await getInstance().post('/api/compress', formData, {
    responseType: 'blob',
  })
  const metrics = JSON.parse(resp.headers['x-metrics'])
  return { data: resp.data, metrics }
}
