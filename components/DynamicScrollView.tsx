import React from 'react'
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	ScrollViewProps,
	StyleProp,
	ViewStyle,
} from 'react-native'
import { useResponsiveDimensions } from '../hooks'

/**
 * DynamicScrollView - Responsive scroll container with auto-centering
 *
 * Features:
 * - Adapts padding and styles based on device orientation
 * - Auto-centers content when it fits on screen (portrait mode with height > 600)
 * - Falls back to top alignment when content overflows or in landscape
 * - Keyboard avoiding behavior built-in
 * - Strongly typed with generic styles support
 *
 * Usage examples:
 *
 * 1. Auto-center when content fits:
 *    <DynamicScrollView autoCenter="center" fallbackAlign="flex-start">
 *
 * 2. Always start from top:
 *    <DynamicScrollView autoCenter={false}>
 *
 * 3. With custom styles:
 *    <DynamicScrollView styles={myStyles.container}>
 */

interface DynamicScrollViewProps extends ScrollViewProps {
	children: React.ReactNode
	styles?: StyleProp<ViewStyle>
	enableKeyboardAvoiding?: boolean
	behavior?: 'height' | 'position' | 'padding' | undefined
	keyboardVerticalOffset?: number
	/**
	 * Auto-center content vertically when all content fits on screen.
	 * When content overflows, it starts from top (or specified fallbackAlign).
	 * Options: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | false
	 * Default: false (no auto-centering)
	 */
	autoCenter?:
		| 'center'
		| 'flex-start'
		| 'flex-end'
		| 'space-between'
		| 'space-around'
		| false
	/**
	 * Alignment to use when content overflows (doesn't fit on screen).
	 * Default: 'flex-start' (start from top)
	 */
	fallbackAlign?: 'flex-start' | 'flex-end' | 'center'
}

const DynamicScrollView = ({
	children,
	styles,
	enableKeyboardAvoiding = true,
	behavior = 'padding',
	keyboardVerticalOffset,
	autoCenter = false,
	fallbackAlign = 'flex-start',
	...scrollProps
}: DynamicScrollViewProps) => {
	const responsive = useResponsiveDimensions()

	const offset =
		keyboardVerticalOffset ?? (Platform.OS === 'android' ? -100 : 0)

	// Calculate justifyContent based on autoCenter and screen size
	const getJustifyContent = ():
		| 'center'
		| 'flex-start'
		| 'flex-end'
		| 'space-between'
		| 'space-around' => {
		if (!autoCenter) {
			// If autoCenter is disabled, use fallbackAlign or extract from contentContainerStyle
			return fallbackAlign as 'flex-start' | 'flex-end' | 'center'
		}

		// Auto-center logic:
		// In portrait with enough height, center content
		// In landscape or small screens, use fallback alignment
		const hasEnoughHeight = responsive.height > 600 && responsive.isPortrait

		return hasEnoughHeight ? autoCenter : fallbackAlign
	}

	// Separate visual styles (for ScrollView style prop)
	const scrollViewStyle: StyleProp<ViewStyle> = [{ flex: 1 }, styles]

	// Layout styles (for ScrollView contentContainerStyle prop)
	const contentContainerStyle: StyleProp<ViewStyle> = [
		autoCenter ? { justifyContent: getJustifyContent() } : undefined,
		{ paddingHorizontal: responsive.getResponsivePadding().horizontal },
		{ paddingVertical: responsive.getResponsivePadding().vertical },
		{ flexGrow: 1 },
		{ alignItems: 'center' as const },
	]

	return (
		<KeyboardAvoidingView
			key={responsive.isLandscape ? 'landscape' : 'portrait'}
			style={{ flex: 1 }}
			behavior={behavior}
			enabled={enableKeyboardAvoiding}
			keyboardVerticalOffset={offset}>
			<ScrollView
				style={scrollViewStyle}
				contentContainerStyle={contentContainerStyle}
				keyboardShouldPersistTaps="handled"
				bounces={false}
				showsVerticalScrollIndicator={false}
				{...scrollProps}>
				{children}
			</ScrollView>
		</KeyboardAvoidingView>
	)
}

export default DynamicScrollView
