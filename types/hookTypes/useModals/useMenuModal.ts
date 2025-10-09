interface MenuOption {
	text: string
	onPress: () => void
	style?: 'default' | 'destructive'
}

export interface UseMenuModalProps {
  title: string
  message?: string
  options: MenuOption[]
}