# System UI Visibility Control in Expo React Native

This guide explains how to control system buttons (navigation bar, status bar, etc.) visibility in your Expo React Native app.

## 📦 Required Package

```bash
npx expo install expo-navigation-bar
```

## 🤖 Android Navigation Bar (System Buttons)

The navigation bar contains the **Back**, **Home**, and **Recent Apps** buttons on Android devices.

### Hide Navigation Bar

```typescript
import * as NavigationBar from 'expo-navigation-bar'
import { Platform } from 'react-native'

useEffect(() => {
	const hideNavBar = async () => {
		if (Platform.OS === 'android') {
			// Hide the navigation bar
			await NavigationBar.setVisibilityAsync('hidden')

			// Set behavior - user can swipe to show temporarily
			await NavigationBar.setBehaviorAsync('overlay-swipe')
		}
	}

	hideNavBar()

	// Cleanup: restore on unmount
	return () => {
		if (Platform.OS === 'android') {
			NavigationBar.setVisibilityAsync('visible')
		}
	}
}, [])
```

### Navigation Bar Options

**Visibility:**

- `'visible'` - Always visible
- `'hidden'` - Hidden until user swipes

**Behavior:**

- `'overlay-swipe'` - Shows temporarily when user swipes from edge
- `'inset-swipe'` - Shows permanently when user swipes (legacy devices)
- `'inset-touch'` - Shows on any touch (legacy devices)

### Set Navigation Bar Color

```typescript
// Set background color
await NavigationBar.setBackgroundColorAsync('#ffffff')

// Set button color (light or dark)
await NavigationBar.setButtonStyleAsync('dark') // or 'light'
```

## 📱 Status Bar Control

You already have `expo-status-bar` installed. Use it to control the top status bar:

```typescript
import { StatusBar } from 'expo-status-bar'

// In your component JSX:
<StatusBar hidden={true} />

// Or with style
<StatusBar style="light" /> // 'auto', 'inverted', 'light', 'dark'
```

### Programmatic Control

```typescript
import * as StatusBarAPI from 'expo-status-bar'

// Hide status bar
StatusBarAPI.setStatusBarHidden(true, 'slide')

// Show status bar
StatusBarAPI.setStatusBarHidden(false, 'slide')

// Change style
StatusBarAPI.setStatusBarStyle('light')
```

## 🎯 Full Immersive Mode Example

For a truly immersive experience (hiding both status bar and navigation bar):

```typescript
import React, { useEffect } from 'react'
import { View, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as NavigationBar from 'expo-navigation-bar'

const ImmersiveScreen = () => {
	useEffect(() => {
		const enterImmersiveMode = async () => {
			if (Platform.OS === 'android') {
				await NavigationBar.setVisibilityAsync('hidden')
				await NavigationBar.setBehaviorAsync('overlay-swipe')
			}
		}

		const exitImmersiveMode = async () => {
			if (Platform.OS === 'android') {
				await NavigationBar.setVisibilityAsync('visible')
			}
		}

		enterImmersiveMode()

		return () => {
			exitImmersiveMode()
		}
	}, [])

	return (
		<View style={{ flex: 1 }}>
			<StatusBar hidden={true} />
			{/* Your content here */}
		</View>
	)
}
```

## 🍎 iOS Considerations

**Important:** iOS has strict guidelines about system UI:

- **Home Indicator**: Cannot be permanently hidden on iPhone X and later
- **Status Bar**: Can be hidden, but Apple discourages it except for media apps
- **No Navigation Bar**: iOS doesn't have a bottom navigation bar like Android

### iOS Status Bar Control

```typescript
// In app.json or app.config.js
{
  "expo": {
    "ios": {
      "infoPlist": {
        "UIViewControllerBasedStatusBarAppearance": true
      }
    }
  }
}
```

Then use:

```typescript
<StatusBar hidden={Platform.OS === 'android'} />
```

## 🔧 Per-Screen Configuration

As implemented in `editDetails.tsx`:

```typescript
useEffect(() => {
	// Hide when screen mounts
	const hide = async () => {
		if (Platform.OS === 'android') {
			await NavigationBar.setVisibilityAsync('hidden')
			await NavigationBar.setBehaviorAsync('overlay-swipe')
		}
	}

	hide()

	// Show when screen unmounts (navigating away)
	return () => {
		if (Platform.OS === 'android') {
			NavigationBar.setVisibilityAsync('visible')
		}
	}
}, [])
```

## 🎨 Common Patterns

### 1. **Full-Screen Video Player**

```typescript
// Hide everything
await NavigationBar.setVisibilityAsync('hidden')
StatusBarAPI.setStatusBarHidden(true, 'fade')
```

### 2. **Reading Mode / Focus Mode**

```typescript
// Hide nav bar but keep status bar
await NavigationBar.setVisibilityAsync('hidden')
await NavigationBar.setBehaviorAsync('overlay-swipe')
```

### 3. **Form/Editor (Your Use Case)**

```typescript
// Hide system buttons for distraction-free editing
await NavigationBar.setVisibilityAsync('hidden')
await NavigationBar.setBehaviorAsync('overlay-swipe')
// Keep status bar visible for time/battery
```

## 🐛 Troubleshooting

### Navigation bar not hiding?

- Ensure you're testing on a physical Android device or emulator (not iOS)
- Some Android devices (Samsung, OnePlus) have gesture navigation that can't be fully hidden
- Check Android API level - some features require API 19+

### App crashes on import?

- Run `npx expo prebuild` if using bare workflow
- Ensure you installed via `npx expo install` (not `npm install`)

### Buttons reappear unexpectedly?

- Make sure cleanup function in useEffect is restoring visibility
- Check if other screens/components are also controlling nav bar

## 📚 API Reference

Full documentation: [Expo Navigation Bar Docs](https://docs.expo.dev/versions/latest/sdk/navigation-bar/)

### Key Methods

| Method                                      | Description                  |
| ------------------------------------------- | ---------------------------- |
| `setVisibilityAsync('hidden' \| 'visible')` | Show/hide navigation bar     |
| `setBehaviorAsync('overlay-swipe' \| ...)`  | Control show behavior        |
| `setBackgroundColorAsync(color)`            | Set nav bar background       |
| `setButtonStyleAsync('light' \| 'dark')`    | Set button color theme       |
| `getVisibilityAsync()`                      | Get current visibility state |
| `getBackgroundColorAsync()`                 | Get current background color |

## ✅ Implementation Checklist

- [x] Install `expo-navigation-bar` package
- [x] Import and use in screen component
- [x] Add Platform check for Android-only features
- [x] Implement cleanup in useEffect return
- [x] Test on Android device/emulator
- [ ] Optional: Add StatusBar control
- [ ] Optional: Configure per-screen behavior

---

**Note**: The edit details screen now hides system buttons automatically when opened, providing a distraction-free editing experience. The buttons reappear when you navigate away.
