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
}

const DynamicKeyboardView = ({
	children,
	style,
	enableKeyboardAvoiding = true,
	behavior = 'padding',
	keyboardVerticalOffset,
	useSafeArea = ['left', 'right', 'bottom'], // Default: safe area on sides and bottom, but not top (for screens with headers)
}: DynamicKeyboardViewProps) => {
	const responsive = useResponsiveDimensions()

	const offset =
		keyboardVerticalOffset ?? (Platform.OS === 'android' ? -100 : 0)

	const containerStyle: StyleProp<ViewStyle> = [{ flex: 1 }, style]

	// Determine which edges to use for safe area
	const safeAreaEdges: Edge[] | undefined =
		useSafeArea === false
			? undefined
			: useSafeArea === true
			? ['top', 'bottom', 'left', 'right']
			: useSafeArea

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

	if (safeAreaEdges) {
		// Use the containerStyle for SafeAreaView so the safe area background
		// matches the screen's background (prevents gray area showing through)
		return (
			<SafeAreaView
				style={containerStyle as any}
				edges={safeAreaEdges}>
				{content}
			</SafeAreaView>
		)
	}

	return content
}

export default DynamicKeyboardView
