import React, { useState } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createCustomerMenuItemViewStyles } from '../../../../styles/customer'

interface MenuItemImagesProps {
	images: string[]
}

const MenuItemImages: React.FC<MenuItemImagesProps> = ({ images }) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createCustomerMenuItemViewStyles(colors, responsive)

	const [currentImageIndex, setCurrentImageIndex] = useState(0)

	const handleNextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % images.length)
	}

	const handlePrevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
	}

	if (!images || images.length === 0) return null

	return (
		<View style={styles.imageContainer}>
			<View style={styles.imageWrapper}>
				<Image
					source={{ uri: images[currentImageIndex] }}
					style={styles.mainImage}
					resizeMode="cover"
				/>

				{/* Navigation buttons (only show if multiple images) */}
				{images.length > 1 && (
					<>
						{/* Left button */}
						<TouchableOpacity
							style={[styles.imageNavButton, styles.imageNavButtonLeft]}
							onPress={handlePrevImage}
							activeOpacity={0.7}>
							<Ionicons
								name="chevron-back"
								size={24}
								color={colors.surface}
							/>
						</TouchableOpacity>

						{/* Right button */}
						<TouchableOpacity
							style={[styles.imageNavButton, styles.imageNavButtonRight]}
							onPress={handleNextImage}
							activeOpacity={0.7}>
							<Ionicons
								name="chevron-forward"
								size={24}
								color={colors.surface}
							/>
						</TouchableOpacity>
					</>
				)}
			</View>

			{/* Image indicators */}
			{images.length > 1 && (
				<View style={styles.imageIndicators}>
					{images.map((_, index) => (
						<View
							key={index}
							style={[
								styles.indicator,
								index === currentImageIndex && styles.activeIndicator,
							]}
						/>
					))}
				</View>
			)}
		</View>
	)
}

export default MenuItemImages
