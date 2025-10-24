import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionStyles } from '../../../../styles/concessionaire'

const LoadingConcession: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionStyles = createConcessionStyles(colors, responsive)

	return (
		<View style={concessionStyles.loadingContainer}>
			<ActivityIndicator
				size="large"
				color={colors.primary}
			/>
			<Text style={concessionStyles.loadingText}>Loading concession...</Text>
		</View>
	)
}

export default LoadingConcession
