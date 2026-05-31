export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (value: string) => {
  const date = new Date(value)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const humanFileSize = (size: number) => {
  if (size === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** index).toFixed(1)} ${units[index]}`
}

export const getCompatibilityLabel = (score: number) => {
  if (score > 90) return 'Excellent Match'
  if (score > 75) return 'Strong Match'
  if (score > 50) return 'Good Match'
  return 'Explore More'
}
