import { useState, useCallback } from 'react'

interface MenuOption {
	text?: string
	label?: string
	value?: any
	onPress?: () => void
	style?: 'default' | 'destructive'
}

export interface UseMenuModalProps {
	title: string
	message?: string
	options: MenuOption[]
	onSelect?: (value: any) => void
	footer?: React.ReactNode
}

export interface UseMenuModalType
{
	visible: boolean
	props: UseMenuModalProps
	showMenu: (menuProps: UseMenuModalProps) => void
	hideMenu: () => void
}

export const useMenuModal = (): UseMenuModalType =>
{
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
