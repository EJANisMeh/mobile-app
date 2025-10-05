import { useState, useCallback } from 'react'

interface UseAlertModalProps {
	title: string
	message?: string
	onConfirm?: () => void
}

export const useAlertModal = () => {
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

interface UseConfirmationModalProps {
	title: string
	message: string
	confirmText?: string
	cancelText?: string
	confirmStyle?: 'default' | 'destructive'
	onConfirm: () => void
	onCancel?: () => void
}

export const useConfirmationModal = () => {
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

interface MenuOption {
	text: string
	onPress: () => void
	style?: 'default' | 'destructive'
}

interface UseMenuModalProps {
	title: string
	message?: string
	options: MenuOption[]
}

export const useMenuModal = () => {
	const [visible, setVisible] = useState(false)
	const [props, setProps] = useState<UseMenuModalProps>({
		title: '',
		options: [],
	})

	const showMenu = useCallback((menuProps: UseMenuModalProps) => {
		setProps(menuProps)
		setVisible(true)
	}, [])

	const hideMenu = useCallback(() => {
		setVisible(false)
		setTimeout(() => {
			setProps({
				title: '',
				options: [],
			})
		}, 300)
	}, [])

	return {
		visible,
		props,
		showMenu,
		hideMenu,
	}
}
