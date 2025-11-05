import React from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ViewStyle, TextStyle } from 'react-native'

interface OrderSearchBarProps {
	searchQuery: string
	onSearchChange: (query: string) => void
	onFilterPress: () => void
	onSortPress: () => void
	styles: {
		searchContainer: ViewStyle
		searchInputContainer: ViewStyle
		searchInput: TextStyle
		searchIconButton: ViewStyle
	}
	colors: {
		text: string
		textSecondary: string
		primary: string
	}
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
					placeholder="Search by order number..."
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

			<TouchableOpacity
				style={styles.searchIconButton}
				onPress={onFilterPress}>
				<MaterialCommunityIcons
					name="filter-variant"
					size={24}
					color={colors.primary}
				/>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.searchIconButton}
				onPress={onSortPress}>
				<MaterialCommunityIcons
					name="sort"
					size={24}
					color={colors.primary}
				/>
			</TouchableOpacity>
		</View>
	)
}

export default OrderSearchBar
