import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerCartStyles } from '../../../styles/customer'
import DynamicScrollView from '../../../components/DynamicScrollView'

const CartScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerCartStyles = createCustomerCartStyles(colors, responsive)

	return (
		<DynamicScrollView
			styles={customerCartStyles.container}
			autoCenter="center"
			fallbackAlign="center">
			<View>
				<Text style={customerCartStyles.containerText}>Cart Screen</Text>
				<Text style={customerCartStyles.containerSubtext}>Coming Soon</Text>
			</View>
		</DynamicScrollView>
	)
}

export default CartScreen
