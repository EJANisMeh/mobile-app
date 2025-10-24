import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemeContext, useConcessionContext } from '../../../../context';
import { useResponsiveDimensions } from '../../../../hooks';
import { createConcessionStyles } from '../../../../styles/concessionaire';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useConcessionaireNavigation } from '../../../../hooks/useNavigation';

const PaymentMethodsList: React.FC = () =>
{
  const { colors } = useThemeContext();
  const responsive = useResponsiveDimensions();
  const concessionStyles = createConcessionStyles(colors, responsive);
  const { concession } = useConcessionContext();
  const navigation = useConcessionaireNavigation();

  
	const handleManagePaymentMethodsNav = () => {
		navigation.navigate('ManagePaymentMethods' as never)
	}

  return (
		<View style={concessionStyles.paymentMethodsList}>
			{concession?.payment_methods?.map((method: string, index: number) => (
				<View
					key={index}
					style={[
						concessionStyles.paymentMethodItem,
						method === 'cash' && concessionStyles.paymentMethodDefault,
					]}>
					<View style={concessionStyles.paymentMethodContent}>
						<MaterialCommunityIcons
							name={
								method === 'cash'
									? 'cash'
									: method === 'gcash'
									? 'cellphone'
									: 'credit-card'
							}
							size={22}
							color={method === 'cash' ? colors.primary : colors.text}
							style={concessionStyles.paymentMethodIcon}
						/>
						<Text
							style={[
								concessionStyles.paymentMethodText,
								method === 'cash' && concessionStyles.paymentMethodDefaultText,
							]}>
							{method}
						</Text>
					</View>
					{method === 'cash' && (
						<View style={concessionStyles.defaultBadge}>
							<Text style={concessionStyles.defaultBadgeText}>DEFAULT</Text>
						</View>
					)}
				</View>
			))}

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
 
export default PaymentMethodsList;