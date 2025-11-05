import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createOrderFilterModalStyles } from '../../../styles/customer'
import type { OrderFilters } from '../../../types'

interface OrderFilterModalProps {
	visible: boolean
	onClose: () => void
	onApply: (filters: OrderFilters) => void
	currentFilters: OrderFilters
	availableStatuses: string[]
}

const OrderFilterModal: React.FC<OrderFilterModalProps> = ({
	visible,
	onClose,
	onApply,
	currentFilters,
	availableStatuses,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createOrderFilterModalStyles(colors, responsive)

	const [filters, setFilters] = useState<OrderFilters>(currentFilters)

	useEffect(() => {
		if (visible) {
			setFilters(currentFilters)
		}
	}, [visible, currentFilters])

	const handleApply = () => {
		onApply(filters)
		onClose()
	}

	const handleReset = () => {
		const resetFilters: OrderFilters = {
			searchQuery: '',
			searchField: 'concessionName',
			statusFilters: [],
			orderModeFilters: [],
			dateFrom: null,
			dateTo: null,
		}
		setFilters(resetFilters)
	}

	const handleStatusToggle = (status: string) => {
		const currentStatuses = filters.statusFilters

		if (status === 'all') {
			// If "All Statuses" is pressed, clear all selections
			setFilters({ ...filters, statusFilters: [] })
		} else {
			// Check if status is already selected
			const isSelected = currentStatuses.includes(status)

			if (isSelected) {
				// Deselect the status
				const newStatuses = currentStatuses.filter((s) => s !== status)
				setFilters({ ...filters, statusFilters: newStatuses })
			} else {
				// Add the status
				const newStatuses = [...currentStatuses, status]

				// Check if all available statuses are now selected
				if (newStatuses.length === availableStatuses.length) {
					// All statuses selected = All Statuses behavior, so clear all
					setFilters({ ...filters, statusFilters: [] })
				} else {
					setFilters({ ...filters, statusFilters: newStatuses })
				}
			}
		}
	}

	const handleModeToggle = (mode: 'now' | 'scheduled') => {
		const currentModes = filters.orderModeFilters

		if (mode === ('all' as any)) {
			// If "All Modes" is pressed, clear all selections
			setFilters({ ...filters, orderModeFilters: [] })
		} else {
			// Check if mode is already selected
			const isSelected = currentModes.includes(mode)

			if (isSelected) {
				// Deselect the mode
				const newModes = currentModes.filter((m) => m !== mode)
				setFilters({ ...filters, orderModeFilters: newModes })
			} else {
				// Add the mode
				const newModes = [...currentModes, mode]

				// Check if all modes are now selected (both 'now' and 'scheduled')
				if (newModes.length === 2) {
					// All modes selected = All Modes behavior, so clear all
					setFilters({ ...filters, orderModeFilters: [] })
				} else {
					setFilters({ ...filters, orderModeFilters: newModes })
				}
			}
		}
	}

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title="Filter Orders">
			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}>
				{/* Search Field */}
				<View style={styles.filterSection}>
					<Text style={styles.filterSectionTitle}>Search In</Text>
					<View style={styles.filterOptions}>
						{[
							{ value: 'concessionName', label: 'Concession Name' },
							{ value: 'status', label: 'Status' },
						].map((option) => (
							<TouchableOpacity
								key={option.value}
								style={[
									styles.filterOption,
									filters.searchField === option.value &&
										styles.filterOptionSelected,
								]}
								onPress={() =>
									setFilters({
										...filters,
										searchField: option.value as any,
									})
								}>
								<Text
									style={[
										styles.filterOptionText,
										filters.searchField === option.value &&
											styles.filterOptionTextSelected,
									]}>
									{option.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Status Filter */}
				<View style={styles.filterSection}>
					<Text style={styles.filterSectionTitle}>Order Status</Text>
					<View style={styles.filterOptions}>
						<TouchableOpacity
							style={[
								styles.filterOption,
								filters.statusFilters.length === 0 &&
									styles.filterOptionSelected,
							]}
							onPress={() => handleStatusToggle('all')}>
							<Text
								style={[
									styles.filterOptionText,
									filters.statusFilters.length === 0 &&
										styles.filterOptionTextSelected,
								]}>
								All Statuses
							</Text>
						</TouchableOpacity>
						{availableStatuses.map((status) => (
							<TouchableOpacity
								key={status}
								style={[
									styles.filterOption,
									filters.statusFilters.includes(status) &&
										styles.filterOptionSelected,
								]}
								onPress={() => handleStatusToggle(status)}>
								<Text
									style={[
										styles.filterOptionText,
										filters.statusFilters.includes(status) &&
											styles.filterOptionTextSelected,
									]}>
									{status}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{/* Order Mode Filter */}
				<View style={styles.filterSection}>
					<Text style={styles.filterSectionTitle}>Order Mode</Text>
					<View style={styles.filterOptions}>
						<TouchableOpacity
							style={[
								styles.filterOption,
								filters.orderModeFilters.length === 0 &&
									styles.filterOptionSelected,
							]}
							onPress={() => handleModeToggle('all' as any)}>
							<Text
								style={[
									styles.filterOptionText,
									filters.orderModeFilters.length === 0 &&
										styles.filterOptionTextSelected,
								]}>
								All Modes
							</Text>
						</TouchableOpacity>
						{[
							{ value: 'now' as const, label: 'Order Now' },
							{ value: 'scheduled' as const, label: 'Scheduled' },
						].map((option) => (
							<TouchableOpacity
								key={option.value}
								style={[
									styles.filterOption,
									filters.orderModeFilters.includes(option.value) &&
										styles.filterOptionSelected,
								]}
								onPress={() => handleModeToggle(option.value)}>
								<Text
									style={[
										styles.filterOptionText,
										filters.orderModeFilters.includes(option.value) &&
											styles.filterOptionTextSelected,
									]}>
									{option.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

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
						<Text style={styles.applyButtonText}>Apply Filters</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</BaseModal>
	)
}

export default OrderFilterModal
