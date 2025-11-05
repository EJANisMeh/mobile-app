import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createOrderFilterModalStyles } from '../../../styles/customer'
import { customerApi } from '../../../services/api'
import type { OrderFilters, CafeteriasWithMenuResponse } from '../../../types'

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
	const [cafeterias, setCafeterias] = useState<
		CafeteriasWithMenuResponse['cafeterias']
	>([])
	const [loadingCafeterias, setLoadingCafeterias] = useState(false)

	// Load cafeterias for dropdown
	useEffect(() => {
		if (visible) {
			loadCafeterias()
		}
	}, [visible])

	const loadCafeterias = async () => {
		setLoadingCafeterias(true)
		try {
			const response = await customerApi.getCafeteriasWithMenu()
			setCafeterias(response.cafeterias || [])
		} catch (error) {
			console.error('Error loading cafeterias:', error)
			setCafeterias([])
		} finally {
			setLoadingCafeterias(false)
		}
	}

	// Get concessions filtered by selected cafeteria
	const getAvailableConcessions = () => {
		if (filters.cafeteriaFilter === null) {
			// Show all concessions from all cafeterias
			return cafeterias.flatMap((cafeteria) =>
				cafeteria.concessions.map((concession) => ({
					id: concession.id,
					name: concession.name,
					cafeteriaName: cafeteria.name,
				}))
			)
		} else {
			// Show only concessions from selected cafeteria
			const selectedCafeteria = cafeterias.find(
				(c) => c.id === filters.cafeteriaFilter
			)
			if (!selectedCafeteria) return []

			return selectedCafeteria.concessions.map((concession) => ({
				id: concession.id,
				name: concession.name,
				cafeteriaName: selectedCafeteria.name,
			}))
		}
	}

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
			cafeteriaFilter: null,
			concessionFilters: [],
			statusFilters: [],
			orderModeFilters: [],
			paymentProofFilter: 'all',
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

	const handleConcessionToggle = (concessionId: number) => {
		const currentConcessions = filters.concessionFilters
		const isSelected = currentConcessions.includes(concessionId)

		if (isSelected) {
			// Deselect the concession
			const newConcessions = currentConcessions.filter(
				(id) => id !== concessionId
			)
			setFilters({ ...filters, concessionFilters: newConcessions })
		} else {
			// Add the concession
			setFilters({
				...filters,
				concessionFilters: [...currentConcessions, concessionId],
			})
		}
	}

	const handleCafeteriaChange = (cafeteriaId: number | null) => {
		// When cafeteria changes, reset concession filters
		setFilters({
			...filters,
			cafeteriaFilter: cafeteriaId,
			concessionFilters: [],
		})
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
				{/* Cafeteria Filter */}
				<View style={styles.filterSection}>
					<Text style={styles.filterSectionTitle}>Cafeteria</Text>
					<View style={styles.pickerContainer}>
						<Picker
							selectedValue={filters.cafeteriaFilter}
							onValueChange={handleCafeteriaChange}
							style={styles.picker}
							dropdownIconColor={colors.text}>
							<Picker.Item
								label="All Cafeterias"
								value={null}
							/>
							{cafeterias.map((cafeteria) => (
								<Picker.Item
									key={cafeteria.id}
									label={cafeteria.name}
									value={cafeteria.id}
								/>
							))}
						</Picker>
					</View>
				</View>

				{/* Concession Filter */}
				<View style={styles.filterSection}>
					<Text style={styles.filterSectionTitle}>Concessions</Text>
					<View style={styles.filterOptions}>
						<TouchableOpacity
							style={[
								styles.filterOption,
								filters.concessionFilters.length === 0 &&
									styles.filterOptionSelected,
							]}
							onPress={() => setFilters({ ...filters, concessionFilters: [] })}>
							<Text
								style={[
									styles.filterOptionText,
									filters.concessionFilters.length === 0 &&
										styles.filterOptionTextSelected,
								]}>
								All Concessions
							</Text>
						</TouchableOpacity>
						{getAvailableConcessions().map((concession) => (
							<TouchableOpacity
								key={concession.id}
								style={[
									styles.filterOption,
									filters.concessionFilters.includes(concession.id) &&
										styles.filterOptionSelected,
								]}
								onPress={() => handleConcessionToggle(concession.id)}>
								<Text
									style={[
										styles.filterOptionText,
										filters.concessionFilters.includes(concession.id) &&
											styles.filterOptionTextSelected,
									]}>
									{concession.name}
									{filters.cafeteriaFilter === null &&
										` (${concession.cafeteriaName})`}
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

				{/* Payment Proof Filter */}
				<View style={styles.filterSection}>
					<Text style={styles.filterSectionTitle}>Payment Proof</Text>
					<View style={styles.filterOptions}>
						{[
							{ value: 'all' as const, label: 'All Orders' },
							{ value: 'provided' as const, label: 'Proof Submitted' },
							{ value: 'missing' as const, label: 'Proof Missing' },
						].map((option) => (
							<TouchableOpacity
								key={option.value}
								style={[
									styles.filterOption,
									filters.paymentProofFilter === option.value &&
										styles.filterOptionSelected,
								]}
								onPress={() =>
									setFilters({
										...filters,
										paymentProofFilter: option.value,
									})
								}>
								<Text
									style={[
										styles.filterOptionText,
										filters.paymentProofFilter === option.value &&
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
