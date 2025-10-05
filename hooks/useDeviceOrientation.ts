import { useState, useEffect } from 'react'
import { Dimensions } from 'react-native'

export interface DeviceOrientation {
	isLandscape: boolean
	isPortrait: boolean
	width: number
	height: number
	screenData: {
		width: number
		height: number
		scale: number
		fontScale: number
	}
}

export const useDeviceOrientation = (): DeviceOrientation => {
	const [orientation, setOrientation] = useState<DeviceOrientation>(() => {
		const screenData = Dimensions.get('screen')
		const { width, height } = screenData
		return {
			isLandscape: width > height,
			isPortrait: width <= height,
			width,
			height,
			screenData,
		}
	})

	useEffect(() => {
		const subscription = Dimensions.addEventListener('change', ({ screen }) => {
			const { width, height } = screen
			setOrientation({
				isLandscape: width > height,
				isPortrait: width <= height,
				width,
				height,
				screenData: screen,
			})
		})

		return () => subscription?.remove()
	}, [])

	return orientation
}

// Helper hook for responsive dimensions
export const useResponsiveDimensions = () => {
	const orientation = useDeviceOrientation()

	// Calculate responsive values based on screen size
	const getResponsiveValue = (
		portraitValue: number,
		landscapeValue?: number
	) => {
		return orientation.isLandscape && landscapeValue !== undefined
			? landscapeValue
			: portraitValue
	}

	// Get responsive padding
	const getResponsivePadding = () => ({
		horizontal: getResponsiveValue(24, 48), // More padding in landscape
		vertical: getResponsiveValue(20, 16), // Less vertical padding in landscape
	})

	// Get responsive font sizes
	const getResponsiveFontSize = (baseSize: number) => {
		const scaleFactor = orientation.isLandscape ? 0.9 : 1
		return Math.round(baseSize * scaleFactor)
	}

	// Get responsive margins
	const getResponsiveMargin = () => ({
		small: getResponsiveValue(8, 6),
		medium: getResponsiveValue(16, 12),
		large: getResponsiveValue(32, 24),
	})

	return {
		...orientation,
		getResponsiveValue,
		getResponsivePadding,
		getResponsiveFontSize,
		getResponsiveMargin,
		// Quick access to common responsive values
		isSmallScreen: orientation.width < 375,
		isMediumScreen: orientation.width >= 375 && orientation.width < 768,
		isLargeScreen: orientation.width >= 768,
	}
}
