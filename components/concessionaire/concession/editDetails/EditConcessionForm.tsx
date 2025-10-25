import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useThemeContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createEditConcessionStyles } from '../../../../styles/concessionaire'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { UseAlertModalType } from '../../../../hooks/useModals/types'

interface EditConcessionFormProps
{
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  showAlert: UseAlertModalType['showAlert']
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
}

const EditConcessionForm: React.FC<EditConcessionFormProps> = ({
  name,
  setName,
  description,
  setDescription,
  showAlert,
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
					onPress={() =>
						showAlert({
							title: 'Coming Soon',
							message: 'Schedule management feature is under development',
						})
					}>
					<MaterialCommunityIcons
						name="calendar-clock"
						size={24}
						color={colors.primary}
						style={styles.scheduleIcon}
					/>
					<Text style={styles.scheduleButtonText}>
						Configure Operating Hours
					</Text>
					<MaterialCommunityIcons
						name="chevron-right"
						size={24}
						color={colors.placeholder}
					/>
				</TouchableOpacity>
				<Text style={styles.hint}>
					Set your daily operating hours and breaks
				</Text>
			</View>
		</View>
	)
}
 
export default EditConcessionForm;