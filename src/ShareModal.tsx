import React from 'react'
import { State } from './reducer'
import Modal from 'react-modal'
import { serializePalette } from './sharing'

export function ShareModal({
  isOpen,
  onRequestClose,
  palette,
}: {
  isOpen: boolean
  onRequestClose: () => void
  palette: State['palette']
}) {
  const link = `${window.location.origin}/#${serializePalette(palette)}`

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      className="bg-white rounded w-full max-w-3xl p-4"
    >
      <h2 className="mb-2 text-xl">Share Link</h2>
      <pre className="p-2 bg-indigo-100 text-sm rounded shadow-inner select-all overflow-x-auto">
        {link}
      </pre>
    </Modal>
  )
}
