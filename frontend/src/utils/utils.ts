/** @format */

export function createDownloadLink(url: string, filename: string) {
  const link = document.createElement('a')
  link.setAttribute('download', filename)
  link.setAttribute('href', url)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 保留指定位数的小数
export function round(num: number, precision: number) {
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
}
