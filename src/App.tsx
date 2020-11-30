import React, { useReducer } from 'react'
import { ColorPicker } from './ColorPicker'
import { initialState, reducer, RowKey, ColumnKey } from './reducer'
import { Color } from './color'

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

function LabelCell({ label }: { label: string }) {
  return <div className="flex items-center h-full w-full">{label}</div>
}

function Cell({
  color,
  colorPicker,
  // onChangeColor,
  onClick,
}: {
  color: Color
  colorPicker: React.ReactNode
  // onChangeColor: (color: Color) => void
  onClick: React.MouseEventHandler
}) {
  // const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  //   console.log(event.target.value)
  //   onChangeColor(createColor(event.target.value))
  // }

  return (
    <div className="relative h-full w-full rounded shadow">
      <button
        className="block relative h-full w-full rounded"
        style={{ backgroundColor: color.hex }}
        onClick={onClick}
      >
        <span className="sr-only">{color.hex}</span>
      </button>
      {/* <label
        className="block relative h-full w-full rounded"
        style={{ backgroundColor: color?.hex ?? '#fff' }}
        onClick={onClick}
      >
        <span className="sr-only">{color?.hex}</span>
        <input
          type="color"
          className="sr-only bottom-0"
          onChange={handleChange}
        />
      </label> */}
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

  const renderRow = (rowKey: RowKey) => {
    return orderedKeys.map((columnKey) => {
      const value = palette[rowKey][columnKey]
      const isSelected =
        selectedCell.rowKey === rowKey && selectedCell.columnKey === columnKey

      if (columnKey === 'label') {
        return <LabelCell label={value! as string} />
      }

      return (
        <Cell
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
    <div className="p-4">
      {/* <div>
        {selectedCell.rowKey && selectedCell.columnKey && (
          <ColorPicker
            color={palette[selectedCell.rowKey][selectedCell.columnKey]}
            onColorChange={setColor(
              selectedCell.rowKey,
              selectedCell.columnKey
            )}
            onSave={(color: Color) => {
              setColor(selectedCell.rowKey!, selectedCell.columnKey!)(color)
              unselectCell()
            }}
            onCancel={() => dispatch({ type: 'UNSELECT_CELL' })}
          />
        )}
      </div>
      <hr className="my-8" /> */}
      <div className="palette-header">
        {orderedKeys.map((key) => (
          <div className="font-semibold text-center">
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
  )
}

export default App
