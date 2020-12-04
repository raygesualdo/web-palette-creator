import { State } from './reducer'

import React, { Fragment, useState } from 'react'
import { ExportColorFormat, ExportType, generateExportContent } from './export'

export function CodeExample({ palette }: { palette: State['palette'] }) {
  const [exportType, setExportType] = useState<ExportType>('css-variables')
  const [colorFormat, setColorFormat] = useState<ExportColorFormat>('hsl')

  return (
    <Fragment>
      <div className="flex my-2 gap-x-4">
        <select
          className="py-1 px-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
          onChange={(event) => setExportType(event.target.value as ExportType)}
        >
          <option value="css-variables">CSS Variables</option>
          <option value="tailwind-config">Tailwind Config</option>
          <option value="js-object">JS Object</option>
          <option value="scss">SCSS Variables</option>
          <option value="sass">Sass Variables</option>
          <option value="less">Less Variables</option>
        </select>
        <select
          className="py-1 px-2 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
          onChange={(event) =>
            setColorFormat(event.target.value as ExportColorFormat)
          }
        >
          <option value="hsl">HSL</option>
          <option value="hex">Hex</option>
          <option value="rgb">RGB</option>
        </select>
      </div>
      <pre
        className="p-2 mt-4 bg-indigo-100 rounded shadow-inner select-all overflow-y-auto"
        style={{ maxHeight: '600px' }}
      >
        {generateExportContent({
          palette,
          colorFormat,
          exportType,
        })}
      </pre>
    </Fragment>
  )
}
