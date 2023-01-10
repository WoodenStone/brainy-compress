/** @format */

import axios from 'axios'

const instance = axios.create({})

export async function fileHandler(file: Blob, fileName: string) {
  let formData = new FormData()
  formData.append('title', fileName)
  formData.append('f1', file)

  try {
    const data = await instance.post('/upload', formData, {
      responseType: 'blob',
    })
    return data
  } catch (error) {
    return error
  }
}

export interface IImageCompressRequest {
  file: Blob
  fileName: string
  fileType: string // eg: image/jpeg
  model: string // model name, eg: 'mbt2018'
}

export interface IImageCompressResponse {
  data: Blob
  metrics: Record<string, string>
}

export async function compressImage(options: IImageCompressRequest): Promise<IImageCompressResponse> {
  const { file, fileName, fileType, model } = options
  let formData = new FormData()
  formData.append('filename', fileName)
  formData.append('model', model)
  formData.append('filetype', fileType)
  formData.append('file', file)

  const resp = await instance.post('/api/compress', formData, {
    responseType: 'blob',
  })
  const metrics = JSON.parse(resp.headers['x-metrics'])
  return { data: resp.data, metrics }
}
