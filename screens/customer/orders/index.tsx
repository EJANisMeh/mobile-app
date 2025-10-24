import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerOrdersStyles } from '../../../styles/customer'

const OrdersScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerOrdersStyles = createCustomerOrdersStyles(colors, responsive)

	return (
		<View style={customerOrdersStyles.placeholder}>
			<Text style={customerOrdersStyles.placeholderText}>Orders Screen</Text>
			<Text style={customerOrdersStyles.placeholderSubtext}>Coming Soon</Text>
		</View>
	)
}

export default OrdersScreen
