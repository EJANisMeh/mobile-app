import React from 'react'
import { View, Text } from 'react-native'
import { concessionaireMenuStyles } from '../../../styles/concessionaire'

const MenuScreen: React.FC = () => (
	<View style={concessionaireMenuStyles.placeholder}>
		<Text style={concessionaireMenuStyles.placeholderText}>
			Menu Management
		</Text>
		<Text style={concessionaireMenuStyles.placeholderSubtext}>Coming Soon</Text>
	</View>
)

export default MenuScreen
