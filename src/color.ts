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
