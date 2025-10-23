import React from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { createProfileCreationStyles } from '../../../styles/auth'
import { ProfileCreationData } from '../../../types'

interface ContactDetailsProps {
	formData: ProfileCreationData
  updateContactDetail: (index: number, value: string) => void
  removeContactDetail: (index: number) => void
  addContactDetail: () => void
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  formData,
  updateContactDetail,
  removeContactDetail,
  addContactDetail,
}) => {
  const { colors } = useThemeContext()
  const responsive = useResponsiveDimensions()
  const profileCreationStyles = createProfileCreationStyles(colors, responsive)
  const { isLoading } = useAuthContext()
  
  return (
		<View style={profileCreationStyles.contactDetailsContainer}>
			<Text style={profileCreationStyles.contactDetailsLabel}>
				Contact Details (Optional)
			</Text>
			<Text style={profileCreationStyles.contactDetailsHint}>
				Add phone numbers, social media, etc.
			</Text>

			{(formData.contact_details || []).map((contact, index) => (
				<View
					key={index}
					style={profileCreationStyles.contactItem}>
					<TextInput
						style={profileCreationStyles.contactInput}
						placeholder="e.g., +639123456789 or @username"
						value={contact}
						onChangeText={(text) => updateContactDetail(index, text)}
						editable={!isLoading}
					/>
					<TouchableOpacity
						style={profileCreationStyles.removeContactButton}
						onPress={() => removeContactDetail(index)}
						disabled={isLoading}>
						<Text style={profileCreationStyles.removeContactText}>×</Text>
					</TouchableOpacity>
				</View>
			))}

			<TouchableOpacity
				style={profileCreationStyles.addContactButton}
				onPress={addContactDetail}
				disabled={isLoading}>
				<Text style={profileCreationStyles.addContactButtonText}>
					+ Add Contact Detail
				</Text>
			</TouchableOpacity>
		</View>
	)
}
 
export default ContactDetails;
