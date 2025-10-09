import React from 'react'
import { View, Text } from 'react-native'
import { concessionaireOrdersStyles } from '../../../styles/concessionaire'

const OrdersScreen: React.FC = () => (
	<View style={concessionaireOrdersStyles.placeholder}>
		<Text style={concessionaireOrdersStyles.placeholderText}>
			Incoming Orders
		</Text>
		<Text style={concessionaireOrdersStyles.placeholderSubtext}>
			Coming Soon
		</Text>
	</View>
)

export default OrdersScreen
