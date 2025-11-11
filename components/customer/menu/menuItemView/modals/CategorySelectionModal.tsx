import React, { useState } from 'react'
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	StyleSheet,
} from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'

interface Category {
	id: number
	name: string
}

interface CategorySelectionModalProps {
	visible: boolean
	categories: Category[]
	onClose: () => void
	onConfirm: (categoryId: number) => void
	title?: string
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
	visible,
	categories,
	onClose,
	onConfirm,
	title = 'Select a category',
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null
	)

	const handleCancel = () => {
		setSelectedCategoryId(null)
		onClose()
	}

	const handleConfirm = () => {
		if (selectedCategoryId !== null) {
			onConfirm(selectedCategoryId)
			setSelectedCategoryId(null)
		}
	}

	const canConfirm = selectedCategoryId !== null

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleCancel}>
			<View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
				<View
					style={[
						styles.modalContainer,
						{
							backgroundColor: colors.surface,
							maxHeight: responsive.getResponsiveValue(500, 600),
						},
					]}>
					<Text style={[styles.title, { color: colors.text }]}>{title}</Text>

					<ScrollView style={styles.scrollView}>
						{categories.map((category) => {
							const isSelected = selectedCategoryId === category.id
							return (
								<TouchableOpacity
									key={category.id}
									style={[
										styles.categoryItem,
										{
											backgroundColor: isSelected
												? colors.primary + '20'
												: colors.background,
											borderColor: isSelected ? colors.primary : colors.border,
										},
									]}
									onPress={() => setSelectedCategoryId(category.id)}>
									<View style={styles.radioButton}>
										{isSelected && (
											<View
												style={[
													styles.radioButtonInner,
													{ backgroundColor: colors.primary },
												]}
											/>
										)}
									</View>
									<Text style={[styles.categoryName, { color: colors.text }]}>
										{category.name}
									</Text>
								</TouchableOpacity>
							)
						})}
					</ScrollView>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[
								styles.button,
								styles.cancelButton,
								{ backgroundColor: colors.surface, borderColor: colors.border },
							]}
							onPress={handleCancel}>
							<Text style={[styles.buttonText, { color: colors.text }]}>
								Cancel
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.button,
								styles.confirmButton,
								{
									backgroundColor: canConfirm
										? colors.primary
										: colors.disabled,
								},
							]}
							onPress={handleConfirm}
							disabled={!canConfirm}>
							<Text
								style={[
									styles.buttonText,
									{ color: canConfirm ? colors.textOnPrimary : colors.text },
								]}>
								Confirm
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalContainer: {
		width: '100%',
		maxWidth: 500,
		borderRadius: 12,
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	scrollView: {
		maxHeight: 400,
		marginBottom: 16,
	},
	categoryItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderRadius: 8,
		borderWidth: 2,
		marginBottom: 8,
	},
	radioButton: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#ccc',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	radioButtonInner: {
		width: 12,
		height: 12,
		borderRadius: 6,
	},
	categoryName: {
		fontSize: 16,
		flex: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		gap: 12,
	},
	button: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	cancelButton: {
		borderWidth: 1,
	},
	confirmButton: {},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
	},
})

export default CategorySelectionModal
