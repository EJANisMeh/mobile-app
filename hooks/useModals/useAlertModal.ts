import { useState, useCallback } from 'react'

export interface UseAlertModalProps {
  title: string
  message: string
  onConfirm?: () => void
}

export interface UseAlertModalReturn {
  visible: boolean
  title: string
  message: string
  showAlert: (props: UseAlertModalProps) => void
  hideAlert: () => void
  handleConfirm: () => void
}

export const useAlertModal = () =>
{
  const [visible, setVisible] = useState(false)
  const [props, setProps] = useState<UseAlertModalProps>({
    title: '',
    message: '',
  })

  const showAlert = useCallback((alertProps: UseAlertModalProps) => {
    setProps(alertProps)
    setVisible(true)
  }, [])

  const hideAlert = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setProps({ title: '', message: '' })
    }, 300) // Wait for modal animation to complete
  }, [])

  const handleConfirm = useCallback(() => {
    props.onConfirm?.()
    hideAlert()
  }, [props.onConfirm, hideAlert])

  return {
    visible,
    title: props.title,
    message: props.message,
    showAlert,
    hideAlert,
    handleConfirm,
  }
}