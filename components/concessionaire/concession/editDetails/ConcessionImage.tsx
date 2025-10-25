import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createEditConcessionStyles } from '../../../../styles/concessionaire'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface ConcessionImageProps
{
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>
}

const ConcessionImage: React.FC<ConcessionImageProps> = ({
  imageUrl,
  setImageUrl,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createEditConcessionStyles(colors, responsive)

	return (
		<>
			{imageUrl ? (
				<View style={styles.imagePreviewContainer}>
					<Image
						source={{ uri: imageUrl }}
						style={styles.imagePreview}
						resizeMode="cover"
					/>
					<TouchableOpacity
						style={styles.removeImageButton}
						onPress={() => setImageUrl('')}>
						<MaterialCommunityIcons
							name="close-circle"
							size={24}
							color="#fff"
						/>
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.imagePlaceholder}>
					<MaterialCommunityIcons
						name="image-plus"
						size={48}
						color={colors.placeholder}
					/>
					<Text style={styles.imagePlaceholderText}>No image selected</Text>
				</View>
			)}
		</>
	)
}

export default ConcessionImage
