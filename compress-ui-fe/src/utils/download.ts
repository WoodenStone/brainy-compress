/** @format */

export function createDownloadLink(url: string, filename: string) {
  const link = document.createElement('a')
  link.setAttribute('download', filename)
  link.setAttribute('href', url)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
