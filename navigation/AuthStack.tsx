import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthStackParamList } from '../types'
import LoginScreen from '../screens/auth/login'
import RegisterScreen from '../screens/auth/register'
import ForgotPasswordScreen from '../screens/auth/forgotPassword'
import EmailVerificationScreen from '../screens/auth/emailVerification'
import ChangePasswordScreen from '../screens/auth/changePassword'

const Stack = createStackNavigator<AuthStackParamList>()

const AuthStack: React.FC = () => {
	return (
		<Stack.Navigator
			initialRouteName="Login"
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen
				name="Login"
				component={LoginScreen}
			/>
			<Stack.Screen
				name="Register"
				component={RegisterScreen}
			/>
			<Stack.Screen
				name="ForgotPassword"
				component={ForgotPasswordScreen}
			/>
			<Stack.Screen
				name="EmailVerification"
				component={EmailVerificationScreen}
			/>
			<Stack.Screen
				name="ChangePassword"
				component={ChangePasswordScreen}
			/>
		</Stack.Navigator>
	)
}

export default AuthStack
