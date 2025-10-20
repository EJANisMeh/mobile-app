import { useState, useCallback } from 'react'

export interface UseAlertModalProps {
	title: string
	message: string
	onConfirm?: () => void
	onClose?: () => void
}

export interface UseAlertModalType {
	visible: boolean
	title: string
	message: string
	showAlert: (props: UseAlertModalProps) => void
	hideAlert: () => void
	handleConfirm: () => void
	handleClose: () => void
}

export const useAlertModal = (): UseAlertModalType => {
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
		// capture current onClose so it remains stable after state changes
		const onClose = props.onClose

		setVisible(false)

		setTimeout(() => {
			setProps({ title: '', message: '' })
		}, 300) // Wait for modal animation to complete

		// call onClose (if provided) whenever the modal is hidden
		if (onClose) {
			try {
				onClose()
			} catch {
				/* swallow to avoid breaking hide */
			}
		}
	}, [props.onClose])

	const handleConfirm = useCallback(() => {
		props.onConfirm?.()
		hideAlert()
	}, [props.onConfirm, hideAlert])

	const handleClose = useCallback(() => {
		props.onClose?.()
	}, [props.onClose])

	return {
		visible,
		title: props.title,
		message: props.message,
		showAlert,
		hideAlert,
		handleConfirm,
		handleClose,
	}
}
