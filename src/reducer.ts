import produce from 'immer'
import { Color, defaultColor } from './color'

type Row = {
  '50': Color
  '100': Color
  '200': Color
  '300': Color
  '400': Color
  '500': Color
  '600': Color
  '700': Color
  '800': Color
  '900': Color
}

type Palette = {
  primary: Row
  secondary: Row
  tertiary: Row
  neutral: Row
  success: Row
  error: Row
  warning: Row
  info: Row
}

export type RowKey = keyof Palette
export type ColumnKey = Exclude<keyof Row, 'label'>

export type State = {
  isCodeModalOpen: boolean
  isShareModalOpen: boolean
  selectedCell: {
    rowKey: RowKey | undefined
    columnKey: ColumnKey | undefined
  }
  palette: Palette
}

const createEmptyRow = (label: string): Row => ({
  '50': defaultColor,
  '100': defaultColor,
  '200': defaultColor,
  '300': defaultColor,
  '400': defaultColor,
  '500': defaultColor,
  '600': defaultColor,
  '700': defaultColor,
  '800': defaultColor,
  '900': defaultColor,
})

export const getLabelForRow = (rowKey: RowKey) => {
  const labels: Record<RowKey, string> = {
    primary: 'Primary',
    secondary: 'Secondary',
    tertiary: 'Tertiary',
    neutral: 'Neutral',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  }
  return labels[rowKey]
}

export const initialState: State = {
  isCodeModalOpen: false,
  isShareModalOpen: false,
  selectedCell: {
    rowKey: undefined,
    columnKey: undefined,
  },
  palette: {
    primary: createEmptyRow('Primary'),
    secondary: createEmptyRow('Secondary'),
    tertiary: createEmptyRow('Tertiary'),
    neutral: createEmptyRow('Neutral'),
    success: createEmptyRow('Success'),
    error: createEmptyRow('Error'),
    warning: createEmptyRow('Warning'),
    info: createEmptyRow('Info'),
  },
}

export type Action =
  | {
      type: 'SET_VALUE'
      payload: {
        rowKey: RowKey
        columnKey: Exclude<ColumnKey, 'label'>
        value: Color
      }
    }
  | {
      type: 'SELECT_CELL'
      payload: { rowKey: RowKey; columnKey: Exclude<ColumnKey, 'label'> }
    }
  | { type: 'UNSELECT_CELL' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_CODE_MODAL' }
  | { type: 'TOGGLE_SHARE_MODAL' }

export const reducer = produce((draft: State, action: Action) => {
  switch (action.type) {
    case 'SET_VALUE':
      draft.palette[action.payload.rowKey][action.payload.columnKey] =
        action.payload.value
      break
    case 'SELECT_CELL':
      draft.selectedCell.rowKey = action.payload.rowKey
      draft.selectedCell.columnKey = action.payload.columnKey
      break
    case 'UNSELECT_CELL':
      draft.selectedCell.rowKey = undefined
      draft.selectedCell.columnKey = undefined
      break
    case 'TOGGLE_CODE_MODAL':
      draft.isCodeModalOpen = !draft.isCodeModalOpen
      break
    case 'TOGGLE_SHARE_MODAL':
      draft.isShareModalOpen = !draft.isShareModalOpen
      break
    case 'RESET':
      draft = initialState
      break
    default:
      throw new Error('No action handler provided.')
  }
})
