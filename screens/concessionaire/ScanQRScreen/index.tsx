import React from 'react'
import { View, Text } from 'react-native'
import { concessionaireScanQRStyles } from '../../../styles/concessionaire'

const ScanQRScreen: React.FC = () => (
	<View style={concessionaireScanQRStyles.placeholder}>
		<Text style={concessionaireScanQRStyles.placeholderText}>Scan QR</Text>
		<Text style={concessionaireScanQRStyles.placeholderSubtext}>
			Coming Soon
		</Text>
	</View>
)

export default ScanQRScreen
