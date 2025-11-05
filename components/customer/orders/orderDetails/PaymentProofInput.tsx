import React from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ThemeColors } from '../../../../types'

interface PaymentProofInputProps {
	proofText: string
	proofImage: string | null
	submittingProof: boolean
	proofMode: 'text' | 'screenshot' | null
	onProofTextChange: (text: string) => void
	onPickImage: () => void
	onRemoveImage: () => void
	onSubmit: () => void
	styles: any
	colors: ThemeColors
}

const PaymentProofInput: React.FC<PaymentProofInputProps> = ({
	proofText,
	proofImage,
	submittingProof,
	proofMode,
	onProofTextChange,
	onPickImage,
	onRemoveImage,
	onSubmit,
	styles,
	colors,
}) => {
	const showTextInput = proofMode === 'text' || proofMode === null
	const showImageUpload = proofMode === 'screenshot' || proofMode === null
	const showOrText = showTextInput && showImageUpload

	return (
		<View style={styles.proofInputSection}>
			<View style={styles.proofNotice}>
				<MaterialCommunityIcons
					name="alert-circle"
					size={20}
					color={colors.error}
				/>
				<Text style={styles.proofNoticeText}>
					Payment proof is required. Please submit{' '}
					{proofMode === 'text'
						? 'transaction details'
						: proofMode === 'screenshot'
							? 'a screenshot'
							: 'proof'}{' '}
					to help the concessionaire verify your payment.
				</Text>
			</View>

			{showTextInput && (
				<View style={styles.proofInputContainer}>
					<Text style={styles.inputLabel}>
						Transaction ID or Reference Number
					</Text>
					<TextInput
						style={styles.proofTextInput}
						placeholder="Enter transaction ID, reference number, etc."
						placeholderTextColor={colors.placeholder}
						value={proofText}
						onChangeText={onProofTextChange}
						multiline
						numberOfLines={3}
						editable={!proofImage}
					/>
				</View>
			)}

			{showOrText && <Text style={styles.orText}>OR</Text>}

			{showImageUpload && (
				<View style={styles.proofInputContainer}>
					<Text style={styles.inputLabel}>Upload Screenshot</Text>
					{!proofImage ? (
						<TouchableOpacity
							style={styles.uploadButton}
							onPress={onPickImage}
							disabled={Boolean(proofText.trim())}>
							<MaterialCommunityIcons
								name="image-plus"
								size={24}
								color={
									proofText.trim() ? colors.textSecondary : colors.primary
								}
							/>
							<Text
								style={[
									styles.uploadButtonText,
									proofText.trim() && styles.uploadButtonTextDisabled,
								]}>
								Choose from gallery
							</Text>
						</TouchableOpacity>
					) : (
						<View style={styles.imagePreviewContainer}>
							<Image
								source={{ uri: proofImage }}
								style={styles.imagePreview}
								resizeMode="cover"
							/>
							<TouchableOpacity
								style={styles.removeImageButton}
								onPress={onRemoveImage}>
								<MaterialCommunityIcons
									name="close-circle"
									size={24}
									color={colors.error}
								/>
							</TouchableOpacity>
						</View>
					)}
				</View>
			)}

			<TouchableOpacity
				style={[
					styles.submitButton,
					!proofText.trim() && !proofImage && styles.submitButtonDisabled,
				]}
				onPress={onSubmit}
				disabled={(!proofText.trim() && !proofImage) || submittingProof}>
				{submittingProof ? (
					<ActivityIndicator
						size="small"
						color={colors.surface}
					/>
				) : (
					<Text style={styles.submitButtonText}>Submit Payment Proof</Text>
				)}
			</TouchableOpacity>
		</View>
	)
}

export default PaymentProofInput
