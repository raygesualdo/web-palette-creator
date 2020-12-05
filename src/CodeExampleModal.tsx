import React from 'react'
import { State } from './reducer'
import Modal from 'react-modal'
import { CodeExample } from './CodeExample'

export function CodeExampleModal({
  isOpen,
  onRequestClose,
  palette,
}: {
  isOpen: boolean
  onRequestClose: () => void
  palette: State['palette']
}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      className="bg-white rounded w-full max-w-3xl p-4"
    >
      <CodeExample palette={palette} />
    </Modal>
  )
}
