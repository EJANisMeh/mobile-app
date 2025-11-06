import React from 'react'
import { ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native'
import { useResponsiveDimensions } from '../hooks'

/**
 * DynamicScrollView - Responsive scroll container with auto-centering
 *
 * Features:
 * - Adapts padding and styles based on device orientation
 * - Auto-centers content when it fits on screen (portrait mode with height > 600)
 * - Falls back to top alignment when content overflows or in landscape
 * - Strongly typed with generic styles support
 *
 * NOTE: Use inside DynamicKeyboardView for keyboard avoidance and safe area support
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
 *    <DynamicScrollView style={myStyles.container}>
 */

interface DynamicScrollViewProps extends ScrollViewProps {
	children: React.ReactNode
	/** Style prop (recommended) */
	style?: StyleProp<ViewStyle>
	/** Legacy styles prop for backward compatibility */
	styles?: StyleProp<ViewStyle>
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

	// ScrollView Props
	keyboardShouldPersistTaps?: 'handled' | 'always' | 'never'
	bounces?: boolean
	showsVerticalScrollIndicator?: boolean
}

const DynamicScrollView = ({
	children,
	style,
	styles, // Legacy support
	autoCenter = false,
	fallbackAlign = 'flex-start',

	// Scroll View Props
	keyboardShouldPersistTaps = 'handled',
	bounces = false,
	showsVerticalScrollIndicator = false,

	...additionalScrollProps
}: DynamicScrollViewProps) => {
	const responsive = useResponsiveDimensions()

	// Calculate justifyContent based on autoCenter and screen size
	const getJustifyContent = ():
		| 'center'
		| 'flex-start'
		| 'flex-end'
		| 'space-between'
		| 'space-around' => {
		if (!autoCenter) {
			return fallbackAlign as 'flex-start' | 'flex-end' | 'center'
		}

		// Auto-center logic:
		// In portrait with enough height, center content
		// In landscape or small screens, use fallback alignment
		const hasEnoughHeight = responsive.height > 600 && responsive.isPortrait

		return hasEnoughHeight ? autoCenter : fallbackAlign
	}

	// Separate visual styles (for ScrollView style prop)
	// Support both 'style' and 'styles' for backward compatibility
	const scrollViewStyle: StyleProp<ViewStyle> = [{ flex: 1 }, styles || style]

	// Layout styles (for ScrollView contentContainerStyle prop)
	const contentContainerStyle: StyleProp<ViewStyle> = [
		{
			paddingTop: responsive.getResponsiveSpacing().sm,
		},
		autoCenter
			? { justifyContent: getJustifyContent(), flexGrow: 1 }
			: undefined,
		{ width: '100%' },
	]

	return (
		<ScrollView
			style={scrollViewStyle}
			contentContainerStyle={contentContainerStyle}
			keyboardShouldPersistTaps={keyboardShouldPersistTaps}
			bounces={bounces}
			showsVerticalScrollIndicator={showsVerticalScrollIndicator}
			{...additionalScrollProps}>
			{children}
		</ScrollView>
	)
}

export default DynamicScrollView
