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

	// Parse payment methods from tuple format [["type", "details"], ...]
	const paymentMethods =
		(concession?.payment_methods as PaymentMethodTuple[]) || []

	return (
		<View style={concessionStyles.paymentMethodsList}>
			{paymentMethods.map(([type, details], index: number) => {
				const isCash = type.toLowerCase() === 'cash'

				return (
					<View
						key={index}
						style={[
							concessionStyles.paymentMethodItem,
						]}>
						<View style={concessionStyles.paymentMethodContent}>
							<Text
								style={[
									concessionStyles.paymentMethodText,
								]}>
								{type}
							</Text>
							{details && (
								<Text
									style={[
										concessionStyles.paymentMethodDetails,
									]}>
									{' '}
									• {details}
								</Text>
							)}
						</View>
					</View>
				)
			})}

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
