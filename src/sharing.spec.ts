import { createColor } from './color'
import { parseStringifiedPalette, serializePalette } from './sharing'

describe('serializePalette', () => {
  it('generates a short form string', () => {
    const palette = {
      primary: { 50: createColor('#ff0000'), 900: createColor('#660000') },
      secondary: { 50: createColor('#00ff00'), 900: createColor('#006600') },
    }
    const stringifiedPalette =
      'primary;50:0:100:50;900:0:100:20|secondary;50:120:100:50;900:120:100:20'
    const result = serializePalette(palette)

    expect(result).toBe(stringifiedPalette)
  })
})

describe('parseStringifiedPalette', () => {
  it('creates a palette from a short form string', () => {
    const palette = {
      primary: { 50: createColor('#ff0000'), 900: createColor('#660000') },
      secondary: { 50: createColor('#00ff00'), 900: createColor('#006600') },
    }
    const stringifiedPalette =
      'primary;50:0:100:50;900:0:100:20|secondary;50:120:100:50;900:120:100:20'
    const result = parseStringifiedPalette(stringifiedPalette)

    expect(result).toEqual(palette)
  })
})
