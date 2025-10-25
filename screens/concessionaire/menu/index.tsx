import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire'
import DynamicScrollView from '../../../components/DynamicScrollView'

const MenuScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionaireMenuStyles = createConcessionaireMenuStyles(
		colors,
		responsive
	)

	return (
		<DynamicScrollView
			styles={concessionaireMenuStyles.container}
			autoCenter="center"
			fallbackAlign="center">
			<View>
				<Text style={concessionaireMenuStyles.containerText}>
					Menu Management
				</Text>
				<Text style={concessionaireMenuStyles.containerSubtext}>
					Coming Soon
				</Text>
			</View>
		</DynamicScrollView>
	)
}

export default MenuScreen
