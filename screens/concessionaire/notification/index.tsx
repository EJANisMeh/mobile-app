import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireNotificationsStyles } from '../../../styles/concessionaire'

const NotificationsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionaireNotificationsStyles =
		createConcessionaireNotificationsStyles(colors, responsive)

	return (
		<View style={concessionaireNotificationsStyles.placeholder}>
			<Text style={concessionaireNotificationsStyles.placeholderText}>
				Notifications
			</Text>
			<Text style={concessionaireNotificationsStyles.placeholderSubtext}>
				Coming Soon
			</Text>
		</View>
	)
}

export default NotificationsScreen
