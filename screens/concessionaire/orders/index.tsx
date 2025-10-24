import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireOrdersStyles } from '../../../styles/concessionaire'

const OrdersScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionaireOrdersStyles = createConcessionaireOrdersStyles(
		colors,
		responsive
	)

	return (
		<View style={concessionaireOrdersStyles.placeholder}>
			<Text style={concessionaireOrdersStyles.placeholderText}>
				Incoming Orders
			</Text>
			<Text style={concessionaireOrdersStyles.placeholderSubtext}>
				Coming Soon
			</Text>
		</View>
	)
}

export default OrdersScreen
