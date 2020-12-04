import tinycolor, { ColorFormats, ColorInput } from 'tinycolor2'

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

export function getMedianColor(color1: Color, color2: Color): Color {
  const newHsl = {
    h: Math.round((color1.hsl.h + color2.hsl.h) / 2),
    s: (color1.hsl.s + color2.hsl.s) / 2,
    l: (color1.hsl.l + color2.hsl.l) / 2,
  }

  return createColor(newHsl)
}
