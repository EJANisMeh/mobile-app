import { useState, useCallback } from 'react'

export interface UseConfirmationModalProps {
	title: string
	message: string
	confirmText: string
	cancelText: string
	confirmStyle?: 'default' | 'destructive'
	onConfirm: () => void
	onCancel?: () => void
}

export interface UseConfirmationModalType
{
  visible: boolean
  props: UseConfirmationModalProps
  showConfirmation: (confirmProps: UseConfirmationModalProps) => void
  hideConfirmation: () => void
}

export const useConfirmationModal = (): UseConfirmationModalType =>
{
  const [visible, setVisible] = useState(false)
  const [props, setProps] = useState<UseConfirmationModalProps>({
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    onConfirm: () => { },
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
        confirmText: '',
        cancelText: '',
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