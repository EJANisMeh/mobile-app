import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire'

const MenuScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionaireMenuStyles = createConcessionaireMenuStyles(
		colors,
		responsive
	)

	return (
		<View style={concessionaireMenuStyles.placeholder}>
			<Text style={concessionaireMenuStyles.placeholderText}>
				Menu Management
			</Text>
			<Text style={concessionaireMenuStyles.placeholderSubtext}>
				Coming Soon
			</Text>
		</View>
	)
}

export default MenuScreen
