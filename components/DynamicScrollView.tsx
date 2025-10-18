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
 * 2. Alwaysstart from top:
 *    <DynamicScrollView autoCenter={false}>
 *
 * 3. With custom styles object:
 *    <DynamicScrollView styles={myStyles} containerKey="wrapper">
 */

interface DynamicScrollViewProps<
	T extends Record<string, StyleProp<any>> = Record<string, StyleProp<any>>
> extends ScrollViewProps {
	children: React.ReactNode
	styles?: T
	containerKey?: keyof T
	/** allow screens to pass styles that will be merged into ScrollView's contentContainerStyle */
	contentContainerStyle?: StyleProp<ViewStyle>
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

const DynamicScrollView = <
	T extends Record<string, StyleProp<any>> = Record<string, StyleProp<any>>
>({
	children,
	styles,
	containerKey = 'container',
	enableKeyboardAvoiding = true,
	behavior = 'padding',
	keyboardVerticalOffset,
	contentContainerStyle,
	autoCenter = false,
	fallbackAlign = 'flex-start',
	...scrollProps
}: DynamicScrollViewProps<T>) => {
	const responsive = useResponsiveDimensions()

	// Pull the container style from the provided styles object (if present)
	const providedContainerStyle =
		(styles && (styles[containerKey as string] as StyleProp<ViewStyle>)) ||
		undefined

	const dynamicContainer: StyleProp<ViewStyle> = [
		providedContainerStyle,
		{ paddingHorizontal: responsive.getResponsivePadding().horizontal },
	]

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

	const dynamicContentStyle: StyleProp<ViewStyle> = [
		{ flexGrow: 1 },
		autoCenter ? { justifyContent: getJustifyContent() } : undefined,
		contentContainerStyle,
	]

	return (
		<KeyboardAvoidingView
			key={responsive.isLandscape ? 'landscape' : 'portrait'}
			style={dynamicContainer}
			behavior={behavior}
			enabled={enableKeyboardAvoiding}
			keyboardVerticalOffset={offset}>
			<ScrollView
				contentContainerStyle={dynamicContentStyle}
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
