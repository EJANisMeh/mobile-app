import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ThemeColors } from '../../../../types/theme'

interface ReadyOrderActionButtonsProps {
	onMarkAsComplete: () => void
	onCancelOrder: () => void
	isProcessing: boolean
	colors: ThemeColors
	styles: any
}

const ReadyOrderActionButtons: React.FC<ReadyOrderActionButtonsProps> = ({
	onMarkAsComplete,
	onCancelOrder,
	isProcessing,
	colors,
	styles,
}) => {
	return (
		<View style={styles.actionButtonsContainer}>
			<TouchableOpacity
				style={[styles.actionButton, styles.completeButton]}
				onPress={onMarkAsComplete}
				disabled={isProcessing}>
				{isProcessing ? (
					<ActivityIndicator
						size="small"
						color="#fff"
					/>
				) : (
					<>
						<MaterialCommunityIcons
							name="check-circle-outline"
							size={24}
							color="#fff"
						/>
						<Text style={styles.actionButtonText}>Mark as Complete</Text>
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

export default ReadyOrderActionButtons
