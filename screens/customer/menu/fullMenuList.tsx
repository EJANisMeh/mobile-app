import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { createCustomerMenuStyles } from '../../../styles/customer'

const FullMenuListScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerMenuStyles = createCustomerMenuStyles(colors, responsive)

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				styles={customerMenuStyles.container}
				autoCenter="center"
				fallbackAlign="center">
				<View>
					<Text style={customerMenuStyles.containerText}>Coming Soon</Text>
					<Text style={customerMenuStyles.containerSubtext}>
						Full menu list will be displayed here
					</Text>
				</View>
			</DynamicScrollView>
		</DynamicKeyboardView>
	)
}

export default FullMenuListScreen
