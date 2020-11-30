import { Color, createColor } from './color'

export const defaultColor = createColor('#fff')

type Row = {
  label: string
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
  selectedCell: {
    rowKey: RowKey | undefined
    columnKey: ColumnKey | undefined
  }
  palette: Palette
}

const createEmptyRow = (label: string): Row => ({
  label,
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

export const initialState: State = {
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
      payload: { rowKey: RowKey; columnKey: 'label'; value: string }
    }
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

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_VALUE':
      // ugh, deeply cloning state is dumb
      return {
        ...state,
        palette: {
          ...state.palette,
          [action.payload.rowKey]: {
            ...state.palette[action.payload.rowKey],
            [action.payload.columnKey]: action.payload.value,
          },
        },
      }
    case 'SELECT_CELL':
      return {
        ...state,
        selectedCell: {
          rowKey: action.payload.rowKey,
          columnKey: action.payload.columnKey,
        },
      }
    case 'UNSELECT_CELL':
      return {
        ...state,
        selectedCell: {
          rowKey: undefined,
          columnKey: undefined,
        },
      }
    case 'RESET':
      return initialState
    default:
      throw new Error('No action handler provided.')
  }
}
