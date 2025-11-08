import React from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
import { VariationGroupInput } from '../../../../../types/menuItemTypes'
import { UseAlertModalType } from '../../../../../hooks/useModals/types'

interface VariationMultiLimitProps {
	groupIndex: number
	group: VariationGroupInput
	errors: Record<string, string>
	setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
	showAlert: UseAlertModalType['showAlert']
	handleUpdateVariationGroup: (
		index: number,
		field: keyof VariationGroupInput,
		value: any
	) => void
}

const VariationMultiLimit: React.FC<VariationMultiLimitProps> = ({
	groupIndex,
	group,
	errors,
	setErrors,
	showAlert,
	handleUpdateVariationGroup,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	// Calculate max limit based on number of options
	const maxLimit = group.mode === 'custom' ? group.options.length : 0
	const currentLimit = group.multiLimit ?? 0

	const handleDecrement = () => {
		const newLimit = Math.max(0, currentLimit - 1)
		handleUpdateVariationGroup(
			groupIndex,
			'multiLimit',
			newLimit === 0 ? 0 : newLimit
		)
		setErrors((prev) => ({
			...prev,
			[`variation-${groupIndex}-multiLimit`]: '',
		}))
	}

	const handleIncrement = () => {
		if (maxLimit > 0 && currentLimit < maxLimit) {
			const newLimit = currentLimit + 1
			handleUpdateVariationGroup(groupIndex, 'multiLimit', newLimit)
			setErrors((prev) => ({
				...prev,
				[`variation-${groupIndex}-multiLimit`]: '',
			}))
		}
	}

	return (
		<>
			<View style={styles.multiLimitContainer}>
				<View style={styles.modeSelectionHeader}>
					<Text style={styles.labelSmallFlex}>Limit</Text>
					<TouchableOpacity
						style={styles.helpButton}
						onPress={() =>
							showAlert({
								title: 'Limit Help',
								message:
									'Limit controls the maximum number of choices a customer can select.\n\n0 = No limit (unlimited choices)\n1-' +
									maxLimit +
									' = Maximum number of choices\n\nThe limit cannot exceed the number of options available.',
							})
						}>
						<Text style={styles.helpButtonText}>?</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.multiLimitInputRow}>
					<TouchableOpacity
						style={[
							styles.multiLimitButton,
							currentLimit === 0 && styles.multiLimitButtonDisabled,
						]}
						onPress={handleDecrement}
						disabled={currentLimit === 0}>
						<Text style={styles.multiLimitButtonText}>−</Text>
					</TouchableOpacity>
					<View style={styles.multiLimitValueContainer}>
						<Text style={styles.multiLimitValue}>
							{currentLimit === 0 ? 'No limit' : currentLimit}
						</Text>
					</View>
					<TouchableOpacity
						style={[
							styles.multiLimitButton,
							(maxLimit === 0 || currentLimit >= maxLimit) &&
								styles.multiLimitButtonDisabled,
						]}
						onPress={handleIncrement}
						disabled={maxLimit === 0 || currentLimit >= maxLimit}>
						<Text style={styles.multiLimitButtonText}>+</Text>
					</TouchableOpacity>
				</View>
				{errors[`variation-${groupIndex}-multiLimit`] && (
					<Text style={styles.errorTextMargin}>
						{errors[`variation-${groupIndex}-multiLimit`]}
					</Text>
				)}
			</View>
		</>
	)
}

export default VariationMultiLimit
