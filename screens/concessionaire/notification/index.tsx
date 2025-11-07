import React, { useState, useCallback } from 'react'
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	RefreshControl,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useThemeContext, useAuthContext } from '../../../context'
import { useResponsiveDimensions } from '../../../hooks'
import { useConcessionaireNavigation } from '../../../hooks/useNavigation'
import { createConcessionaireNotificationsStyles } from '../../../styles/concessionaire'
import { DynamicKeyboardView } from '../../../components'
import { notificationApi, type Notification } from '../../../services/api'

const NotificationsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const responsive = useResponsiveDimensions()
	const navigation = useConcessionaireNavigation()
	const styles = createConcessionaireNotificationsStyles(colors, responsive)

	const [notifications, setNotifications] = useState<Notification[]>([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const loadNotifications = useCallback(async () => {
		if (!user?.id) {
			setNotifications([])
			setLoading(false)
			return
		}

		try {
			const response = await notificationApi.getNotifications(user.id)
			if (response.success && response.notifications) {
				setNotifications(response.notifications)
				setError(null)
			} else {
				setError(response.error || 'Failed to load notifications')
			}
		} catch (err) {
			console.error('Load notifications error:', err)
			setError('Failed to load notifications')
		} finally {
			setLoading(false)
			setRefreshing(false)
		}
	}, [user?.id])

	useFocusEffect(
		useCallback(() => {
			void loadNotifications()
		}, [loadNotifications])
	)

	const handleRefresh = () => {
		setRefreshing(true)
		void loadNotifications()
	}

	const handleNotificationPress = async (notification: Notification) => {
		// Mark as read
		if (!notification.isRead) {
			await notificationApi.markAsRead(notification.id)
		}

		// Navigate to related order if exists
		if (notification.relatedOrderId) {
			navigation.navigate('OrderDetails', {
				orderId: notification.relatedOrderId,
			})
		}
	}

	const handleMarkAllAsRead = async () => {
		if (!user?.id) return

		try {
			await notificationApi.markAllAsRead(user.id)
			void loadNotifications()
		} catch (err) {
			console.error('Mark all as read error:', err)
		}
	}

	const formatDate = (date: Date) => {
		const now = new Date()
		const notifDate = new Date(date)
		const diffMs = now.getTime() - notifDate.getTime()
		const diffMins = Math.floor(diffMs / 60000)
		const diffHours = Math.floor(diffMs / 3600000)
		const diffDays = Math.floor(diffMs / 86400000)

		if (diffMins < 1) return 'Just now'
		if (diffMins < 60) return `${diffMins}m ago`
		if (diffHours < 24) return `${diffHours}h ago`
		if (diffDays < 7) return `${diffDays}d ago`

		return notifDate.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		})
	}

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'new_order':
				return 'bell-ring'
			case 'order_cancelled':
				return 'bell-cancel'
			default:
				return 'bell'
		}
	}

	const renderNotification = ({ item }: { item: Notification }) => (
		<TouchableOpacity
			style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
			onPress={() => void handleNotificationPress(item)}>
			<View style={styles.notificationIcon}>
				<MaterialCommunityIcons
					name={getNotificationIcon(item.type)}
					size={24}
					color={!item.isRead ? colors.primary : colors.textSecondary}
				/>
			</View>

			<View style={styles.notificationContent}>
				<Text
					style={[
						styles.notificationTitle,
						!item.isRead && styles.unreadTitle,
					]}>
					{item.title}
				</Text>
				<Text style={styles.notificationMessage}>{item.message}</Text>
				<Text style={styles.notificationTime}>
					{formatDate(item.createdAt)}
				</Text>
			</View>

			{!item.isRead && <View style={styles.unreadDot} />}
		</TouchableOpacity>
	)

	if (loading) {
		return (
			<DynamicKeyboardView style={styles.container}>
				<View style={styles.centerContainer}>
					<ActivityIndicator
						size="large"
						color={colors.primary}
					/>
					<Text style={styles.loadingText}>Loading notifications...</Text>
				</View>
			</DynamicKeyboardView>
		)
	}

	const unreadCount = notifications.filter((n) => !n.isRead).length

	return (
		<DynamicKeyboardView style={styles.container}>
			{/* Header */}
			{unreadCount > 0 && (
				<View style={styles.header}>
					<Text style={styles.headerText}>{unreadCount} unread</Text>
					<TouchableOpacity onPress={() => void handleMarkAllAsRead()}>
						<Text style={styles.markAllButton}>Mark all as read</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* Notifications List */}
			{error ? (
				<View style={styles.centerContainer}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			) : notifications.length === 0 ? (
				<View style={styles.centerContainer}>
					<MaterialCommunityIcons
						name="bell-off-outline"
						size={64}
						color={colors.textSecondary}
					/>
					<Text style={styles.emptyText}>No notifications yet</Text>
					<Text style={styles.emptySubtext}>
						You'll see new orders and updates here
					</Text>
				</View>
			) : (
				<FlatList
					data={notifications}
					renderItem={renderNotification}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={styles.listContent}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
							colors={[colors.primary]}
						/>
					}
				/>
			)}
		</DynamicKeyboardView>
	)
}

export default NotificationsScreen
