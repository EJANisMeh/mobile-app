import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ThemeColors } from '../../../../types/theme'

interface ConfirmedOrderActionButtonsProps {
	onMarkAsReady: () => void
	onCancelOrder: () => void
	isProcessing: boolean
	colors: ThemeColors
	styles: any
}

const ConfirmedOrderActionButtons: React.FC<
	ConfirmedOrderActionButtonsProps
> = ({ onMarkAsReady, onCancelOrder, isProcessing, colors, styles }) => {
	return (
		<View style={styles.actionButtonsContainer}>
			<TouchableOpacity
				style={[styles.actionButton, styles.readyButton]}
				onPress={onMarkAsReady}
				disabled={isProcessing}>
				{isProcessing ? (
					<ActivityIndicator
						size="small"
						color="#fff"
					/>
				) : (
					<>
						<MaterialCommunityIcons
							name="check-bold"
							size={24}
							color="#fff"
						/>
						<Text style={styles.actionButtonText}>Mark as Ready</Text>
					</>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.actionButton, styles.cancelButton]}
				onPress={onCancelOrder}
				disabled={isProcessing}>
				{isProcessing ? (
					<ActivityIndicator
						size="small"
						color="#fff"
					/>
				) : (
					<>
						<MaterialCommunityIcons
							name="cancel"
							size={24}
							color="#fff"
						/>
						<Text style={styles.actionButtonText}>Cancel Order</Text>
					</>
				)}
			</TouchableOpacity>
		</View>
	)
}

export default ConfirmedOrderActionButtons
