import React from 'react'
import { View, Text } from 'react-native'
import type { OrderItem } from '../../../../types'

interface OrderInformationSectionProps {
	orderMode: 'now' | 'scheduled'
	orderItems: OrderItem[]
	total: number
	scheduledFor: Date | null
	createdAt: Date
	updatedAt: Date
	formatCurrency: (value: number) => string
	formatDate: (date: Date) => string
	styles: any
}

const OrderInformationSection: React.FC<OrderInformationSectionProps> = ({
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
	const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0)

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>Order Details</Text>

			{/* Order Type and Items Count */}
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>Order Type:</Text>
				<Text style={styles.detailValue}>
					{orderMode === 'now' ? 'Order Now' : 'Scheduled Order'}
				</Text>
			</View>

			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>Number of Items:</Text>
				<Text style={styles.detailValue}>{totalItems}</Text>
			</View>

			{/* Divider */}
			<View style={styles.divider} />

			{/* Order Items List */}
			<Text style={styles.itemsListTitle}>Items:</Text>
			{orderItems.map((item, index) => (
				<View
					key={item.id}
					style={styles.orderItem}>
					<View style={styles.orderItemHeader}>
						<Text style={styles.orderItemName}>
							{item.quantity}x {item.menuItem.name}
						</Text>
						<Text style={styles.orderItemPrice}>
							{formatCurrency(Number(item.item_total))}
						</Text>
					</View>

					{/* Variation/Options snapshot if present */}
					{item.variation_snapshot &&
						Array.isArray(item.variation_snapshot) &&
						item.variation_snapshot.length > 0 && (
							<View style={styles.orderItemOptions}>
								{item.variation_snapshot.map((group: any, groupIdx: number) => (
									<View key={groupIdx}>
										<Text style={styles.orderItemDetails}>
											{group.groupName}:{' '}
											{group.selectedOptions
												.map((opt: any) => opt.optionName)
												.join(', ')}
											{group.selectedOptions.some(
												(opt: any) => opt.priceAdjustment !== 0
											) &&
												` (+${formatCurrency(
													group.selectedOptions.reduce(
														(sum: number, opt: any) =>
															sum + Number(opt.priceAdjustment || 0),
														0
													)
												)})`}
										</Text>
										{/* Show subvariations if present */}
										{group.selectedOptions.map((option: any, optIdx: number) =>
											option.subVariationGroups &&
											option.subVariationGroups.length > 0 ? (
												<View
													key={optIdx}
													style={{ marginLeft: 16 }}>
													{option.subVariationGroups.map(
														(subGroup: any, subIdx: number) => (
															<Text
																key={subIdx}
																style={[
																	styles.orderItemDetails,
																	{ fontSize: 12, color: '#666' },
																]}>
																• {subGroup.groupName}:{' '}
																{subGroup.selectedOptions
																	.map((subOpt: any) => subOpt.optionName)
																	.join(', ')}
															</Text>
														)
													)}
												</View>
											) : null
										)}
									</View>
								))}
							</View>
						)}

					{/* Options snapshot - legacy support */}
					{item.options_snapshot &&
						Array.isArray(item.options_snapshot) &&
						item.options_snapshot.length > 0 &&
						(!item.variation_snapshot ||
							!Array.isArray(item.variation_snapshot)) && (
							<View style={styles.orderItemOptions}>
								{item.options_snapshot.map((option: any, optIdx: number) => (
									<Text
										key={optIdx}
										style={styles.orderItemDetails}>
										• {option.optionName || option.name}
										{option.priceAdjustment &&
											Number(option.priceAdjustment) !== 0 &&
											` (+${formatCurrency(Number(option.priceAdjustment))})`}
									</Text>
								))}
							</View>
						)}

					{/* Addons snapshot */}
					{item.addons_snapshot &&
						Array.isArray(item.addons_snapshot) &&
						item.addons_snapshot.length > 0 && (
							<View style={styles.orderItemAddons}>
								{item.addons_snapshot.map((addon: any, addonIdx: number) => (
									<Text
										key={addonIdx}
										style={styles.orderItemDetails}>
										+ {addon.addonName || addon.name}
										{(addon.price || addon.price_adjustment) &&
											` (+${formatCurrency(
												Number(addon.price || addon.price_adjustment)
											)})`}
									</Text>
								))}
							</View>
						)}

					{/* Unit Price */}
					<Text style={styles.orderItemUnitPrice}>
						Unit Price: {formatCurrency(Number(item.unitPrice))}
					</Text>

					{/* Customer Request */}
					{item.customer_request && (
						<View style={styles.customerRequestContainer}>
							<Text style={styles.customerRequestLabel}>Customer Request:</Text>
							<Text style={styles.customerRequestText}>
								{item.customer_request}
							</Text>
						</View>
					)}

					{/* Divider between items */}
					{index < orderItems.length - 1 && <View style={styles.itemDivider} />}
				</View>
			))}

			{/* Divider */}
			<View style={styles.divider} />

			{/* Total */}
			<View style={styles.detailRow}>
				<Text style={styles.detailLabelBold}>Total Price:</Text>
				<Text style={styles.detailValueBold}>
					{formatCurrency(Number(total))}
				</Text>
			</View>

			{/* Scheduled Order Date */}
			{scheduledFor && (
				<View style={styles.detailRow}>
					<Text style={styles.detailLabel}>Scheduled For:</Text>
					<Text style={styles.detailValue}>{formatDate(scheduledFor)}</Text>
				</View>
			)}

			{/* Placed Order Date */}
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>Placed On:</Text>
				<Text style={styles.detailValue}>{formatDate(createdAt)}</Text>
			</View>

			{/* Last Updated Date */}
			<View style={styles.detailRow}>
				<Text style={styles.detailLabel}>Last Updated:</Text>
				<Text style={styles.detailValue}>{formatDate(updatedAt)}</Text>
			</View>
		</View>
	)
}

export default OrderInformationSection
