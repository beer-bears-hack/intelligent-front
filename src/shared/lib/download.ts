import { saveAs } from 'file-saver'

export function downloadBlob(blob: Blob, filename: string): void {
  saveAs(blob, filename)
}

export function downloadUrl(url: string, filename: string): void {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener noreferrer'
  document.body.append(a)
  a.click()
  a.remove()
}
