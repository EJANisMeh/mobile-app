import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionOrderSortModalStyles } from '../../../styles/concessionaire'
import type {
	ConcessionOrderSortRule,
	ConcessionOrderSortField,
} from '../../../types'

interface OrderSortModalProps {
	visible: boolean
	onClose: () => void
	onApply: (sortRules: ConcessionOrderSortRule[]) => void
	currentSortRules: ConcessionOrderSortRule[]
}

const OrderSortModal: React.FC<OrderSortModalProps> = ({
	visible,
	onClose,
	onApply,
	currentSortRules,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionOrderSortModalStyles(colors, responsive)

	const [sortRules, setSortRules] =
		useState<ConcessionOrderSortRule[]>(currentSortRules)

	useEffect(() => {
		if (visible) {
			setSortRules(currentSortRules)
		}
	}, [visible, currentSortRules])

	const sortFields: Array<{
		field: ConcessionOrderSortField
		label: string
		icon: keyof typeof MaterialCommunityIcons.glyphMap
	}> = [
		{ field: 'orderNumber', label: 'Order Number', icon: 'numeric' },
		{ field: 'customerEmail', label: 'Customer Email', icon: 'email' },
		{ field: 'total', label: 'Total Price', icon: 'currency-php' },
		{ field: 'status', label: 'Status', icon: 'flag' },
		{ field: 'orderMode', label: 'Order Mode', icon: 'flash' },
		{ field: 'createdAt', label: 'Order Date', icon: 'calendar' },
		{ field: 'scheduledFor', label: 'Scheduled For', icon: 'clock-outline' },
	]

	const handleApply = () => {
		onApply(sortRules)
		onClose()
	}

	const handleReset = () => {
		setSortRules([{ field: 'createdAt', direction: 'desc' }])
	}

	const handleAddSortField = (field: ConcessionOrderSortField) => {
		const existingIndex = sortRules.findIndex((rule) => rule.field === field)

		if (existingIndex !== -1) {
			return
		}

		setSortRules([...sortRules, { field, direction: 'asc' }])
	}

	const handleRemoveSortField = (index: number) => {
		const newRules = sortRules.filter((_, i) => i !== index)
		if (newRules.length === 0) {
			setSortRules([{ field: 'createdAt', direction: 'desc' }])
		} else {
			setSortRules(newRules)
		}
	}

	const handleToggleDirection = (index: number) => {
		const newRules = [...sortRules]
		newRules[index].direction =
			newRules[index].direction === 'asc' ? 'desc' : 'asc'
		setSortRules(newRules)
	}

	const handleMoveSortField = (index: number, direction: 'up' | 'down') => {
		const newRules = [...sortRules]
		const targetIndex = direction === 'up' ? index - 1 : index + 1

		if (targetIndex < 0 || targetIndex >= newRules.length) {
			return
		}

		;[newRules[index], newRules[targetIndex]] = [
			newRules[targetIndex],
			newRules[index],
		]
		setSortRules(newRules)
	}

	const getFieldLabel = (field: ConcessionOrderSortField) => {
		return sortFields.find((f) => f.field === field)?.label || field
	}

	const getFieldIcon = (field: ConcessionOrderSortField) => {
		return sortFields.find((f) => f.field === field)?.icon || 'sort'
	}

	const availableFields = sortFields.filter(
		(field) => !sortRules.find((rule) => rule.field === field.field)
	)

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title="Sort Orders">
			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}>
				{/* Active Sort Rules */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Sort Priority</Text>
					<Text style={styles.sectionHint}>
						Orders are sorted by the first rule, then by the second, and so on.
					</Text>
					{sortRules.map((rule, index) => (
						<View
							key={`${rule.field}-${index}`}
							style={styles.sortRuleCard}>
							<View style={styles.sortRuleHeader}>
								<View style={styles.sortRuleInfo}>
									<Text style={styles.sortRulePriority}>{index + 1}.</Text>
									<MaterialCommunityIcons
										name={getFieldIcon(rule.field)}
										size={20}
										color={colors.primary}
									/>
									<Text style={styles.sortRuleLabel}>
										{getFieldLabel(rule.field)}
									</Text>
								</View>
								<TouchableOpacity
									style={styles.removeButton}
									onPress={() => handleRemoveSortField(index)}>
									<MaterialCommunityIcons
										name="close"
										size={20}
										color={colors.error}
									/>
								</TouchableOpacity>
							</View>
							<View style={styles.sortRuleActions}>
								<TouchableOpacity
									style={[
										styles.directionButton,
										rule.direction === 'asc' && styles.directionButtonActive,
									]}
									onPress={() => handleToggleDirection(index)}>
									<MaterialCommunityIcons
										name="arrow-up"
										size={16}
										color={
											rule.direction === 'asc' ? colors.surface : colors.text
										}
									/>
									<Text
										style={[
											styles.directionButtonText,
											rule.direction === 'asc' &&
												styles.directionButtonTextActive,
										]}>
										Ascending
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[
										styles.directionButton,
										rule.direction === 'desc' && styles.directionButtonActive,
									]}
									onPress={() => handleToggleDirection(index)}>
									<MaterialCommunityIcons
										name="arrow-down"
										size={16}
										color={
											rule.direction === 'desc' ? colors.surface : colors.text
										}
									/>
									<Text
										style={[
											styles.directionButtonText,
											rule.direction === 'desc' &&
												styles.directionButtonTextActive,
										]}>
										Descending
									</Text>
								</TouchableOpacity>
							</View>
							{sortRules.length > 1 && (
								<View style={styles.moveButtons}>
									<TouchableOpacity
										style={[
											styles.moveButton,
											index === 0 && styles.moveButtonDisabled,
										]}
										onPress={() => handleMoveSortField(index, 'up')}
										disabled={index === 0}>
										<MaterialCommunityIcons
											name="chevron-up"
											size={20}
											color={
												index === 0 ? colors.textSecondary : colors.primary
											}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.moveButton,
											index === sortRules.length - 1 &&
												styles.moveButtonDisabled,
										]}
										onPress={() => handleMoveSortField(index, 'down')}
										disabled={index === sortRules.length - 1}>
										<MaterialCommunityIcons
											name="chevron-down"
											size={20}
											color={
												index === sortRules.length - 1
													? colors.textSecondary
													: colors.primary
											}
										/>
									</TouchableOpacity>
								</View>
							)}
						</View>
					))}
				</View>

				{/* Available Fields */}
				{availableFields.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Add Sort Field</Text>
						<View style={styles.availableFields}>
							{availableFields.map((field) => (
								<TouchableOpacity
									key={field.field}
									style={styles.availableFieldButton}
									onPress={() => handleAddSortField(field.field)}>
									<MaterialCommunityIcons
										name={field.icon}
										size={18}
										color={colors.primary}
									/>
									<Text style={styles.availableFieldText}>{field.label}</Text>
									<MaterialCommunityIcons
										name="plus"
										size={18}
										color={colors.primary}
									/>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)}

				{/* Action Buttons */}
				<View style={styles.actionsRow}>
					<TouchableOpacity
						style={[styles.actionButton, styles.resetButton]}
						onPress={handleReset}>
						<MaterialCommunityIcons
							name="refresh"
							size={20}
							color={colors.text}
						/>
						<Text style={styles.actionButtonText}>Reset</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.actionButton,
							styles.applyButton,
							styles.actionButtonSpacing,
						]}
						onPress={handleApply}>
						<MaterialCommunityIcons
							name="check"
							size={20}
							color={colors.surface}
						/>
						<Text style={styles.applyButtonText}>Apply Sort</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</BaseModal>
	)
}

export default OrderSortModal
