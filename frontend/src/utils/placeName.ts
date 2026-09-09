import type { Locale } from '../stores/language'
import type { Place } from '../types/place'

function cleanName(value: string | null | undefined): string {
  return value?.trim() ?? ''
}

export function getPlaceName(place: Place, locale: Locale): string {
  const localizedName = cleanName(place.name)
  const englishName = cleanName(place.english_name)
  const koreanName = cleanName(place.korean_name)

  if (locale === 'en') {
    return englishName || koreanName || localizedName
  }

  return localizedName || englishName || koreanName
}

export function getPlaceNameSubtitle(place: Place, locale: Locale): string | null {
  if (locale !== 'zh' || !cleanName(place.name)) {
    return null
  }

  return cleanName(place.english_name) || null
}
