import React, { useReducer } from 'react'
import { ColorPicker, Suggestion } from './ColorPicker'
import {
  initialState,
  reducer,
  RowKey,
  ColumnKey,
  defaultColor,
} from './reducer'
import { CodeExample } from './CodeExample'

const orderedKeys: ['label', ...ColumnKey[]] = [
  'label',
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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

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

  const { palette, selectedCell } = state

  const calculateSuggestion = (
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
        return createColor('#8c4a93')
      },
    }
  }

  const renderRow = (rowKey: RowKey) => {
    return orderedKeys.map((columnKey) => {
      const value = palette[rowKey][columnKey]
      const isSelected =
        selectedCell.rowKey === rowKey && selectedCell.columnKey === columnKey

      if (columnKey === 'label') {
        return (
          <LabelCell key={`${rowKey}:${columnKey}`} label={value! as string} />
        )
      }

      return (
        <Cell
          key={`${rowKey}:${columnKey}`}
          color={value as Color}
          colorPicker={
            <div className="absolute z-10 top-full mt-2">
              {isSelected && (
                <ColorPicker
                  color={palette[rowKey][columnKey]}
                  onSave={(color: Color) => {
                    setColor(rowKey!, columnKey!)(color)
                    unselectCell()
                  }}
                  onCancel={() => dispatch({ type: 'UNSELECT_CELL' })}
                  suggestion={calculateSuggestion(rowKey, columnKey)}
                />
              )}
            </div>
          }
          onClick={() => setSelectedCell(rowKey, columnKey)}
        />
      )
    })
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 300px' }}>
      <div className="p-4">
        <div className="palette-header">
          {orderedKeys.map((key) => (
            <div key={key} className="font-semibold text-center">
              {key === 'label' ? 'Name' : key}
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
      <div className="bg-gray-50 p-4">
        <h1 className="bg-gray-900 text-gray-50 px-4 py-8 -mt-4 -mx-4 mb-4 text-2xl font-bold">
          Web Palette Builder
        </h1>
        <p>This is the content that will go in the sidebar.</p>
        <CodeExample palette={palette} />
      </div>
    </div>
  )
}

export default App
