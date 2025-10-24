import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerNotificationsStyles } from '../../../styles/customer'

const NotificationsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerNotificationsStyles = createCustomerNotificationsStyles(
		colors,
		responsive
	)

	return (
		<View style={customerNotificationsStyles.placeholder}>
			<Text style={customerNotificationsStyles.placeholderText}>
				Notifications Screen
			</Text>
			<Text style={customerNotificationsStyles.placeholderSubtext}>
				Coming Soon
			</Text>
		</View>
	)
}

export default NotificationsScreen
