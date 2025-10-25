import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireOrdersStyles } from '../../../styles/concessionaire'
import DynamicScrollView from '../../../components/DynamicScrollView'

const OrdersScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionaireOrdersStyles = createConcessionaireOrdersStyles(
		colors,
		responsive
	)

	return (
		<DynamicScrollView
			styles={concessionaireOrdersStyles.container}
			autoCenter="center"
			fallbackAlign="center">
			<View>
				<Text style={concessionaireOrdersStyles.containerText}>
					Incoming Orders
				</Text>
				<Text style={concessionaireOrdersStyles.containerSubtext}>
					Coming Soon
				</Text>
			</View>
		</DynamicScrollView>
	)
}

export default OrdersScreen
