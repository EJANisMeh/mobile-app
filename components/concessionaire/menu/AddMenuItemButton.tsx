import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire/menu'
import { useConcessionaireNavigation } from '../../../hooks/useNavigation'

const AddMenuItemButton: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)
	const navigation = useConcessionaireNavigation()

	const handleAddItemNav = () => {
		navigation.navigate('AddMenuItem')
	}
	return (
		<TouchableOpacity
			style={styles.addButton}
			onPress={handleAddItemNav}>
			<MaterialCommunityIcons
				name="plus"
				size={20}
				color="#fff"
			/>
			<Text style={styles.addButtonText}>Add Item</Text>
		</TouchableOpacity>
	)
}

export default AddMenuItemButton
