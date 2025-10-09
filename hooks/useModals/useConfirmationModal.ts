import { useState, useCallback } from 'react'
import { UseConfirmationModalProps } from '../../types/hookTypes/useModals'

export const useConfirmationModal = () =>
{
  const [visible, setVisible] = useState(false)
  const [props, setProps] = useState<UseConfirmationModalProps>({
    title: '',
    message: '',
    onConfirm: () => {},
  })

  const showConfirmation = useCallback(
    (confirmProps: UseConfirmationModalProps) => {
      setProps(confirmProps)
      setVisible(true)
    },
    []
  )

  const hideConfirmation = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setProps({
        title: '',
        message: '',
        onConfirm: () => {},
      })
    }, 300)
  }, [])

  return {
    visible,
    props,
    showConfirmation,
    hideConfirmation,
  }
}