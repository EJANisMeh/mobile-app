import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireOrdersStyles } from '../../../styles/concessionaire'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'

const OrdersScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionaireOrdersStyles = createConcessionaireOrdersStyles(
		colors,
		responsive
	)

	return (
		<DynamicKeyboardView>
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
		</DynamicKeyboardView>
	)
}

export default OrdersScreen
