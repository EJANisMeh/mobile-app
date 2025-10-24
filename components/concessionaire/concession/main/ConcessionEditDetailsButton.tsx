import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionStyles } from '../../../../styles/concessionaire'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useConcessionNavigation } from '../../../../hooks/useNavigation'

const ConcessionEditDetailsButton: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionStyles = createConcessionStyles(colors, responsive)
	const navigation = useConcessionNavigation()

	const handleEditDetails = () => {
		navigation.navigate('EditConcessionDetails' as never)
	}

	return (
		<TouchableOpacity
			style={concessionStyles.actionButton}
			onPress={handleEditDetails}>
			<MaterialCommunityIcons
				name="store-edit"
				size={24}
				color={colors.primary}
				style={concessionStyles.actionIcon}
			/>
			<Text style={concessionStyles.actionText}>Edit Details</Text>
			<MaterialCommunityIcons
				name="chevron-right"
				size={24}
				color={colors.placeholder}
				style={concessionStyles.actionArrow}
			/>
		</TouchableOpacity>
	)
}

export default ConcessionEditDetailsButton
