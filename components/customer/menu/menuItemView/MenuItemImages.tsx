import React, { useState } from 'react'
import { View, Image, TouchableOpacity, Dimensions } from 'react-native'
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
			<TouchableOpacity
				style={styles.imageWrapper}
				onPress={handleNextImage}
				activeOpacity={0.9}>
				<Image
					source={{ uri: images[currentImageIndex] }}
					style={styles.mainImage}
					resizeMode="cover"
				/>
			</TouchableOpacity>

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
