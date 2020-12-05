import { createColor } from './color'
import { ColumnKey, RowKey, State } from './reducer'

export function serializePalette(palette: State['palette']): string {
  return Object.keys(palette)
    .map((rowKey) => {
      const str = Object.keys(palette[rowKey as RowKey])
        .filter((columnKey) => columnKey !== 'label')
        .map((columnKey) => {
          const { hsl } = palette[rowKey as RowKey][columnKey as ColumnKey]
          return [
            columnKey,
            Math.round(hsl.h),
            Math.round(hsl.s * 100),
            Math.round(hsl.l * 100),
          ].join(':')
        })
        .join(';')
      return `${rowKey};${str}`
    })
    .join('|')
}

export function parseStringifiedPalette(
  stringifiedPalette: string
): State['palette'] {
  // @ts-ignore
  return stringifiedPalette
    .split('|')
    .reduce<State['palette']>((palette, row) => {
      const [rowKey, ...shades] = row.split(';')
      // @ts-ignore
      palette[rowKey as RowKey] = shades.reduce<State['palette']['primary']>(
        (row, stringifiedColor) => {
          const [columnKey, h, s, l] = stringifiedColor.split(':')
          row[columnKey as ColumnKey] = createColor({
            h: Number.parseInt(h, 10),
            s: Number.parseInt(s, 10) / 100,
            l: Number.parseInt(l, 10) / 100,
          })
          return row
        },
        // @ts-ignore
        {}
      )
      return palette
      // @ts-ignore
    }, {})
}
