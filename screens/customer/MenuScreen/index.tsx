import React from 'react'
import { View, Text } from 'react-native'
import { customerMenuStyles } from '../../../styles/customer'

const MenuScreen: React.FC = () => (
	<View style={customerMenuStyles.placeholder}>
		<Text style={customerMenuStyles.placeholderText}>Menu Screen</Text>
		<Text style={customerMenuStyles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

export default MenuScreen
