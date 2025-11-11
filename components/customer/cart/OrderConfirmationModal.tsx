import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import BaseModal from '../../modals/BaseModal'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createOrderConfirmationModalStyles } from '../../../styles/customer'
import type { PaymentProof, VariationGroupSnapshot } from '../../../types'

interface OrderItem {
	name: string
	quantity: number
	unitPrice: number
	totalPrice: number
	variationGroups?: VariationGroupSnapshot[]
	addons?: Array<{ addonName: string; price: number }>
	customer_request?: string | null
}

interface OrderConfirmationModalProps {
	visible: boolean
	onClose: () => void
	onConfirm: () => void
	orderSummary: {
		items?: OrderItem[] // For cart orders with multiple items
		itemName?: string // For single item orders (legacy support)
		quantity?: number // For single item orders (legacy support)
		total: number
		orderMode: 'now' | 'scheduled'
		scheduledFor: Date | null
		paymentMethod: string
		paymentDetails: string
		paymentProof: PaymentProof | null
		concessionName: string
	}
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
	visible,
	onClose,
	onConfirm,
	orderSummary,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createOrderConfirmationModalStyles(colors, responsive)
	const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

	const formatCurrency = (value: number) => `₱${value.toFixed(2)}`

	const toggleItemExpanded = (index: number) => {
		setExpandedItems((prev) => {
			const newSet = new Set(prev)
			if (newSet.has(index)) {
				newSet.delete(index)
			} else {
				newSet.add(index)
			}
			return newSet
		})
	}

	const formatScheduledDateTime = (date: Date): string => {
		const dateStr = date.toLocaleDateString(undefined, {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})

		const hours = date.getHours()
		const minutes = date.getMinutes()
		const period = hours >= 12 ? 'PM' : 'AM'
		const twelveHour = hours % 12 === 0 ? 12 : hours % 12
		const timeStr = `${twelveHour}:${minutes
			.toString()
			.padStart(2, '0')} ${period}`

		return `${dateStr} at ${timeStr}`
	}

	return (
		<BaseModal
			visible={visible}
			onClose={onClose}
			title="Confirm Your Order">
			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={true}>
				<Text style={styles.helperText}>
					Please review your order details before confirming.
				</Text>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Order Details</Text>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Concession:</Text>
						<Text style={styles.detailValue}>
							{orderSummary.concessionName}
						</Text>
					</View>

					{/* Items List */}
					{orderSummary.items && orderSummary.items.length > 0 ? (
						<View style={{ marginTop: 12 }}>
							<Text style={styles.detailLabel}>
								Items ({orderSummary.items.length}):
							</Text>
							{orderSummary.items.map((item, index) => {
								const isExpanded = expandedItems.has(index)
								const hasDetails =
									(item.variationGroups && item.variationGroups.length > 0) ||
									(item.addons && item.addons.length > 0) ||
									item.customer_request

								return (
									<View
										key={index}
										style={{
											marginTop: 8,
											padding: 12,
											backgroundColor: colors.surface,
											borderRadius: 8,
											borderWidth: 1,
											borderColor: colors.border,
										}}>
										{/* Item Header */}
										<TouchableOpacity
											onPress={() => hasDetails && toggleItemExpanded(index)}
											disabled={!hasDetails}
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}>
											<View style={{ flex: 1 }}>
												<Text
													style={{
														fontSize: 14,
														fontWeight: '600',
														color: colors.text,
													}}>
													{item.quantity}x {item.name}
												</Text>
												<Text
													style={{
														fontSize: 13,
														color: colors.textSecondary,
														marginTop: 2,
													}}>
													{formatCurrency(item.totalPrice)}
												</Text>
											</View>
											{hasDetails && (
												<Ionicons
													name={isExpanded ? 'chevron-up' : 'chevron-down'}
													size={20}
													color={colors.primary}
												/>
											)}
										</TouchableOpacity>

										{/* Expanded Details */}
										{isExpanded && hasDetails && (
											<View
												style={{
													marginTop: 12,
													paddingTop: 12,
													borderTopWidth: 1,
													borderTopColor: colors.border,
												}}>
												{/* Variations */}
												{item.variationGroups &&
													item.variationGroups.length > 0 && (
														<View style={{ marginBottom: 8 }}>
															{item.variationGroups.map((group, gIdx) => (
																<View
																	key={gIdx}
																	style={{ marginBottom: 8 }}>
																	<Text
																		style={{
																			fontSize: 13,
																			fontWeight: '600',
																			color: colors.text,
																			marginBottom: 4,
																		}}>
																		{group.groupName}:
																	</Text>
																	{group.selectedOptions.map((option, oIdx) => (
																		<View
																			key={oIdx}
																			style={{ marginLeft: 12 }}>
																			<Text
																				style={{
																					fontSize: 12,
																					color: colors.textSecondary,
																				}}>
																				• {option.optionName}
																				{option.priceAdjustment !== 0 &&
																					` (+${formatCurrency(
																						option.priceAdjustment
																					)})`}
																			</Text>
																			{/* Subvariations */}
																			{option.subVariationGroups &&
																				option.subVariationGroups.length >
																					0 && (
																					<View
																						style={{
																							marginLeft: 16,
																							marginTop: 4,
																						}}>
																						{option.subVariationGroups.map(
																							(subGroup, sIdx) => (
																								<View
																									key={sIdx}
																									style={{ marginBottom: 4 }}>
																									<Text
																										style={{
																											fontSize: 11,
																											fontWeight: '500',
																											color: '#666',
																										}}>
																										{subGroup.groupName}:
																									</Text>
																									{subGroup.selectedOptions.map(
																										(subOpt, soIdx) => (
																											<Text
																												key={soIdx}
																												style={{
																													fontSize: 11,
																													color: '#888',
																													marginLeft: 8,
																												}}>
																												• {subOpt.optionName}
																												{subOpt.priceAdjustment !==
																													0 &&
																													` (+${formatCurrency(
																														subOpt.priceAdjustment
																													)})`}
																											</Text>
																										)
																									)}
																								</View>
																							)
																						)}
																					</View>
																				)}
																		</View>
																	))}
																</View>
															))}
														</View>
													)}

												{/* Addons */}
												{item.addons && item.addons.length > 0 && (
													<View style={{ marginBottom: 8 }}>
														<Text
															style={{
																fontSize: 13,
																fontWeight: '600',
																color: colors.text,
																marginBottom: 4,
															}}>
															Add-ons:
														</Text>
														{item.addons.map((addon, aIdx) => (
															<Text
																key={aIdx}
																style={{
																	fontSize: 12,
																	color: colors.textSecondary,
																	marginLeft: 12,
																}}>
																+ {addon.addonName} (+
																{formatCurrency(addon.price)})
															</Text>
														))}
													</View>
												)}

												{/* Customer Request */}
												{item.customer_request && (
													<View>
														<Text
															style={{
																fontSize: 13,
																fontWeight: '600',
																color: colors.text,
																marginBottom: 4,
															}}>
															Note:
														</Text>
														<Text
															style={{
																fontSize: 12,
																color: colors.textSecondary,
																fontStyle: 'italic',
																marginLeft: 12,
															}}>
															"{item.customer_request}"
														</Text>
													</View>
												)}
											</View>
										)}
									</View>
								)
							})}
						</View>
					) : (
						/* Legacy single item display */
						<>
							<View style={styles.detailRow}>
								<Text style={styles.detailLabel}>Item:</Text>
								<Text style={styles.detailValue}>{orderSummary.itemName}</Text>
							</View>
							<View style={styles.detailRow}>
								<Text style={styles.detailLabel}>Quantity:</Text>
								<Text style={styles.detailValue}>{orderSummary.quantity}</Text>
							</View>
						</>
					)}

					<View
						style={[
							styles.detailRow,
							{
								marginTop: 12,
								paddingTop: 12,
								borderTopWidth: 1,
								borderTopColor: colors.border,
							},
						]}>
						<Text style={styles.detailLabel}>Total:</Text>
						<Text style={[styles.detailValue, styles.totalValue]}>
							{formatCurrency(orderSummary.total)}
						</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Order Timing</Text>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Mode:</Text>
						<Text style={styles.detailValue}>
							{orderSummary.orderMode === 'now' ? 'Order Now' : 'Scheduled'}
						</Text>
					</View>
					{orderSummary.orderMode === 'scheduled' &&
						orderSummary.scheduledFor && (
							<View style={styles.detailRow}>
								<Text style={styles.detailLabel}>Scheduled for:</Text>
								<Text style={styles.detailValue}>
									{formatScheduledDateTime(orderSummary.scheduledFor)}
								</Text>
							</View>
						)}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment</Text>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>Method:</Text>
						<Text style={styles.detailValue}>{orderSummary.paymentMethod}</Text>
					</View>
					{orderSummary.paymentDetails && (
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Details:</Text>
							<Text style={styles.detailValue}>
								{orderSummary.paymentDetails}
							</Text>
						</View>
					)}
					{orderSummary.paymentProof && (
						<View style={styles.detailRow}>
							<Text style={styles.detailLabel}>Proof:</Text>
							<Text style={styles.detailValue}>
								{orderSummary.paymentProof.mode === 'text'
									? 'Transaction ID provided'
									: 'Screenshot attached'}
							</Text>
						</View>
					)}
				</View>

				<View style={styles.actionsRow}>
					<TouchableOpacity
						style={[styles.actionButton, styles.cancelButton]}
						onPress={onClose}>
						<Text style={styles.actionButtonText}>Go Back</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.actionButton,
							styles.confirmButton,
							styles.actionButtonSpacing,
						]}
						onPress={onConfirm}>
						<Text style={[styles.actionButtonText, styles.confirmButtonText]}>
							Place Order
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</BaseModal>
	)
}

export default OrderConfirmationModal
