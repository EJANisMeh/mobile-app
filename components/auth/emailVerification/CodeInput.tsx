import React from 'react'
import {
	View,
	TextInput,
	StyleProp,
	ViewStyle,
	TextStyle,
} from 'react-native'

interface CodeInputProps {
  code: string[]
  setCode: React.Dispatch<React.SetStateAction<string[]>>
	isVerifying: boolean
	inputRefs: React.RefObject<(TextInput | null)[]>
	emailVerificationStyles: {
		codeInputContainer: StyleProp<ViewStyle>
		codeInput: StyleProp<TextStyle>
		codeInputFilled: StyleProp<TextStyle>
		codeInputEmpty: StyleProp<TextStyle>
	}
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  setCode,
	isVerifying,
	inputRefs,
	emailVerificationStyles,
}) => {
	const handleCodeChange = (text: string, index: number) => {
		// Only allow numbers
		if (text && !/^\d$/.test(text)) return

		const newCode = [...code]
		newCode[index] = text
		setCode(newCode)

		// Auto-focus next input
		if (text && index < 5) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyPress = (
		e: { nativeEvent: { key: string } },
		index: number
	) => {
		if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus()
		}
	}

	return (
		<View style={emailVerificationStyles.codeInputContainer}>
			{code.map((digit, index) => (
				<TextInput
					key={index}
					ref={(ref) => {
						inputRefs.current[index] = ref
					}}
					style={[
						emailVerificationStyles.codeInput,
						digit
							? emailVerificationStyles.codeInputFilled
							: emailVerificationStyles.codeInputEmpty,
					]}
					value={digit}
					onChangeText={(text) => handleCodeChange(text, index)}
					onKeyPress={(e) => handleKeyPress(e, index)}
					keyboardType="number-pad"
					maxLength={1}
					editable={!isVerifying}
					autoFocus={index === 0}
				/>
			))}
		</View>
	)
}

export default CodeInput
