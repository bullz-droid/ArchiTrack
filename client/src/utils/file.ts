export const acceptedArchitectFiles = ['image/*', '.pdf', '.dwg', '.skp', '.rvt']

export const getFileLabel = (filename: string) => {
  const matches = filename.match(/\.(\w+)$/)
  return matches ? matches[1].toUpperCase() : 'FILE'
}

export const isSupportedUploadType = (fileType: string) => {
  const supported = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/octet-stream']
  return supported.includes(fileType) || /dwg|skp|rvt/i.test(fileType)
}
