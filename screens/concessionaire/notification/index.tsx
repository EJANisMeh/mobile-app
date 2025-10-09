import React from 'react'
import { View, Text } from 'react-native'
import { concessionaireNotificationsStyles } from '../../../styles/concessionaire'

const NotificationsScreen: React.FC = () => (
	<View style={concessionaireNotificationsStyles.placeholder}>
		<Text style={concessionaireNotificationsStyles.placeholderText}>
			Notifications
		</Text>
		<Text style={concessionaireNotificationsStyles.placeholderSubtext}>
			Coming Soon
		</Text>
	</View>
)

export default NotificationsScreen
