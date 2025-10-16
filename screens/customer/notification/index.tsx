import React from 'react'
import { View, Text } from 'react-native'
import { customerNotificationsStyles } from '../../../styles/customer'

const NotificationsScreen: React.FC = () => (
	<View style={customerNotificationsStyles.placeholder}>
		<Text style={customerNotificationsStyles.placeholderText}>
			Notifications Screen
		</Text>
		<Text style={customerNotificationsStyles.placeholderSubtext}>
			Coming Soon
		</Text>
	</View>
)

export default NotificationsScreen
