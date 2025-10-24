import React, {useState} from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useThemeContext, useConcessionContext } from '../../../../context'
import { useResponsiveDimensions } from '../../../../hooks'
import { createConcessionStyles } from '../../../../styles/concessionaire'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { UseAlertModalType, UseConfirmationModalType } from '../../../../hooks/useModals/types'

interface ConcessionStatusButtonProps
{
  showAlert: UseAlertModalType['showAlert']
  showConfirmation: UseConfirmationModalType['showConfirmation']
}

const ConcessionStatusButton: React.FC<ConcessionStatusButtonProps> = ({
  showAlert,
  showConfirmation
}) =>
{
	const { colors } = useThemeContext()
	const responsive = useResponsiveDimensions()
	const concessionStyles = createConcessionStyles(colors, responsive)
	const { error, concession, toggleConcessionStatus } = useConcessionContext()

	const [isTogglingStatus, setIsTogglingStatus] = useState<boolean>(false)

	// Handle status toggle with confirmation
	const handleStatusToggle = () => {
		if (!concession) return

		const action = async () => {
			setIsTogglingStatus(true)

			try {
				const result = await toggleConcessionStatus(concession.id)

				if (!result.success && !result.Success) {
					showAlert({
						title: 'Error',
						message: result.error || error || 'Failed to update status',
					})
					return
				}

				const newStatus = !concession.is_open

				showAlert({
					title: 'Success',
					message:
						(result.message as string) ||
						`Concession is now ${newStatus ? 'open' : 'closed'}`,
				})
			} catch (err) {
				showAlert({
					title: 'Error',
					message:
						err instanceof Error ? err.message : 'An unexpected error occurred',
				})
			} finally {
				setIsTogglingStatus(false)
			}
		}

		// Prompt user for confirmation before performing the action
		showConfirmation({
			title: 'Confirm status change',
			message: `Are you sure you want to ${
				concession.is_open ? 'close' : 'open'
			} the concession?`,
			confirmText: 'Yes',
			cancelText: 'No',
			onConfirm: action,
		})
	}

	return (
		<View style={concessionStyles.statusSection}>
			<Text style={concessionStyles.sectionTitle}>Status</Text>
			<TouchableOpacity
				style={[
					concessionStyles.statusButton,
					concession?.is_open
						? concessionStyles.statusButtonOpen
						: concessionStyles.statusButtonClosed,
				]}
				onPress={handleStatusToggle}
				disabled={isTogglingStatus}>
				<View style={concessionStyles.statusButtonContent}>
					<MaterialCommunityIcons
						name={concession?.is_open ? 'store-check' : 'store-off'}
						size={28}
						color={concession?.is_open ? '#2e7d32' : '#c62828'}
						style={concessionStyles.statusIcon}
					/>
					<Text
						style={[
							concessionStyles.statusText,
							concession?.is_open
								? concessionStyles.statusTextOpen
								: concessionStyles.statusTextClosed,
						]}>
						{concession?.is_open ? 'Open' : 'Closed'}
					</Text>
				</View>
				<Text style={concessionStyles.statusToggleText}>Tap to toggle</Text>
			</TouchableOpacity>
		</View>
	)
}
 
export default ConcessionStatusButton;