import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerNotificationsStyles } from '../../../styles/customer'
import DynamicScrollView from '../../../components/DynamicScrollView'

const NotificationsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerNotificationsStyles = createCustomerNotificationsStyles(
		colors,
		responsive
	)

	return (
		<DynamicScrollView
			styles={customerNotificationsStyles.container}
			autoCenter="center"
			fallbackAlign="center">
			<View>
				<Text style={customerNotificationsStyles.containerText}>
					Notifications Screen
				</Text>
				<Text style={customerNotificationsStyles.containerSubtext}>
					Coming Soon
				</Text>
			</View>
		</DynamicScrollView>
	)
}

export default NotificationsScreen
