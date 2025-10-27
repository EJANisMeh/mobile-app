import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire/menu'
import { UseAlertModalType } from '../../../hooks/useModals/types'

interface AddMenuItemButtonProps
{
  showAlert: UseAlertModalType['showAlert']
}

const AddMenuItemButton: React.FC<AddMenuItemButtonProps> = ({ 
  showAlert
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
  const styles = createConcessionaireMenuStyles(colors, responsive)
  
	const handleAddItemNav = () => {
		// TODO: Navigate to add item screen
		showAlert({
			title: 'Coming Soon',
			message: 'Add item functionality will be implemented',
    })
    
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
