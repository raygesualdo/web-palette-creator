import tinycolor, { ColorFormats, ColorInput } from 'tinycolor2'
import { ColumnKey, RowKey, State } from './reducer'

export type Color = {
  hex: string
  hsl: ColorFormats.HSL
  hsv: ColorFormats.HSV
  rgb: ColorFormats.RGB
}

export const createColor = (color: ColorInput | undefined) => {
  const parsedColor = tinycolor(color)

  return {
    hex: parsedColor.toHexString(),
    hsl: parsedColor.toHsl(),
    hsv: parsedColor.toHsv(),
    rgb: parsedColor.toRgb(),
  }
}

export const defaultColor = createColor('#fff')

export function getMedianColor(color1: Color, color2: Color): Color {
  const newHsl = {
    h: Math.round((color1.hsl.h + color2.hsl.h) / 2),
    s: (color1.hsl.s + color2.hsl.s) / 2,
    l: (color1.hsl.l + color2.hsl.l) / 2,
  }

  return createColor(newHsl)
}

function determineSuggestionDependencies(
  columnKey: ColumnKey
): {
  label1: ColumnKey
  label2: ColumnKey
} {
  if (columnKey === '200') {
    return {
      label1: '100',
      label2: '300',
    }
  }
  if (columnKey === '300') {
    return {
      label1: '100',
      label2: '500',
    }
  }
  if (columnKey === '400') {
    return {
      label1: '300',
      label2: '500',
    }
  }
  if (columnKey === '600') {
    return {
      label1: '500',
      label2: '700',
    }
  }
  if (columnKey === '700') {
    return {
      label1: '500',
      label2: '900',
    }
  }
  if (columnKey === '800') {
    return {
      label1: '700',
      label2: '900',
    }
  }
  // Can't actually get here. Don't know why TS doesn't understand that.
  // @ts-expect-error
  return
}

export type Suggestion = {
  label1: ColumnKey
  label2: ColumnKey
  canSuggest: boolean
  generateSuggestion: () => Color
}

export const calculateSuggestion = (
  palette: State['palette'],
  rowKey: RowKey,
  columnKey: ColumnKey
): Suggestion | undefined => {
  if (['50', '100', '500', '900'].includes(columnKey)) {
    return
  }

  const { label1, label2 } = determineSuggestionDependencies(columnKey)
  const canSuggest =
    palette[rowKey][label1].hex !== defaultColor.hex &&
    palette[rowKey][label2].hex !== defaultColor.hex

  return {
    canSuggest,
    label1,
    label2,
    generateSuggestion: () => {
      return getMedianColor(palette[rowKey][label1], palette[rowKey][label2])
    },
  }
}

export function replaceHue(color: Color, hue: number): Color {
  return {
    ...color,
    hsl: {
      ...color.hsl,
      h: hue,
    },
    hsv: {
      ...color.hsv,
      h: hue,
    },
  }
}
