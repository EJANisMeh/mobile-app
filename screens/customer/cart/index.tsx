import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerCartStyles } from '../../../styles/customer'

const CartScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerCartStyles = createCustomerCartStyles(colors, responsive)

	return (
		<View style={customerCartStyles.placeholder}>
			<Text style={customerCartStyles.placeholderText}>Cart Screen</Text>
			<Text style={customerCartStyles.placeholderSubtext}>Coming Soon</Text>
		</View>
	)
}

export default CartScreen
