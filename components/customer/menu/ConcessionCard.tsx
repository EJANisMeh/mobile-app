import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerMenuStyles } from '../../../styles/customer'
import MenuItemCard from './MenuItemCard'
import type { ConcessionWithMenuItems } from '../../../types'

interface ConcessionCardProps {
	concession: ConcessionWithMenuItems
}

const ConcessionCard: React.FC<ConcessionCardProps> = ({ concession }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuStyles(colors, responsive)

	const handleViewAll = () => {
		// TODO: Navigate to full menu list for this concession
		console.log('View all items for concession:', concession.id)
	}

	return (
		<View style={styles.concessionCard}>
			<View style={styles.concessionHeader}>
				{concession.image_url && (
					<Image
						source={{ uri: concession.image_url }}
						style={styles.concessionImage}
					/>
				)}
				<View style={styles.concessionInfo}>
					<Text style={styles.concessionName}>{concession.name}</Text>
					<Text
						style={
							concession.is_open
								? styles.concessionStatus
								: styles.concessionClosedStatus
						}>
						{concession.is_open ? 'Open' : 'Closed'}
					</Text>
				</View>
			</View>

			{/* Show menu items if open, otherwise show closed message */}
			{concession.is_open ? (
				concession.menuItems.length > 0 ? (
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={true}
						contentContainerStyle={styles.menuItemsContainer}>
						{concession.menuItems.map((item) => (
							<MenuItemCard
								key={item.id}
								item={item}
							/>
						))}

						<TouchableOpacity
							style={styles.viewAllButton}
							onPress={handleViewAll}>
							<Text style={styles.viewAllText}>View All</Text>
						</TouchableOpacity>
					</ScrollView>
				) : (
					<View style={styles.closedMessage}>
						<Text style={styles.closedMessageText}>
							No available menu items at the moment
						</Text>
					</View>
				)
			) : (
				<View style={styles.closedMessage}>
					<Text style={styles.closedMessageText}>
						This concession is currently closed
					</Text>
				</View>
			)}
		</View>
	)
}

export default ConcessionCard
