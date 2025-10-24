import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerMenuStyles } from '../../../styles/customer'

const MenuScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerMenuStyles = createCustomerMenuStyles(colors, responsive)

	return (
		<View style={customerMenuStyles.placeholder}>
			<Text style={customerMenuStyles.placeholderText}>Menu Screen</Text>
			<Text style={customerMenuStyles.placeholderSubtext}>Coming Soon</Text>
		</View>
	)
}

export default MenuScreen
