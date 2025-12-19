/**
 * Format date with locale support
 * @param {string} dateString - Date string to format
 * @param {string} locale - Locale code ('id' for Indonesian, 'en' for English)
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, locale = 'id') {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const localeMap = {
    'id': 'id-ID',
    'en': 'en-US'
  }
  return date.toLocaleDateString(localeMap[locale] || 'id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format date with time
 * @param {string} dateString - Date string to format
 * @param {string} locale - Locale code ('id' for Indonesian, 'en' for English)
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(dateString, locale = 'id') {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const localeMap = {
    'id': 'id-ID',
    'en': 'en-US'
  }
  return date.toLocaleDateString(localeMap[locale] || 'id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format short date (e.g., 19 Des 2024)
 * @param {string} dateString - Date string to format
 * @param {string} locale - Locale code
 * @returns {string} Short formatted date string
 */
export function formatShortDate(dateString, locale = 'id') {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const localeMap = {
    'id': 'id-ID',
    'en': 'en-US'
  }
  return date.toLocaleDateString(localeMap[locale] || 'id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
