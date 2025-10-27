import React from 'react'
import { View, Text } from 'react-native'
import { useThemeContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createConcessionaireMenuStyles } from '../../../styles/concessionaire'
import DynamicScrollView from '../../../components/DynamicScrollView'

const CategoryManagementScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createConcessionaireMenuStyles(colors, responsive)

	return (
		<DynamicScrollView
			styles={styles.container}
			autoCenter="center"
			fallbackAlign="center">
			<View>
				<Text style={styles.containerText}>Category Management</Text>
				<Text style={styles.containerSubtext}>Coming Soon</Text>
			</View>
		</DynamicScrollView>
	)
}

export default CategoryManagementScreen
