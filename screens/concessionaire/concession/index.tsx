import React from 'react'
import { View, Text } from 'react-native'
import { concessionaireConcessionStyles } from '../../../styles/concessionaire'

const ConcessionScreen: React.FC = () => (
	<View style={concessionaireConcessionStyles.placeholder}>
		<Text style={concessionaireConcessionStyles.placeholderText}>
			My Concession
		</Text>
		<Text style={concessionaireConcessionStyles.placeholderSubtext}>
			Coming Soon
		</Text>
	</View>
)

export default ConcessionScreen
