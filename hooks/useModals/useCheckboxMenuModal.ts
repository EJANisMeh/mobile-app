import { useState } from 'react'
import { CheckboxMenuOption } from '../../components/modals/CheckboxMenuModal'

export interface UseCheckboxMenuModalProps {
	title: string
	message?: string
	options: CheckboxMenuOption[]
	selectedValues: any[]
	onSave: (selectedValues: any[]) => void
	footer?: React.ReactNode
}

export interface UseCheckboxMenuModalType {
	visible: boolean
	props: UseCheckboxMenuModalProps
	showMenu: (props: UseCheckboxMenuModalProps) => void
	hideMenu: () => void
}

export const useCheckboxMenuModal = (): UseCheckboxMenuModalType => {
	const [visible, setVisible] = useState(false)
	const [props, setProps] = useState<UseCheckboxMenuModalProps>({
		title: '',
		options: [],
		selectedValues: [],
		onSave: () => {},
	})

	const showMenu = (newProps: UseCheckboxMenuModalProps) => {
		setProps(newProps)
		setVisible(true)
	}

	const hideMenu = () => {
		setVisible(false)
	}

	return {
		visible,
		props,
		showMenu,
		hideMenu,
	}
}
