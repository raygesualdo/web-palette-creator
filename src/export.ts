import tinycolor from 'tinycolor2'
import { Color } from './color'
import { ColumnKey, RowKey, State } from './reducer'

export type ExportType =
  | 'css-variables'
  | 'js-object'
  | 'tailwind-config'
  | 'scss'
  | 'sass'
  | 'less'

export type ExportColorFormat = 'hex' | 'rgb' | 'hsl'

const orderedRows: RowKey[] = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'success',
  'error',
  'warning',
  'info',
]

function getColorValue(color: Color, colorFormat: ExportColorFormat): string {
  if (colorFormat === 'hex') {
    return color.hex
  }
  if (colorFormat === 'hsl') {
    return tinycolor(color.hsl).toHslString()
  }
  if (colorFormat === 'rgb') {
    return tinycolor(color.rgb).toRgbString()
  }
  return ''
}

function lineMapper(
  palette: State['palette'],
  colorFormat: ExportColorFormat,
  fn: (rowKey: RowKey, columnKey: ColumnKey, formattedColor: string) => string
) {
  return orderedRows
    .map((rowKey) => {
      return Object.keys(palette[rowKey])
        .filter((k) => k !== 'label')
        .map((columnKey) => {
          const color = getColorValue(
            palette[rowKey][columnKey as ColumnKey],
            colorFormat
          )
          return fn(rowKey, columnKey as ColumnKey, color)
        })
    })
    .flat()
    .join('\n')
}

function getCssVariables(
  palette: State['palette'],
  colorFormat: ExportColorFormat
) {
  const lines = lineMapper(palette, colorFormat, (rowKey, columnKey, color) => {
    const id = `${rowKey}-${columnKey}`
    return `  --${id}: ${color};`
  })

  return `
:root {
${lines}
}`.trim()
}

function getScssVariables(
  palette: State['palette'],
  colorFormat: ExportColorFormat
) {
  return lineMapper(palette, colorFormat, (rowKey, columnKey, color) => {
    const id = `${rowKey}-${columnKey}`
    return `$${id}: ${color};`
  })
}

function getSassVariables(
  palette: State['palette'],
  colorFormat: ExportColorFormat
) {
  return lineMapper(palette, colorFormat, (rowKey, columnKey, color) => {
    const id = `${rowKey}-${columnKey}`
    return `$${id}: ${color}`
  })
}

function getLessVariables(
  palette: State['palette'],
  colorFormat: ExportColorFormat
) {
  return lineMapper(palette, colorFormat, (rowKey, columnKey, color) => {
    const id = `${rowKey}-${columnKey}`
    return `@${id}: ${color};`
  })
}

function getJsObject(
  palette: State['palette'],
  colorFormat: ExportColorFormat
) {
  const lines = lineMapper(palette, colorFormat, (rowKey, columnKey, color) => {
    const id = `${rowKey}${columnKey}`
    return `  ${id}: "${color}",`
  })

  return `
const colors = {
${lines}
}`.trim()
}

function getTailwindConfig(
  palette: State['palette'],
  colorFormat: ExportColorFormat
) {
  const lines = orderedRows
    .map((rowKey) => {
      const keysAndValues = Object.keys(palette[rowKey])
        .filter((k) => k !== 'label')
        .map((columnKey) => {
          const color = getColorValue(
            palette[rowKey][columnKey as ColumnKey],
            colorFormat
          )
          return `        ${columnKey}: "${color}",`
        })
        .join('\n')
      return `      ${rowKey}: {
${keysAndValues}      
      }`
    })
    .join('\n')

  return `
module.exports = {
  theme: {
    colors: {
${lines}
    }
  }
}`.trim()
}

export function generateExportContent({
  exportType,
  palette,
  colorFormat,
}: {
  exportType: ExportType
  palette: State['palette']
  colorFormat: ExportColorFormat
}): string {
  if (exportType === 'css-variables') {
    return getCssVariables(palette, colorFormat)
  }
  if (exportType === 'scss') {
    return getScssVariables(palette, colorFormat)
  }
  if (exportType === 'sass') {
    return getSassVariables(palette, colorFormat)
  }
  if (exportType === 'less') {
    return getLessVariables(palette, colorFormat)
  }
  if (exportType === 'js-object') {
    return getJsObject(palette, colorFormat)
  }
  if (exportType === 'tailwind-config') {
    return getTailwindConfig(palette, colorFormat)
  }
  return ''
}
