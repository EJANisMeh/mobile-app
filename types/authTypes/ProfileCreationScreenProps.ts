import { StackNavigationProp } from '@react-navigation/stack'
import { RouteProp } from '@react-navigation/native'
import { AuthStackParamList } from '../navigation'

export type ProfileCreationScreenNavigationProp = StackNavigationProp<
	AuthStackParamList,
	'ProfileCreation'
>

export type ProfileCreationScreenRouteProp = RouteProp<
	AuthStackParamList,
	'ProfileCreation'
>

export interface ProfileCreationScreenProps {
	navigation: ProfileCreationScreenNavigationProp
	route: ProfileCreationScreenRouteProp
}
