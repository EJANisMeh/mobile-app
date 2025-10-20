import React from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleProp,
} from 'react-native'

interface ForgotPasswordFormProps {
  email: string
  setEmail: (email: string) => void
  isLoading?: boolean
  forgotPasswordStyles: Record<string, StyleProp<any>>
  onSendReset: () => Promise<void> | void
  onBack: () => void
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  setEmail,
  isLoading = false,
  forgotPasswordStyles,
  onSendReset,
  onBack,
}) => {
  return (
    <View style={forgotPasswordStyles.form}>
      <TextInput
        style={forgotPasswordStyles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[
          forgotPasswordStyles.submitButton,
          isLoading && forgotPasswordStyles.disabledButton,
        ]}
        onPress={onSendReset}
        disabled={isLoading}>
        <Text style={forgotPasswordStyles.submitButtonText}>
          {isLoading ? 'Sending...' : 'Send Reset Instructions'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={forgotPasswordStyles.backButton}
        onPress={onBack}>
        <Text style={forgotPasswordStyles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ForgotPasswordForm