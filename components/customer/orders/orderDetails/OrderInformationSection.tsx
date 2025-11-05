import React from 'react'
import { View, Text } from 'react-native'

interface OrderInformationSectionProps {
	concessionName: string
	orderMode: string
	orderItems: any[]
	total: number | string
	scheduledFor: Date | null
	createdAt: Date
	updatedAt: Date
	formatCurrency: (value: number | string | undefined) => string
	formatDate: (date: Date) => string
	styles: any
}

const OrderInformationSection: React.FC<OrderInformationSectionProps> = ({
	concessionName,
	orderMode,
	orderItems,
	total,
	scheduledFor,
	createdAt,
	updatedAt,
	formatCurrency,
	formatDate,
	styles,
}) => {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Order Information</Text>
			<View style={styles.infoRow}>
				<Text style={styles.infoLabel}>Concession:</Text>
				<Text style={styles.infoValue}>{concessionName}</Text>
			</View>
			<View style={styles.infoRow}>
				<Text style={styles.infoLabel}>Order Type:</Text>
				<Text style={styles.infoValue}>
					{orderMode === 'now' ? 'Order Now' : 'Scheduled'}
				</Text>
			</View>
			<View style={styles.infoRow}>
				<Text style={styles.infoLabel}>Number of Items:</Text>
				<Text style={styles.infoValue}>{orderItems.length}</Text>
			</View>

			{/* Item List */}
			<View style={styles.itemListContainer}>
				<Text style={styles.itemListTitle}>Items:</Text>
				{orderItems.map((item: any, index: number) => (
					<View
						key={item.id}
						style={styles.itemRow}>
						<Text style={styles.itemNumber}>{index + 1}.</Text>
						<View style={styles.itemDetails}>
							<Text style={styles.itemName}>{item.menuItem.name}</Text>
							<View style={styles.itemMeta}>
								<Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
								<Text style={styles.itemPrice}>
									{formatCurrency(Number(item.unitPrice))} each
								</Text>
								<Text style={styles.itemTotal}>
									{formatCurrency(Number(item.item_total))}
								</Text>
							</View>
						</View>
					</View>
				))}
			</View>

			<View style={[styles.infoRow, styles.totalRow]}>
				<Text style={styles.infoLabel}>Total Price:</Text>
				<Text style={[styles.infoValue, styles.totalValue]}>
					{formatCurrency(total)}
				</Text>
			</View>
			{orderMode === 'scheduled' && scheduledFor && (
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Scheduled For:</Text>
					<Text style={styles.infoValue}>
						{formatDate(new Date(scheduledFor))}
					</Text>
				</View>
			)}
			<View style={styles.infoRow}>
				<Text style={styles.infoLabel}>Placed On:</Text>
				<Text style={styles.infoValue}>{formatDate(new Date(createdAt))}</Text>
			</View>
			<View style={styles.infoRow}>
				<Text style={styles.infoLabel}>Last Updated:</Text>
				<Text style={styles.infoValue}>{formatDate(new Date(updatedAt))}</Text>
			</View>
		</View>
	)
}

export default OrderInformationSection
