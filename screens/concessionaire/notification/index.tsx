import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireNotificationsStyles } from '../../../styles/concessionaire'
import DynamicScrollView from '../../../components/DynamicScrollView'

const NotificationsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionaireNotificationsStyles =
		createConcessionaireNotificationsStyles(colors, responsive)

	return (
		<DynamicScrollView
			styles={concessionaireNotificationsStyles.container}
			autoCenter="center"
			fallbackAlign="center">
			<View>
				<Text style={concessionaireNotificationsStyles.containerText}>
					Notifications
				</Text>
				<Text style={concessionaireNotificationsStyles.containerSubtext}>
					Coming Soon
				</Text>
			</View>
		</DynamicScrollView>
	)
}

export default NotificationsScreen
