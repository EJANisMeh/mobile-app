import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { useThemeContext, useConcessionContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createEditConcessionStyles } from '../../../../styles/concessionaire'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ConcessionSchedule, UpdateConcessionData } from '../../../../types'
import { UseAlertModalType } from '../../../../hooks/useModals/types'
import { useConcessionaireNavigation } from '../../../../hooks/useNavigation'

interface EditConcessionSaveButtonProps {
	name: string
	description: string
	imageUrl: string
	schedule: ConcessionSchedule
	isSaving: boolean
	setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
	showAlert: UseAlertModalType['showAlert']
	edited: boolean
}

const EditConcessionSaveButton: React.FC<EditConcessionSaveButtonProps> = ({
	name,
	description,
	imageUrl,
	schedule,
	isSaving,
	setIsSaving,
	showAlert,
	edited,
}) => {
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const styles = createEditConcessionStyles(colors, responsive)
	const { concession, updateConcession } = useConcessionContext()
	const navigation = useConcessionaireNavigation()

	const goBackToConcession = () => {
		if (navigation.canGoBack()) {
			navigation.goBack()
			return
		}

		navigation.navigate('MainTabs')
	}

	const handleSave = async () => {
		// Early return if no changes or already saving
		if (!edited || isSaving) {
			return
		}

		// Validation
		if (!name.trim()) {
			showAlert({
				title: 'Validation Error',
				message: 'Concession name is required',
			})
			return
		}

		if (!concession?.id) {
			showAlert({
				title: 'Error',
				message: 'No concession found to update',
			})
			return
		}

		setIsSaving(true)

		try {
			const updateData: UpdateConcessionData = {
				name: name.trim(),
				description: description.trim() || null,
				image_url: imageUrl.trim() || null,
				schedule,
			}

			const result = await updateConcession(concession.id, updateData)

			if (result.success) {
				showAlert({
					title: 'Success',
					message: 'Concession details updated successfully',
				})
				// Navigate back after a short delay
				setTimeout(() => {
					goBackToConcession()
				}, 1500)
			} else {
				showAlert({
					title: 'Error',
					message: result.error || 'Failed to update concession details',
				})
			}
		} catch (err) {
			showAlert({
				title: 'Error',
				message:
					err instanceof Error ? err.message : 'An unexpected error occurred',
			})
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<TouchableOpacity
			style={[
				styles.saveButton,
				(!edited || isSaving) && styles.saveButtonDisabled,
			]}
			onPress={handleSave}
			disabled={!edited || isSaving}>
			{isSaving ? (
				<ActivityIndicator
					size="small"
					color="#fff"
				/>
			) : (
				<>
					<MaterialCommunityIcons
						name="content-save"
						size={20}
						color="#fff"
						style={styles.saveButtonIcon}
					/>
					<Text style={styles.saveButtonText}>Save Changes</Text>
				</>
			)}
		</TouchableOpacity>
	)
}

export default EditConcessionSaveButton
