import type { Locale } from '../stores/language'
import type { PlaceCategory } from '../types/place'

const categoryLabels: Record<Locale, Record<PlaceCategory, string>> = {
  en: {
    ATTRACTION: 'Attraction',
    RESTAURANT: 'Restaurant',
    CAFE: 'Cafe',
    SHOPPING: 'Shopping',
    'PHOTO SPOT': 'Photo Spot',
    ENTERTAINMENT: 'Entertainment',
  },
  zh: {
    ATTRACTION: '景点',
    RESTAURANT: '美食',
    CAFE: '咖啡厅',
    SHOPPING: '购物',
    'PHOTO SPOT': '打卡点',
    ENTERTAINMENT: '娱乐',
  },
}

const geographicNamesChinese: Record<string, string> = {
  Australia: '澳大利亚',
  Germany: '德国',
  France: '法国',
  Iceland: '冰岛',
  Japan: '日本',
  Netherlands: '荷兰',
  'South Korea': '韩国',
  Switzerland: '瑞士',
  'United Kingdom': '英国',
  'United States': '美国',
  Amsterdam: '阿姆斯特丹',
  Bern: '伯尔尼',
  Busan: '釜山',
  Interlaken: '因特拉肯',
  Incheon: '仁川',
  Grindelwald: '格林德瓦',
  Lauterbrunnen: '劳特布龙嫩',
  London: '伦敦',
  Lucerne: '卢塞恩',
  Mürren: '米伦',
  'New York': '纽约',
  Otaru: '小樽',
  Paris: '巴黎',
  Reykjavik: '雷克雅未克',
  Sapporo: '札幌',
  Seoul: '首尔',
  Sydney: '悉尼',
  Tokyo: '东京',
  Zurich: '苏黎世',
}

export function localizePlaceCategory(category: string, locale: Locale): string {
  return categoryLabels[locale][category as PlaceCategory] ?? category
}

export function localizeGeographicName(name: string, locale: Locale): string {
  if (locale !== 'zh') {
    return name
  }

  const translatedName = Object.entries(geographicNamesChinese).find(
    ([englishName]) => englishName.localeCompare(name, 'en', { sensitivity: 'base' }) === 0,
  )?.[1]

  return translatedName ?? name
}
