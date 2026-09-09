import mapboxgl from 'mapbox-gl'

export const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v11'
export const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined

export const markerColors: Record<string, string> = {
  RESTAURANT: '#c98f88',
  CAFE: '#b39a73',
  ATTRACTION: '#8eaaa0',
  SHOPPING: '#9d9ab0',
  'PHOTO SPOT': '#a99a8b',
  ENTERTAINMENT: '#86a8a6',
}

export function markerColor(category: string): string {
  return markerColors[category] ?? '#9ba5a1'
}

export function customizeMapPalette(mapInstance: mapboxgl.Map) {
  const layers = mapInstance.getStyle().layers ?? []

  layers.forEach((layer) => {
    const id = layer.id.toLowerCase()

    try {
      if (layer.type === 'background') {
        mapInstance.setPaintProperty(layer.id, 'background-color', '#f1f7f3')
      } else if (layer.type === 'fill') {
        if (id.includes('water')) {
          mapInstance.setPaintProperty(layer.id, 'fill-color', '#dceee7')
        } else if (id.includes('park') || id.includes('green') || id.includes('landcover')) {
          mapInstance.setPaintProperty(layer.id, 'fill-color', '#e0eee7')
        } else if (id.includes('land') || id.includes('landuse')) {
          mapInstance.setPaintProperty(layer.id, 'fill-color', '#e8f1ec')
        }
      } else if (layer.type === 'line') {
        if (id.includes('water')) {
          mapInstance.setPaintProperty(layer.id, 'line-color', '#c9e2d8')
        } else if (id.includes('road') || id.includes('street') || id.includes('motorway')) {
          mapInstance.setPaintProperty(layer.id, 'line-color', '#d6e7df')
        } else if (id.includes('boundary') || id.includes('admin')) {
          mapInstance.setPaintProperty(layer.id, 'line-color', '#bfd7cd')
        }
      } else if (layer.type === 'symbol' && (id.includes('label') || id.includes('place'))) {
        mapInstance.setPaintProperty(layer.id, 'text-color', '#82958d')
      }
    } catch {
      // Some style layers do not expose the paint property above.
    }
  })
}
