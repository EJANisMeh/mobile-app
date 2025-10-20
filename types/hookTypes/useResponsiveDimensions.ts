import { DeviceOrientation } from '../../hooks/useDeviceOrientation'

export interface ResponsiveDimensionsReturn extends DeviceOrientation {
	getResponsiveValue: (portraitValue: number, landscapeValue?: number) => number
	getResponsivePadding: () => {
		horizontal: number
		vertical: number
	}
	getResponsiveFontSize: (baseSize: number) => number
	getResponsiveMargin: () => {
		small: number
		medium: number
		large: number
	}
	getWidthPercent: (percent: number) => number
	getHeightPercent: (percent: number) => number
	getContentMaxWidth: () => number
	getResponsiveSpacing: () => {
		xs: number
		sm: number
		md: number
		lg: number
		xl: number
	}
	isSmallScreen: boolean
	isMediumScreen: boolean
	isLargeScreen: boolean
}
