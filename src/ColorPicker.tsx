import React, { useState } from 'react'
import { Saturation, Hue } from 'react-color/lib/components/common'
import { ColorFormats } from 'tinycolor2'
import { Color, createColor } from './color'
import { ColumnKey, defaultColor } from './reducer'

export type Suggestion = {
  label1: ColumnKey
  label2: ColumnKey
  canSuggest: boolean
  generateSuggestion: () => Color
}

export function ColorPicker({
  color,
  onSave,
  onCancel,
  suggestion,
}: {
  color: Color
  onSave: (color: Color) => void
  onCancel: () => void
  suggestion?: Suggestion
}) {
  const [tempColor, setTempColor] = useState(color)

  const handleSaturationChange = (color: ColorFormats.HSV): void => {
    const newColor = createColor(color)
    setTempColor(newColor)
  }

  const handleHueChange = (color: ColorFormats.HSL): void => {
    const newColor = createColor(color)
    setTempColor(newColor)
  }

  const handleHSLChange = (color: ColorFormats.HSL): void => {
    const newColor = createColor(color)
    setTempColor(newColor)
  }

  const handleReset = () => {
    onSave(defaultColor)
  }

  return (
    <div className="rounded-md bg-white border border-gray-300 shadow-md p-2 w-64">
      {suggestion && !suggestion.canSuggest && (
        <div className="-mx-2 -mt-2 mb-2 p-2 text-sm bg-gray-100">
          If colors <strong>{suggestion.label1}</strong> and{' '}
          <strong>{suggestion.label2}</strong> are defined, we can suggest a
          color for you.
        </div>
      )}
      {suggestion && suggestion.canSuggest && (
        <div className="-mx-2 -mt-2 mb-2 p-2 text-sm bg-gray-100 flex items-center gap-x-4">
          <span>
            Use suggestion based on <strong>{suggestion.label1}</strong> and{' '}
            <strong>{suggestion.label2}</strong>.
          </span>
          <button
            className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => setTempColor(suggestion.generateSuggestion())}
          >
            Apply
          </button>
        </div>
      )}
      <div className="relative h-56 w-full mb-2">
        {/* @ts-expect-error */}
        <Saturation {...tempColor} onChange={handleSaturationChange} />
      </div>
      <div className="flex items-center gap-x-4 mb-2">
        <div
          className="rounded w-12 h-12 shadow-sm border border-gray-100"
          style={{ backgroundColor: tempColor.hex }}
        />
        <div className="relative w-44 h-4">
          <Hue
            {...tempColor}
            // pointer={<div className="h-4 w-4 rounded-full bg-white" />}
            // @ts-expect-error
            onChange={handleHueChange}
          />
        </div>
      </div>
      <div className="flex gap-x-2 mb-4">
        <div className="flex flex-col">
          <div>
            <input
              type="number"
              value={Number(tempColor.hsl.h).toFixed(0)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.valueAsNumber
                if (value < 0 || value > 360) return
                handleHSLChange({
                  h: value,
                  s: tempColor.hsl.s,
                  l: tempColor.hsl.l,
                })
              }}
              className="rounded border border-gray-300 w-full"
            />
          </div>
          <div className="whitespace-nowrap text-center">H (°)</div>
        </div>
        <div className="flex flex-col">
          <div>
            <input
              type="number"
              value={(Number(tempColor.hsl.s) * 100).toFixed(0)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.valueAsNumber
                if (value < 0 || value > 100) return
                handleHSLChange({
                  h: tempColor.hsl.h,
                  s: value / 100,
                  l: tempColor.hsl.l,
                })
              }}
              className="rounded border border-gray-300 w-full"
            />
          </div>
          <div className="whitespace-nowrap text-center">S (%)</div>
        </div>
        <div className="flex flex-col">
          <div>
            <input
              type="number"
              value={(Number(tempColor.hsl.l) * 100).toFixed(0)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.valueAsNumber
                if (value < 0 || value > 100) return
                handleHSLChange({
                  h: tempColor.hsl.h,
                  s: tempColor.hsl.s,
                  l: value / 100,
                })
              }}
              className="rounded border border-gray-300 w-full"
            />
          </div>
          <div className="whitespace-nowrap text-center">L (%)</div>
        </div>
      </div>
      <div className="flex gap-x-2 justify-end">
        <div className="flex-1">
          <button
            className="inline-flex justify-center py-1 px-3 border border-transparent text-sm font-medium rounded-md text-red-500 hover:text-red-900 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        <button
          className="inline-flex justify-center py-1 px-3 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-indigo-900 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => onSave(tempColor)}
        >
          Save
        </button>
      </div>
    </div>
  )
}
