import React from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from 'react-native'
import BaseModal from './BaseModal'

export interface MenuOption {
	text?: string
	label?: string
	value?: any
	onPress?: () => void
	style?: 'default' | 'destructive'
	icon?: string
}

interface MenuModalProps {
	visible: boolean
	onClose: () => void
	title: string
	message?: string
	options: MenuOption[]
	onSelect?: (value: any) => void
	footer?: React.ReactNode
}

const MenuModal: React.FC<MenuModalProps> = ({
	visible,
	onClose,
	title,
	message,
	options,
	onSelect,
	footer,
}) => {
	const handleOptionPress = (option: MenuOption) => {
		if (option.onPress) {
			option.onPress()
		} else if (onSelect && option.value !== undefined) {
			onSelect(option.value)
		}
		onClose()
	}

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title={title}>
			{message && <Text style={styles.message}>{message}</Text>}

			<ScrollView style={styles.optionsContainer}>
				{options.map((option, index) => (
					<TouchableOpacity
						key={index}
						style={[
							styles.option,
							option.style === 'destructive' && styles.destructiveOption,
						]}
						onPress={() => handleOptionPress(option)}>
						<Text
							style={[
								styles.optionText,
								option.style === 'destructive' && styles.destructiveOptionText,
							]}>
							{option.text || option.label}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>

			{footer && <View style={styles.footerContainer}>{footer}</View>}

			<TouchableOpacity
				style={styles.cancelButton}
				onPress={onClose}>
				<Text style={styles.cancelButtonText}>Cancel</Text>
			</TouchableOpacity>
		</BaseModal>
	)
}

const styles = StyleSheet.create({
	message: {
		fontSize: 14,
		color: '#666',
		lineHeight: 20,
		marginBottom: 15,
		textAlign: 'center',
	},
	optionsContainer: {
		maxHeight: 300,
		marginBottom: 15,
	},
	option: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 8,
		backgroundColor: '#f8f9fa',
		marginBottom: 8,
		alignItems: 'center',
	},
	destructiveOption: {
		backgroundColor: '#f8d7da',
	},
	optionText: {
		fontSize: 16,
		fontWeight: '500',
		color: '#333',
	},
	destructiveOptionText: {
		color: '#721c24',
	},
	footerContainer: {
		marginBottom: 15,
	},
	cancelButton: {
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		backgroundColor: '#6c757d',
		alignItems: 'center',
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
	},
})

export default MenuModal
