import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire/menu'
import { UseAlertModalType } from '../../../hooks/useModals/types'

interface ManageCategoriesButtonProps {
	showAlert: UseAlertModalType['showAlert']
}

const ManageCategoriesButton: React.FC<ManageCategoriesButtonProps> = ({
	showAlert,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)

	const handleManageCategoriesNav = () => {
		// TODO: Navigate to manage categories screen
		showAlert({
			title: 'Coming Soon',
			message: 'Category management will be implemented',
		})
	}

	return (
		<TouchableOpacity
			style={styles.categoryButton}
			onPress={handleManageCategoriesNav}>
			<MaterialCommunityIcons
				name="shape"
				size={20}
				color={colors.primary}
			/>
			<Text style={styles.categoryButtonText}>Categories</Text>
		</TouchableOpacity>
	)
}

export default ManageCategoriesButton
