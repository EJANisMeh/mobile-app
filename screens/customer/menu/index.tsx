import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createCustomerMenuStyles } from '../../../styles/customer'
import { DynamicKeyboardView, DynamicScrollView } from '../../../components'
import { useCustomerMenu } from '../../../hooks/useBackend'
import { CafeteriaSection } from '../../../components/customer/menu'
import type { CafeteriaWithConcessions } from '../../../types'

const MenuScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const customerMenuStyles = createCustomerMenuStyles(colors, responsive)
	const { data, loading, error } = useCustomerMenu()

	if (loading) {
		return (
			<View
				style={[
					customerMenuStyles.container,
					{ flex: 1, justifyContent: 'center', alignItems: 'center' },
				]}>
				<ActivityIndicator
					size="large"
					color={colors.primary}
				/>
			</View>
		)
	}

	if (error || !data?.cafeterias) {
		return (
			<DynamicKeyboardView>
				<DynamicScrollView
					styles={customerMenuStyles.container}
					autoCenter="center"
					fallbackAlign="center">
					<View>
						<Text style={customerMenuStyles.containerText}>Error</Text>
						<Text style={customerMenuStyles.containerSubtext}>
							{error || 'Unable to load menu'}
						</Text>
					</View>
				</DynamicScrollView>
			</DynamicKeyboardView>
		)
	}

	if (data.cafeterias.length === 0) {
		return (
			<DynamicKeyboardView>
				<DynamicScrollView
					styles={customerMenuStyles.container}
					autoCenter="center"
					fallbackAlign="center">
					<View>
						<Text style={customerMenuStyles.containerText}>
							No Cafeterias Available
						</Text>
						<Text style={customerMenuStyles.containerSubtext}>
							Check back later for available cafeterias
						</Text>
					</View>
				</DynamicScrollView>
			</DynamicKeyboardView>
		)
	}

	return (
		<DynamicKeyboardView>
			<DynamicScrollView
				styles={customerMenuStyles.container}
				showsVerticalScrollIndicator={true}>
				{data.cafeterias.map((cafeteria: CafeteriaWithConcessions) => (
					<CafeteriaSection
						key={cafeteria.id}
						cafeteria={cafeteria}
					/>
				))}
			</DynamicScrollView>
		</DynamicKeyboardView>
	)
}

export default MenuScreen
