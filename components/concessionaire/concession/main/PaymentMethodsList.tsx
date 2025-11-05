import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext, useConcessionContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionStyles } from '../../../../styles/concessionaire'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useConcessionaireNavigation } from '../../../../hooks/useNavigation'
import { PaymentMethodTuple } from '../../../../types'

const PaymentMethodsList: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionStyles = createConcessionStyles(colors, responsive)
	const { concession } = useConcessionContext()
	const navigation = useConcessionaireNavigation()

	const handleManagePaymentMethodsNav = () => {
		navigation.navigate('ManagePaymentMethods' as never)
	}

	// Parse payment methods from tuple format [["type", "details", needsProof, proofMode], ...]
	const paymentMethods =
		(concession?.payment_methods as PaymentMethodTuple[]) || []

	const getProofModeIcon = (proofMode: 'text' | 'screenshot' | null) => {
		if (proofMode === 'text') return 'text-box-outline'
		if (proofMode === 'screenshot') return 'camera-outline'
		return null
	}

	const getProofModeLabel = (proofMode: 'text' | 'screenshot' | null) => {
		if (proofMode === 'text') return 'Text'
		if (proofMode === 'screenshot') return 'Screenshot'
		return null
	}

	return (
		<View style={concessionStyles.paymentMethodsList}>
			{paymentMethods.map(
				([type, details, needsProof, proofMode], index: number) => {
					const isCash = type.toLowerCase() === 'cash' && index === 0

					return (
						<View
							key={index}
							style={concessionStyles.paymentMethodItem}>
							<View style={concessionStyles.paymentMethodMainContent}>
								{/* Type and Details Row */}
								<View style={concessionStyles.paymentMethodTypeRow}>
									<Text style={concessionStyles.paymentMethodType}>
										{type}
										{isCash && (
											<View style={concessionStyles.inlineBadge}>
												<Text style={concessionStyles.inlineBadgeText}>
													{' '}
													DEFAULT
												</Text>
											</View>
										)}
									</Text>
								</View>

								<Text style={concessionStyles.paymentMethodDetails}>
									{details}
								</Text>

								{/* Proof of Payment Info */}
								{needsProof && proofMode && (
									<View style={concessionStyles.proofInfoRow}>
										<MaterialCommunityIcons
											name="file-document-check"
											size={16}
											color={colors.primary}
										/>
										<Text style={concessionStyles.proofInfoText}>
											Needs proof:{' '}
										</Text>
										<MaterialCommunityIcons
											name={getProofModeIcon(proofMode) || 'help-circle'}
											size={16}
											color={colors.textSecondary}
										/>
										<Text style={concessionStyles.proofModeText}>
											{getProofModeLabel(proofMode)}
										</Text>
									</View>
								)}
							</View>
						</View>
					)
				}
			)}

			<TouchableOpacity
				style={concessionStyles.addPaymentButton}
				onPress={handleManagePaymentMethodsNav}>
				<MaterialCommunityIcons
					name="plus-circle"
					size={20}
					color={colors.primary}
				/>
				<Text style={concessionStyles.addPaymentButtonText}>
					Manage Payment Methods
				</Text>
			</TouchableOpacity>
		</View>
	)
}

export default PaymentMethodsList
