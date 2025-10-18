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

interface DynamicScrollViewProps<
    T extends Record<string, StyleProp<any>> = Record<string, StyleProp<any>>
> extends ScrollViewProps {
    children: React.ReactNode
    styles?: T
    containerKey?: keyof T
    enableKeyboardAvoiding?: boolean
    behavior?: 'height' | 'position' | 'padding' | undefined
    keyboardVerticalOffset?: number
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
    ...scrollProps
}: DynamicScrollViewProps<T>) => {
    const responsive = useResponsiveDimensions()

    // Pull the container style from the provided styles object (if present)
    const providedContainerStyle = (styles &&
        (styles[containerKey as string] as StyleProp<ViewStyle>)) || undefined

    const dynamicContainer: StyleProp<ViewStyle> = [
        providedContainerStyle,
        { paddingHorizontal: responsive.getResponsivePadding().horizontal },
    ]

    const offset = keyboardVerticalOffset ?? (Platform.OS === 'android' ? -100 : 0)

    return (
        <KeyboardAvoidingView
            key={responsive.isLandscape ? 'landscape' : 'portrait'}
            style={dynamicContainer}
            behavior={behavior}
            enabled={enableKeyboardAvoiding}
            keyboardVerticalOffset={offset}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
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