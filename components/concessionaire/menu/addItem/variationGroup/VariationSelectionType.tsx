import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../../context'
import { useResponsiveDimensions } from '../../../../../hooks'
import { createConcessionaireAddMenuItemStyles } from '../../../../../styles/concessionaire/addMenuItem'
import { VariationGroupInput, SelectionType } from '../../../../../types/menuItemTypes'
import { UseMenuModalType, UseAlertModalType } from '../../../../../hooks/useModals/types'

interface VariationSelectionTypeProps
{
  groupIndex: number
  group: VariationGroupInput
  selectionTypes: SelectionType[]
  showAlert: UseAlertModalType['showAlert']
  showMenuModal: UseMenuModalType['showMenu']
  handleUpdateVariationGroup: (
    index: number,
    field: keyof VariationGroupInput,
    value: any
  ) => void
}

const VariationSelectionType: React.FC<VariationSelectionTypeProps> = ({
  groupIndex,
  group,
  selectionTypes,
  showAlert,
  showMenuModal,
  handleUpdateVariationGroup
}) =>
{
  const { colors } = useThemeContext()
  const responsive = useResponsiveDimensions()
  const styles = createConcessionaireAddMenuItemStyles(colors, responsive)

	return (
		<>
			<View style={styles.modeSelectionHeader}>
				<Text style={styles.modeSelectionLabel}>Selection Type:</Text>
				<TouchableOpacity
					style={styles.helpButton}
					onPress={() =>
						showAlert({
							title: 'Selection Type Help',
							message:
								'Single - Required: user must pick exactly one option.\n\nSingle - Optional: user can pick zero or one.\n\nMulti - Required: user must pick at least one up to the limit.\n\nMulti - Optional: user can pick zero or more up to the limit.',
						})
					}>
					<Text style={styles.helpButtonText}>?</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity
				style={[styles.categoryInputContainer, { marginBottom: 8 }]}
				onPress={() => {
					const typeOptions = selectionTypes.map((type) => ({
						label: type.code,
						value: type.id,
					}))
					showMenuModal({
						title: 'Select Type',
						options: typeOptions,
						onSelect: (value: number) => {
							handleUpdateVariationGroup(groupIndex, 'selectionTypeId', value)
						},
					})
				}}>
				<Text style={styles.categoryInput}>
					{selectionTypes.find((t) => t.id === group.selectionTypeId)?.code ||
						'Select type'}
				</Text>
				<Ionicons
					name="chevron-down"
					size={16}
					color={colors.textSecondary}
				/>
			</TouchableOpacity>
		</>
	)
}

export default VariationSelectionType
