import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createEditConcessionStyles } from '../../../../styles/concessionaire'

const LoadingEditConcession: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createEditConcessionStyles(colors, responsive)

	return (
		<View style={styles.loadingContainer}>
			<ActivityIndicator
				size="large"
				color={colors.primary}
			/>
			<Text style={styles.loadingText}>Loading concession...</Text>
		</View>
	)
}

export default LoadingEditConcession
