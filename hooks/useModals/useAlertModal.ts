import { useState, useCallback } from 'react'
import { UseAlertModalProps } from '../../types/'

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