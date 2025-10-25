import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerOrdersStyles } from '../../../styles/customer'
import DynamicScrollView from '../../../components/DynamicScrollView'

const OrdersScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerOrdersStyles = createCustomerOrdersStyles(colors, responsive)

	return (
		<DynamicScrollView
			styles={customerOrdersStyles.container}
			autoCenter="center"
			fallbackAlign="center">
			<View>
				<Text style={customerOrdersStyles.containerText}>Orders Screen</Text>
				<Text style={customerOrdersStyles.containerSubtext}>Coming Soon</Text>
			</View>
		</DynamicScrollView>
	)
}

export default OrdersScreen
