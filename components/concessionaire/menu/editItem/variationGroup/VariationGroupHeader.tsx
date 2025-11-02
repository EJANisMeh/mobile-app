import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireEditMenuItemStyles } from '../../../../../styles/concessionaire'
import { AddMenuItemFormData } from '../../../../../types'
import { UseConfirmationModalType } from '../../../../../hooks/useModals/types'

interface VariationGroupHeaderProps {
	groupIndex: number
	setFormData: React.Dispatch<React.SetStateAction<AddMenuItemFormData>>
	showConfirmation: UseConfirmationModalType['showConfirmation']
}

const VariationGroupHeader: React.FC<VariationGroupHeaderProps> = ({
	groupIndex,
	setFormData,
	showConfirmation,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireEditMenuItemStyles(colors, responsive)

	const handleRemoveVariationGroup = (index: number) => {
		showConfirmation({
			title: 'Remove Variation Group',
			message: 'Remove this variation group?',
			confirmText: 'Remove',
			cancelText: 'Cancel',
			confirmStyle: 'destructive',
			onConfirm: () => {
				setFormData((prev) => ({
					...prev,
					variationGroups: prev.variationGroups.filter((_, i) => i !== index),
				}))
			},
		})
	}

	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				marginBottom: 8,
				gap: 8,
			}}>
			<Text
				style={{
					fontSize: 14,
					fontWeight: '600',
					color: colors.text,
					flex: 1,
				}}>
				Variation Group {groupIndex + 1}
			</Text>
			<TouchableOpacity onPress={() => handleRemoveVariationGroup(groupIndex)}>
				<Ionicons
					name="trash-outline"
					size={20}
					color="#ef4444"
				/>
			</TouchableOpacity>
		</View>
	)
}

export default VariationGroupHeader
