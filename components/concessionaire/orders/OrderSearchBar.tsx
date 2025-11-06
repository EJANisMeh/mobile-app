import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ThemeColors } from '../../../types'

interface OrderSearchBarProps {
	searchQuery: string
	onSearchChange: (query: string) => void
	onFilterPress: () => void
	onSortPress: () => void
	styles: any
	colors: ThemeColors
}

const OrderSearchBar: React.FC<OrderSearchBarProps> = ({
	searchQuery,
	onSearchChange,
	onFilterPress,
	onSortPress,
	styles,
	colors,
}) => {
	return (
		<View style={styles.searchContainer}>
			<View style={styles.searchInputContainer}>
				<MaterialCommunityIcons
					name="magnify"
					size={20}
					color={colors.textSecondary}
				/>
				<TextInput
					style={styles.searchInput}
					placeholder="Search by order # or customer email..."
					placeholderTextColor={colors.textSecondary}
					value={searchQuery}
					onChangeText={onSearchChange}
				/>
				{searchQuery.length > 0 && (
					<TouchableOpacity onPress={() => onSearchChange('')}>
						<MaterialCommunityIcons
							name="close-circle"
							size={20}
							color={colors.textSecondary}
						/>
					</TouchableOpacity>
				)}
			</View>
			<View style={styles.actionButtons}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={onFilterPress}>
					<MaterialCommunityIcons
						name="filter-variant"
						size={20}
						color={colors.primary}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={onSortPress}>
					<MaterialCommunityIcons
						name="sort"
						size={20}
						color={colors.primary}
					/>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default OrderSearchBar
