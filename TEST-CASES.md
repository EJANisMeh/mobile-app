# Mobile App Test Cases

This document provides comprehensive manual testing procedures for all authentication features, navigation flows, theme system, and user role interactions.

## Prerequisites

1. **React Native Setup**: This app now uses React Native compatible authentication with in-memory storage
2. **Test Users**: Use the debug menu to seed test users:
   - customer1@example.com / password123 (Customer, Verified)
   - customer2@example.com / password123 (Customer, Verified)
   - concessionaire1@example.com / password123 (Concessionaire, Verified)
   - concessionaire2@example.com / password123 (Concessionaire, Verified)
   - unverified@test.com / password123 (Customer, Unverified)
3. **Note**: Authentication now uses simple hashing (demo purposes) and in-memory storage

## Authentication System Testing

### Test Case 1: User Registration

**Objective**: Verify new user registration works correctly

**Steps**:

1. Launch the app
2. Navigate to Register screen
3. Fill in all required fields:
   - First Name: "Test"
   - Last Name: "User"
   - Email: "newuser@test.com"
   - Password: "password123"
   - Confirm Password: "password123"
   - Role: Select "Customer"
4. Tap "Register" button
5. Verify email verification screen appears
6. Check console logs for successful user creation

**Expected Results**:

- Registration successful message appears
- User is redirected to email verification screen
- New user is created in database (unverified)
- No navigation errors occur

**Test Variations**:

- Try with existing email (should show error)
- Try with mismatched passwords (should show error)
- Try with invalid email format (should show error)
- Try with empty fields (should show validation errors)

### Test Case 2: User Login

**Objective**: Verify login functionality for different user types

**Steps**:

1. Launch the app
2. Navigate to Login screen
3. Enter test credentials:
   - Email: "customer1@example.com"
   - Password: "password123"
4. Tap "Login" button
5. Verify successful login and navigation to Customer screens

**Expected Results**:

- Login successful message appears
- User is authenticated and redirected to appropriate role screens
- Auth context is updated with user data
- Navigation stack changes to Customer stack

**Test Variations**:

- Test with concessionaire1@example.com (should go to Concessionaire screens)
- Test with unverified@test.com (should show email verification prompt)
- Test with wrong password (should show error)
- Test with non-existent email (should show error)

### Test Case 3: Email Verification Flow

**Objective**: Verify email verification process

**Steps**:

1. Register new user or login with unverified@test.com
2. Verify email verification screen appears
3. Test "Resend Verification" button
4. Test "Back to Login" button
5. Simulate email verification (mock in development)

**Expected Results**:

- Email verification screen shows appropriate messaging
- Resend button works (shows success message)
- Back to login navigates correctly
- Verified users can login normally

### Test Case 4: Logout Functionality

**Objective**: Verify logout works correctly

**Steps**:

1. Login with any test user
2. Navigate to Profile screen
3. Tap "Logout" button
4. Confirm logout in modal
5. Verify return to login screen

**Expected Results**:

- Logout confirmation modal appears
- User session is cleared from AsyncStorage
- Auth context is reset
- Navigation returns to Auth stack
- No authentication data remains

### Test Case 5: Auto-Logout on App Termination

**Objective**: Verify automatic logout when app is killed

**Steps**:

1. Login with any test user
2. Close app completely (swipe away from recent apps)
3. Wait a few seconds
4. Reopen the app
5. Verify user is logged out

**Expected Results**:

- App detects termination using timestamp check
- User is automatically logged out
- Login screen appears
- No stale authentication state

## Theme System Testing

### Test Case 6: Theme Toggle Functionality

**Objective**: Verify theme switching works across the app

**Steps**:

1. Login with any user
2. Access debug menu (if in development mode)
3. Toggle theme between light and dark
4. Navigate through different screens
5. Verify consistent theming

**Expected Results**:

- Theme changes immediately across all screens
- Colors update according to theme definition:
  - Light theme: white/red colors
  - Dark theme: black/red colors
- Theme preference is saved in AsyncStorage
- All components respect theme colors

**Test Variations**:

- Test theme persistence after app restart
- Verify all screens use themed styles
- Check custom modals use correct theme
- Ensure text contrast is maintained

## Navigation Testing

### Test Case 7: Customer Navigation Flow

**Objective**: Verify customer user can navigate all available screens

**Steps**:

1. Login as customer1@example.com
2. Verify Customer bottom tab navigation appears
3. Navigate to each tab:
   - Menu Screen
   - Cart Screen
   - Orders Screen
   - Notifications Screen
   - Profile Screen
4. Test navigation within each screen
5. Verify back navigation works correctly

**Expected Results**:

- Customer-specific navigation structure appears
- All customer screens are accessible
- Navigation state is maintained
- No unauthorized screens are accessible
- Back navigation works as expected

### Test Case 8: Concessionaire Navigation Flow

**Objective**: Verify concessionaire user can navigate all available screens

**Steps**:

1. Login as concessionaire1@example.com
2. Verify Concessionaire bottom tab navigation appears
3. Navigate to each tab:
   - Menu Screen (management)
   - Orders Screen
   - Concession Screen
   - Scan QR Screen
   - Notifications Screen
   - Profile Screen
4. Test navigation within each screen
5. Verify role-specific features are available

**Expected Results**:

- Concessionaire-specific navigation structure appears
- All concessionaire screens are accessible
- Role-specific functionality is available
- Customer screens are not accessible
- Navigation state is maintained correctly

### Test Case 9: Authentication State Navigation

**Objective**: Verify navigation changes based on authentication state

**Steps**:

1. Start with logged out state
2. Verify Auth stack is shown (Login/Register screens)
3. Login with any user
4. Verify appropriate role stack is shown
5. Logout and verify return to Auth stack
6. Test deep linking/navigation guards

**Expected Results**:

- Correct navigation stack is shown for each auth state
- No access to protected screens when logged out
- Role-based navigation is enforced
- Navigation state transitions smoothly

## Custom Modal System Testing

### Test Case 10: Modal Functionality

**Objective**: Verify custom modals work correctly across the app

**Steps**:

1. Navigate through app and trigger various modals:
   - Logout confirmation modal
   - Error message modals
   - Success message modals
   - Confirmation prompts
2. Test modal interactions:
   - Tap to dismiss
   - Button interactions
   - Modal overlay behavior
3. Verify modals use correct theme colors

**Expected Results**:

- All modals display correctly
- Modal interactions work as expected
- Modals use consistent theming
- No visual glitches or overlap issues
- Modals are accessible and user-friendly

## Database Integration Testing

### Test Case 11: In-Memory Storage Operations

**Objective**: Verify in-memory storage operations work correctly

**Steps**:

1. Use debug menu to seed test users
2. Register new user and verify in-memory creation
3. Login and verify user retrieval from memory
4. Test email verification status updates
5. Test user data updates (if implemented)

**Expected Results**:

- Test users are created successfully in memory
- User registration creates new in-memory records
- Login retrieves correct user data from memory
- Email verification status is properly managed
- All operations handle errors gracefully

### Test Case 12: Authentication Error Handling

**Objective**: Verify app handles authentication errors gracefully

**Steps**:

1. Test app behavior with invalid credentials
2. Test duplicate email registration
3. Test app restart (data should be cleared due to in-memory storage)
4. Verify error messages are user-friendly

**Expected Results**:

- App handles errors without crashes
- Appropriate error messages are shown to users
- App maintains stability during error conditions
- User experience remains smooth despite errors
- Data resets properly on app restart (expected behavior for in-memory storage)

## Performance and Edge Cases

### Test Case 13: App Performance

**Objective**: Verify app performance under normal conditions

**Steps**:

1. Test app startup time
2. Navigate between screens rapidly
3. Test multiple login/logout cycles
4. Monitor memory usage and performance
5. Test on different device orientations

**Expected Results**:

- App starts quickly and smoothly
- Navigation is responsive
- No memory leaks or performance degradation
- App works in both portrait and landscape modes
- Smooth animations and transitions

### Test Case 14: Edge Cases and Error Scenarios

**Objective**: Test app behavior in unusual scenarios

**Steps**:

1. Test with very long user names/emails
2. Test with special characters in inputs
3. Test rapid button tapping (double-tap protection)
4. Test network connectivity issues
5. Test app behavior during phone calls or interruptions

**Expected Results**:

- App handles edge cases gracefully
- Input validation prevents invalid data
- UI remains responsive under stress
- Network issues are handled appropriately
- App recovers well from interruptions

## Success Criteria

✅ **Authentication System**:

- All login/logout flows work correctly
- User registration and verification processes function
- Role-based authentication is enforced
- Auto-logout on app termination works
- In-memory storage for React Native compatibility

✅ **Navigation System**:

- Role-based navigation stacks work correctly
- All screens are accessible to appropriate users
- Navigation state management is reliable
- Back navigation and deep linking work

✅ **Theme System**:

- Theme toggle works across all screens
- Consistent theming is maintained
- Theme preferences are persisted
- All components respect theme colors

✅ **React Native Compatibility**:

- No Node.js dependencies causing bundling errors
- Simple authentication system works in React Native
- In-memory user storage functions correctly
- Password hashing works with React Native compatible functions

✅ **User Experience**:

- Custom modals work consistently
- Error messages are clear and helpful
- App performance is smooth
- Edge cases are handled gracefully

## Troubleshooting Common Issues

**Issue**: React Native bundling errors with Node.js modules
**Solution**: Use React Native compatible libraries, avoid server-side packages like bcryptjs, jsonwebtoken, @prisma/client

**Issue**: Authentication data not persisting between app sessions
**Solution**: This is expected behavior with in-memory storage. Data resets on app restart.

**Issue**: TypeScript compilation errors
**Solution**: Run `npx tsc --noEmit` to check for type issues

**Issue**: Navigation errors
**Solution**: Verify screen names match navigation type definitions

**Issue**: Theme not applying correctly
**Solution**: Check that components use themed styles from context

**Issue**: Authentication state not persisting during app session
**Solution**: Verify AsyncStorage is working correctly for session data

## Development Tools

- **Debug Menu**: Access via long press on app title (development only)
- **Test Users**: Use "Seed Test Users" in debug menu to populate in-memory storage
- **Theme Toggle**: Available in debug menu for testing
- **In-Memory Storage**: User data resets on app restart (expected behavior)
- **TypeScript Check**: Run `npx tsc --noEmit` for type checking
- **App Testing**: Run `npm start` to start Expo development server
