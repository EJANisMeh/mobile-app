import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createOrderSortModalStyles } from '../../../styles/customer'
import type { SortRule, OrderSortField, SortDirection } from '../../../types'

interface OrderSortModalProps {
	visible: boolean
	onClose: () => void
	onApply: (sortRules: SortRule[]) => void
	currentSortRules: SortRule[]
}

const SORT_FIELD_LABELS: Record<OrderSortField, string> = {
	concessionName: 'Concession Name',
	total: 'Total Amount',
	status: 'Status',
	orderMode: 'Order Mode',
	createdAt: 'Order Date',
	scheduledFor: 'Scheduled Date',
}

const OrderSortModal: React.FC<OrderSortModalProps> = ({
	visible,
	onClose,
	onApply,
	currentSortRules,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createOrderSortModalStyles(colors, responsive)

	const [sortRules, setSortRules] = useState<SortRule[]>(currentSortRules)

	useEffect(() => {
		if (visible) {
			setSortRules(
				currentSortRules.length > 0
					? currentSortRules
					: [{ field: 'createdAt', direction: 'desc' }]
			)
		}
	}, [visible, currentSortRules])

	const handleApply = () => {
		onApply(sortRules)
		onClose()
	}

	const handleReset = () => {
		setSortRules([{ field: 'createdAt', direction: 'desc' }])
	}

	const addSortRule = () => {
		const availableFields = Object.keys(SORT_FIELD_LABELS).filter(
			(field) => !sortRules.some((rule) => rule.field === field)
		) as OrderSortField[]

		if (availableFields.length > 0) {
			setSortRules([
				...sortRules,
				{ field: availableFields[0], direction: 'asc' },
			])
		}
	}

	const removeSortRule = (index: number) => {
		if (sortRules.length > 1) {
			setSortRules(sortRules.filter((_, i) => i !== index))
		}
	}

	const updateSortRule = (
		index: number,
		field: OrderSortField,
		direction: SortDirection
	) => {
		const newRules = [...sortRules]
		newRules[index] = { field, direction }
		setSortRules(newRules)
	}

	const moveSortRule = (index: number, direction: 'up' | 'down') => {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === sortRules.length - 1)
		) {
			return
		}

		const newRules = [...sortRules]
		const targetIndex = direction === 'up' ? index - 1 : index + 1
		;[newRules[index], newRules[targetIndex]] = [
			newRules[targetIndex],
			newRules[index],
		]
		setSortRules(newRules)
	}

	const getAvailableFields = (currentIndex: number): OrderSortField[] => {
		return Object.keys(SORT_FIELD_LABELS).filter(
			(field) =>
				!sortRules.some(
					(rule, idx) => rule.field === field && idx !== currentIndex
				)
		) as OrderSortField[]
	}

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title="Sort Orders">
			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}>
				<Text style={styles.helperText}>
					Set sort priority by dragging rules up or down. First rule has highest
					priority.
				</Text>

				{sortRules.map((rule, index) => {
					const availableFields = getAvailableFields(index)

					return (
						<View
							key={index}
							style={styles.sortRuleCard}>
							<View style={styles.sortRuleHeader}>
								<Text style={styles.sortRulePriority}>
									{index + 1}
									{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Priority
								</Text>
								<View style={styles.sortRuleMoveButtons}>
									<TouchableOpacity
										style={[
											styles.sortRuleMoveButton,
											index === 0 && styles.sortRuleMoveButtonDisabled,
										]}
										onPress={() => moveSortRule(index, 'up')}
										disabled={index === 0}>
										<MaterialCommunityIcons
											name="chevron-up"
											size={20}
											color={index === 0 ? colors.border : colors.primary}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.sortRuleMoveButton,
											index === sortRules.length - 1 &&
												styles.sortRuleMoveButtonDisabled,
										]}
										onPress={() => moveSortRule(index, 'down')}
										disabled={index === sortRules.length - 1}>
										<MaterialCommunityIcons
											name="chevron-down"
											size={20}
											color={
												index === sortRules.length - 1
													? colors.border
													: colors.primary
											}
										/>
									</TouchableOpacity>
									{sortRules.length > 1 && (
										<TouchableOpacity
											style={styles.sortRuleRemoveButton}
											onPress={() => removeSortRule(index)}>
											<MaterialCommunityIcons
												name="close"
												size={20}
												color={colors.error}
											/>
										</TouchableOpacity>
									)}
								</View>
							</View>

							<View style={styles.sortRuleBody}>
								<Text style={styles.sortRuleLabel}>Sort by</Text>
								<ScrollView
									horizontal
									style={styles.sortFieldOptions}
									showsHorizontalScrollIndicator={false}>
									{availableFields.map((field) => (
										<TouchableOpacity
											key={field}
											style={[
												styles.sortFieldOption,
												rule.field === field && styles.sortFieldOptionSelected,
											]}
											onPress={() =>
												updateSortRule(index, field, rule.direction)
											}>
											<Text
												style={[
													styles.sortFieldOptionText,
													rule.field === field &&
														styles.sortFieldOptionTextSelected,
												]}>
												{SORT_FIELD_LABELS[field]}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>

								<View style={styles.sortDirectionContainer}>
									<TouchableOpacity
										style={[
											styles.sortDirectionButton,
											rule.direction === 'asc' &&
												styles.sortDirectionButtonSelected,
										]}
										onPress={() =>
											updateSortRule(index, rule.field, 'asc')
										}>
										<MaterialCommunityIcons
											name="sort-ascending"
											size={20}
											color={
												rule.direction === 'asc'
													? colors.surface
													: colors.textSecondary
											}
										/>
										<Text
											style={[
												styles.sortDirectionButtonText,
												rule.direction === 'asc' &&
													styles.sortDirectionButtonTextSelected,
											]}>
											Ascending
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											styles.sortDirectionButton,
											rule.direction === 'desc' &&
												styles.sortDirectionButtonSelected,
										]}
										onPress={() =>
											updateSortRule(index, rule.field, 'desc')
										}>
										<MaterialCommunityIcons
											name="sort-descending"
											size={20}
											color={
												rule.direction === 'desc'
													? colors.surface
													: colors.textSecondary
											}
										/>
										<Text
											style={[
												styles.sortDirectionButtonText,
												rule.direction === 'desc' &&
													styles.sortDirectionButtonTextSelected,
											]}>
											Descending
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					)
				})}

				{sortRules.length < Object.keys(SORT_FIELD_LABELS).length && (
					<TouchableOpacity
						style={styles.addSortRuleButton}
						onPress={addSortRule}>
						<MaterialCommunityIcons
							name="plus-circle"
							size={24}
							color={colors.primary}
						/>
						<Text style={styles.addSortRuleButtonText}>Add Sort Rule</Text>
					</TouchableOpacity>
				)}

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
