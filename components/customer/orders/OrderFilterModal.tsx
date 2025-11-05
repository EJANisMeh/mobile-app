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
			searchField: 'all',
			statusFilter: null,
			orderModeFilter: null,
			dateFrom: null,
			dateTo: null,
		}
		setFilters(resetFilters)
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
							{ value: 'all', label: 'All Fields' },
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
								filters.statusFilter === null && styles.filterOptionSelected,
							]}
							onPress={() =>
								setFilters({
									...filters,
									statusFilter: null,
								})
							}>
							<Text
								style={[
									styles.filterOptionText,
									filters.statusFilter === null &&
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
									filters.statusFilter === status &&
										styles.filterOptionSelected,
								]}
								onPress={() =>
									setFilters({
										...filters,
										statusFilter: status,
									})
								}>
								<Text
									style={[
										styles.filterOptionText,
										filters.statusFilter === status &&
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
						{[
							{ value: null, label: 'All Modes' },
							{ value: 'now', label: 'Order Now' },
							{ value: 'scheduled', label: 'Scheduled' },
						].map((option) => (
							<TouchableOpacity
								key={option.label}
								style={[
									styles.filterOption,
									filters.orderModeFilter === option.value &&
										styles.filterOptionSelected,
								]}
								onPress={() =>
									setFilters({
										...filters,
										orderModeFilter: option.value as any,
									})
								}>
								<Text
									style={[
										styles.filterOptionText,
										filters.orderModeFilter === option.value &&
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
