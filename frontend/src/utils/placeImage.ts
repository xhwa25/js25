export type PlaceImageSize = 'card' | 'detail'

const IMAGE_SETTINGS: Record<PlaceImageSize, { quality: number; width: number }> = {
  card: { quality: 75, width: 720 },
  detail: { quality: 80, width: 1280 },
}

const PUBLIC_OBJECT_PATH = '/storage/v1/object/public/'
const PUBLIC_RENDER_PATH = '/storage/v1/render/image/public/'

function getSupabaseOrigin(): string | null {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
  if (!supabaseUrl) {
    return null
  }

  try {
    return new URL(supabaseUrl).origin
  } catch {
    return null
  }
}

const supabaseOrigin = getSupabaseOrigin()

export function getPlaceImageUrl(imageUrl: string, size: PlaceImageSize): string {
  try {
    const url = new URL(imageUrl)
    if (url.origin !== supabaseOrigin || !url.pathname.includes(PUBLIC_OBJECT_PATH)) {
      return imageUrl
    }

    const settings = IMAGE_SETTINGS[size]
    url.pathname = url.pathname.replace(PUBLIC_OBJECT_PATH, PUBLIC_RENDER_PATH)
    url.searchParams.set('width', String(settings.width))
    url.searchParams.set('quality', String(settings.quality))
    url.searchParams.set('resize', 'contain')
    return url.toString()
  } catch {
    return imageUrl
  }
}
