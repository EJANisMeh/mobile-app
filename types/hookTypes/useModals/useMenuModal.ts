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