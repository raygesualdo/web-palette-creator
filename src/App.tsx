import React, { useReducer } from 'react'
import { initialState, reducer, RowKey, ColumnKey } from './reducer'

const orderedKeys: ColumnKey[] = [
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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <div className="palette-grid">
        {orderedKeys.map((key) => (
          <div className="font-semibold text-center">
            {key === 'label' ? 'Name' : key}
          </div>
        ))}
        {Object.keys(state.palette).map((rowKey) => {
          return orderedKeys.map((columnKey) => {
            return (
              <div className="h-full w-full bg-gray-50 rounded">
                {state.palette[rowKey as RowKey][columnKey]}
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}

export default App
