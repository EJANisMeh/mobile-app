import React from 'react'
import {
	KeyboardAvoidingView,
	Platform,
	StyleProp,
	ViewStyle,
	View,
} from 'react-native'
import { SafeAreaView, Edge } from 'react-native-safe-area-context'
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
	/**
	 * Enables safe area insets.
	 * - true: all edges (top, bottom, left, right)
	 * - false: no safe area
	 * - array: specific edges only
	 *
	 * For screens WITH headers: use ['left', 'right', 'bottom'] (no top)
	 * For screens WITHOUT headers: use true or ['top', 'left', 'right', 'bottom']
	 */
	useSafeArea?: boolean | Edge[]
	safeAreas?: Edge[]
}

const DynamicKeyboardView = ({
	children,
	style,
	enableKeyboardAvoiding = true,
	behavior = 'padding',
	keyboardVerticalOffset,
	useSafeArea = false,
	safeAreas=['top'],
}: DynamicKeyboardViewProps) => {
	const responsive = useResponsiveDimensions()

	// When using softwareKeyboardLayoutMode: "resize", we should disable KeyboardAvoidingView
	// because Android already handles the layout. Using both causes conflicts.
	// Only use KeyboardAvoidingView when explicitly needed with custom offset
	const shouldUseKeyboardAvoiding =
		Platform.OS === 'ios' || keyboardVerticalOffset !== undefined

	// Default offset for custom cases
	const offset = keyboardVerticalOffset ?? 0

	const containerStyle: StyleProp<ViewStyle> = [{ flex: 1 }, style]

	// Determine which edges to use for safe area
	const safeAreaEdges: Edge[] | undefined =
		useSafeArea === false
			? undefined
			: useSafeArea === true
			? safeAreas
			: useSafeArea

	// SafeAreaView should be the outermost container
	const SafeContainer = safeAreaEdges ? SafeAreaView : View

	return (
		<SafeContainer
			style={containerStyle}
			{...(safeAreaEdges ? { edges: safeAreaEdges } : {})}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={behavior}
				enabled={shouldUseKeyboardAvoiding && enableKeyboardAvoiding}
				keyboardVerticalOffset={offset}>
				{children}
			</KeyboardAvoidingView>
		</SafeContainer>
	)
}

export default DynamicKeyboardView
