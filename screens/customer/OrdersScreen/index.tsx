import React from 'react'
import { View, Text } from 'react-native'
import { customerOrdersStyles } from '../../../styles/customer'

const OrdersScreen: React.FC = () => (
	<View style={customerOrdersStyles.placeholder}>
		<Text style={customerOrdersStyles.placeholderText}>Orders Screen</Text>
		<Text style={customerOrdersStyles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

export default OrdersScreen
