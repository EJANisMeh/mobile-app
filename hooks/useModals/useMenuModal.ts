import { useState, useCallback } from 'react'
import { UseMenuModalProps } from '../../types/hookTypes/useModals'

export const useMenuModal = () =>
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
