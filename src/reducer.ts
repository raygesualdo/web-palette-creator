type Color = string

type Row = {
  label: string
  '50': Color | undefined
  '100': Color | undefined
  '200': Color | undefined
  '300': Color | undefined
  '400': Color | undefined
  '500': Color | undefined
  '600': Color | undefined
  '700': Color | undefined
  '800': Color | undefined
  '900': Color | undefined
}

type Palette = {
  primary: Row
  secondary: Row
  tertiary: Row
  gray: Row
  success: Row
  error: Row
  warning: Row
  info: Row
}

export type RowKey = keyof Palette
export type ColumnKey = keyof Row

export type State = {
  palette: Palette
}

const createEmptyRow = (label: string): Row => ({
  label,
  '50': undefined,
  '100': undefined,
  '200': undefined,
  '300': undefined,
  '400': undefined,
  '500': undefined,
  '600': undefined,
  '700': undefined,
  '800': undefined,
  '900': undefined,
})

export const initialState: State = {
  palette: {
    primary: createEmptyRow('Primary'),
    secondary: createEmptyRow('Secondary'),
    tertiary: createEmptyRow('Tertiary'),
    gray: createEmptyRow('Gray'),
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
        value: Color | undefined
      }
    }
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
    case 'RESET':
      return initialState
    default:
      throw new Error('No action handler provided.')
  }
}
