import React, { Fragment, useReducer } from 'react'
import { ColorPicker } from './ColorPicker'
import {
  initialState,
  reducer,
  RowKey,
  ColumnKey,
  State,
  getLabelForRow,
} from './reducer'
import { calculateSuggestion, Color, createColor, defaultColor } from './color'
import { CodeExampleModal } from './CodeExampleModal'
import { Footer } from './Footer'
import { ShareModal } from './ShareModal'
import { parseStringifiedPalette } from './sharing'

const orderedKeys: ColumnKey[] = [
  '900',
  '800',
  '700',
  '600',
  '500',
  '400',
  '300',
  '200',
  '100',
  '50',
]

function LabelCell({ label }: { label: string }) {
  return <div className="flex items-center h-full w-full">{label}</div>
}

function Cell({
  color,
  colorPicker,
  onClick,
}: {
  color: Color
  colorPicker: React.ReactNode
  onClick: React.MouseEventHandler
}) {
  return (
    <div className="relative h-full w-full rounded shadow">
      <button
        className="block relative h-full w-full rounded"
        style={{ backgroundColor: color.hex }}
        onClick={onClick}
      >
        <span className="sr-only">{color.hex}</span>
      </button>
      {colorPicker}
    </div>
  )
}

function GridHr() {
  return (
    <div className="flex items-center h-full col-span-full">
      <hr className="w-full" />
    </div>
  )
}

function determineInitialState(): State {
  if (window.location.hash.length) {
    const palette = parseStringifiedPalette(window.location.hash.slice(1))
    // window.location.hash = ''
    return {
      ...initialState,
      palette,
    }
  }
  return initialState
}

function App() {
  const [state, dispatch] = useReducer(reducer, determineInitialState())

  const setColor = (rowKey: RowKey, columnKey: ColumnKey) => (color: Color) =>
    dispatch({
      type: 'SET_VALUE',
      payload: {
        columnKey,
        rowKey,
        value: color,
      },
    })

  const setSelectedCell = (rowKey: RowKey, columnKey: ColumnKey) =>
    dispatch({
      type: 'SELECT_CELL',
      payload: {
        rowKey,
        columnKey,
      },
    })

  const unselectCell = () => dispatch({ type: 'UNSELECT_CELL' })

  const toggleCodeModal = () => dispatch({ type: 'TOGGLE_CODE_MODAL' })
  const toggleShareModal = () => dispatch({ type: 'TOGGLE_SHARE_MODAL' })

  const { isCodeModalOpen, isShareModalOpen, palette, selectedCell } = state

  const renderRow = (rowKey: RowKey) => {
    const cells = orderedKeys.map((columnKey) => {
      const value = palette[rowKey][columnKey]
      const isSelected =
        selectedCell.rowKey === rowKey && selectedCell.columnKey === columnKey

      const color =
        columnKey === '500' || palette[rowKey][columnKey] !== defaultColor
          ? palette[rowKey][columnKey]
          : createColor({
              h: palette[rowKey]['500'].hsl.h,
              s: defaultColor.hsl.s,
              l: defaultColor.hsl.l,
            })

      return (
        <Cell
          key={`${rowKey}:${columnKey}`}
          color={value as Color}
          colorPicker={
            <div className="absolute z-10 top-full mt-2">
              {isSelected && (
                <ColorPicker
                  color={color}
                  onSave={(color: Color) => {
                    setColor(rowKey!, columnKey!)(color)
                    unselectCell()
                  }}
                  onCancel={unselectCell}
                  suggestion={calculateSuggestion(palette, rowKey, columnKey)}
                />
              )}
            </div>
          }
          onClick={() => setSelectedCell(rowKey, columnKey)}
        />
      )
    })
    return (
      <Fragment>
        <LabelCell key={`${rowKey}:label`} label={getLabelForRow(rowKey)} />
        {cells}
      </Fragment>
    )
  }

  return (
    <div className="flex justify-center lg:mt-4">
      <div
        className="grid gap-x-4 col-y-8"
        style={{ gridTemplateColumns: 'min-content 25rem' }}
      >
        <div className="p-4">
          <div className="palette-header">
            <div />
            {orderedKeys.map((key) => (
              <div key={key} className="font-semibold text-center">
                {key}
              </div>
            ))}
          </div>
          <div className="palette-grid">
            {renderRow('primary')}
            {renderRow('secondary')}
            {renderRow('tertiary')}
            <GridHr />
            {renderRow('neutral')}
            <GridHr />
            {renderRow('success')}
            {renderRow('error')}
            {renderRow('warning')}
            {renderRow('info')}
          </div>
        </div>
        <div className="mt-4 bg-gray-50 p-4 rounded overflow-hidden">
          <h1 className="bg-gray-900 text-gray-50 px-4 py-8 -mt-4 -mx-4 mb-4 text-3xl font-medium">
            Web Palette Builder
          </h1>
          <div className="mb-4">
            <p>This is the content that will go in the sidebar.</p>
          </div>
          <div className="space-y-2">
            <button
              className="inline-flex justify-center w-full py-1 px-3 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={toggleCodeModal}
            >
              Export color palette
            </button>
            <button
              className="inline-flex justify-center w-full py-1 px-3 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={toggleShareModal}
            >
              Get shareable link
            </button>
          </div>
        </div>
        <Footer />
        <CodeExampleModal
          isOpen={isCodeModalOpen}
          onRequestClose={toggleCodeModal}
          palette={palette}
        />
        <ShareModal
          isOpen={isShareModalOpen}
          onRequestClose={toggleShareModal}
          palette={palette}
        />
      </div>
    </div>
  )
}

export default App
