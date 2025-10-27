import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire/menu'
import { useConcessionaireNavigation } from '../../../hooks/useNavigation'

const ManageCategoriesButton: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)
	const navigation = useConcessionaireNavigation()

	const handleManageCategoriesNav = () => {
		navigation.navigate('CategoryManagement')
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
