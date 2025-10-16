import React from 'react'
import { View, Text } from 'react-native'
import { customerCartStyles } from '../../../styles/customer'

const CartScreen: React.FC = () => (
	<View style={customerCartStyles.placeholder}>
		<Text style={customerCartStyles.placeholderText}>Cart Screen</Text>
		<Text style={customerCartStyles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

export default CartScreen
