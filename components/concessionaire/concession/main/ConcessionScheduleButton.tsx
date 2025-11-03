import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionStyles } from '../../../../styles/concessionaire'

interface ConcessionScheduleButtonProps {
	onPress: () => void
	hasSchedule: boolean
}

const ConcessionScheduleButton: React.FC<ConcessionScheduleButtonProps> = ({
	onPress,
	hasSchedule,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionStyles(colors, responsive)

	return (
		<TouchableOpacity
			style={styles.actionButton}
			onPress={onPress}>
			<MaterialCommunityIcons
				name="calendar-clock"
				size={24}
				color={colors.primary}
				style={styles.actionIcon}
			/>
			<Text style={styles.actionText}>
				{hasSchedule ? 'View Schedule' : 'Set Up Schedule'}
			</Text>
			<MaterialCommunityIcons
				name="chevron-right"
				size={24}
				color={colors.placeholder}
				style={styles.actionArrow}
			/>
		</TouchableOpacity>
	)
}

export default ConcessionScheduleButton
