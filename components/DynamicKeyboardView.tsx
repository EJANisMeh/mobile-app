import React from 'react'
import {
	KeyboardAvoidingView,
	Platform,
	StyleProp,
	ViewStyle,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useResponsiveDimensions } from '../hooks'

/**
 * DynamicKeyboardView - Responsive container with keyboard avoidance and safe area
 *
 * Features:
 * - Adapts padding based on device orientation
 * - Keyboard avoiding behavior built-in
 * - Safe area support
 * - Can contain both scrollable and fixed (bottom) elements
 *
 * Usage:
 * <DynamicKeyboardView>
 *   <DynamicScrollView>...</DynamicScrollView>
 *   <View>Bottom fixed content</View>
 * </DynamicKeyboardView>
 */

interface DynamicKeyboardViewProps {
	children: React.ReactNode
	style?: StyleProp<ViewStyle>
	/** Enables or disables the KeyboardAvoidingView. */
	enableKeyboardAvoiding?: boolean
	behavior?: 'height' | 'position' | 'padding' | undefined
	keyboardVerticalOffset?: number
	/** Enables safe area insets */
	useSafeArea?: boolean
}

const DynamicKeyboardView = ({
	children,
	style,
	enableKeyboardAvoiding = true,
	behavior = 'padding',
	keyboardVerticalOffset,
	useSafeArea = true,
}: DynamicKeyboardViewProps) => {
	const responsive = useResponsiveDimensions()

	const offset =
		keyboardVerticalOffset ?? (Platform.OS === 'android' ? -100 : 0)

	const containerStyle: StyleProp<ViewStyle> = [
		{ flex: 1 },
		{
			paddingHorizontal: responsive.getResponsivePadding().horizontal,
		},
		style,
	]

	const content = (
		<KeyboardAvoidingView
			key={responsive.isLandscape ? 'landscape' : 'portrait'}
			style={{ flex: 1 }}
			behavior={behavior}
			enabled={enableKeyboardAvoiding}
			keyboardVerticalOffset={offset}>
			<View style={containerStyle}>{children}</View>
		</KeyboardAvoidingView>
	)

	if (useSafeArea) {
		return <SafeAreaView style={{ flex: 1 }}>{content}</SafeAreaView>
	}

	return content
}

export default DynamicKeyboardView
