import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerMenuStyles } from '../../../styles/customer'
import DynamicScrollView from '../../../components/DynamicScrollView'

const MenuScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerMenuStyles = createCustomerMenuStyles(colors, responsive)

	return (
		<DynamicScrollView
			styles={customerMenuStyles.container}
			autoCenter="center"
			fallbackAlign="center">
			<View>
				<Text style={customerMenuStyles.containerText}>Menu Screen</Text>
				<Text style={customerMenuStyles.containerSubtext}>Coming Soon</Text>
			</View>
		</DynamicScrollView>
	)
}

export default MenuScreen
