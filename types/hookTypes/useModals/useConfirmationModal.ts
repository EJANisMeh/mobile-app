export interface UseConfirmationModalProps {
	title: string
	message: string
	confirmText?: string
	cancelText?: string
	confirmStyle?: 'default' | 'destructive'
	onConfirm: () => void
	onCancel?: () => void
}
