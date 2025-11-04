import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createEditConcessionStyles } from '../../../../styles/concessionaire'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface EditConcessionFormProps {
	name: string
	setName: React.Dispatch<React.SetStateAction<string>>
	description: string
	setDescription: React.Dispatch<React.SetStateAction<string>>
	onSchedulePress: () => void
	scheduleSummary: string
}

const EditConcessionForm: React.FC<EditConcessionFormProps> = ({
	name,
	setName,
	description,
	setDescription,
	onSchedulePress,
	scheduleSummary,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createEditConcessionStyles(colors, responsive)

	return (
		<View style={styles.formSection}>
			{/* Name Field */}
			<View style={styles.inputGroup}>
				<Text style={styles.label}>
					Concession Name <Text style={styles.required}>*</Text>
				</Text>
				<TextInput
					style={styles.input}
					placeholder="Enter concession name"
					placeholderTextColor={colors.placeholder}
					value={name}
					onChangeText={setName}
					maxLength={100}
				/>
			</View>

			{/* Description Field */}
			<View style={styles.inputGroup}>
				<Text style={styles.label}>Description</Text>
				<TextInput
					style={[styles.input, styles.textArea]}
					placeholder="Describe your concession..."
					placeholderTextColor={colors.placeholder}
					value={description}
					onChangeText={setDescription}
					multiline
					numberOfLines={7}
					textAlignVertical="top"
					maxLength={1500}
				/>
				<Text style={styles.charCount}>
					{description.length}/1500 characters
				</Text>
			</View>

			{/* Schedule Section - Placeholder */}
			<View style={styles.inputGroup}>
				<Text style={styles.label}>Operating Schedule</Text>
				<TouchableOpacity
					style={styles.scheduleButton}
					onPress={onSchedulePress}>
					<MaterialCommunityIcons
						name="calendar-clock"
						size={24}
						color={colors.primary}
						style={styles.scheduleIcon}
					/>
					<View style={styles.scheduleTextWrapper}>
						<Text style={styles.scheduleButtonText}>
							Configure Operating Hours
						</Text>
						<Text style={styles.scheduleSummary}>{scheduleSummary}</Text>
					</View>
					<MaterialCommunityIcons
						name="chevron-right"
						size={24}
						color={colors.placeholder}
					/>
				</TouchableOpacity>
				<Text style={styles.hint}>Set your daily operating hours</Text>
			</View>
		</View>
	)
}

export default EditConcessionForm
