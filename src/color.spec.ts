import { createColor } from './color'

describe('createColor', () => {
  it('creates a color from an HSL object', () => {
    const color = createColor({ h: 240, s: 0, l: 0.9 })
    expect(color.hsl).toEqual({ h: 240, s: 0, l: 0.9, a: 1 })
    expect(color.hex).toBe('#000000')
  })
})
