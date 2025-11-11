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
import { useCustomerNavigation } from '../../../hooks/useNavigation'
import { createCustomerNotificationsStyles } from '../../../styles/customer'
import { DynamicKeyboardView } from '../../../components'
import {
	notificationApi,
	orderApi,
	type Notification,
} from '../../../services/api'
import { AlertModal, ConfirmationModal } from '../../../components/modals'

const NotificationsScreen: React.FC = () => {
	const { colors } = useThemeContext()
	const { user } = useAuthContext()
	const responsive = useResponsiveDimensions()
	const navigation = useCustomerNavigation()
	const styles = createCustomerNotificationsStyles(colors, responsive)

	const [notifications, setNotifications] = useState<Notification[]>([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [deletingNotificationId, setDeletingNotificationId] = useState<
		number | null
	>(null)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
	const [showAlert, setShowAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')

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

	const handleDeleteNotification = async (notificationId: number) => {
		try {
			const response = await notificationApi.deleteNotification(notificationId)
			if (response.success) {
				setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
			}
		} catch (err) {
			console.error('Delete notification error:', err)
		} finally {
			setDeletingNotificationId(null)
			setShowDeleteConfirm(false)
		}
	}

	const handleArchiveReadNotifications = async () => {
		if (!user?.id) return

		try {
			const response = await notificationApi.deleteReadNotifications(user.id)
			if (response.success) {
				setNotifications((prev) => prev.filter((n) => !n.isRead))
				setAlertMessage(
					`${response.deletedCount || 0} read notifications archived`
				)
				setShowAlert(true)
			}
		} catch (err) {
			console.error('Archive read notifications error:', err)
		} finally {
			setShowArchiveConfirm(false)
		}
	}

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
			setNotifications((prev) =>
				prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
			)
		}

		// Navigate to related order if exists
		if (notification.relatedOrderId) {
			try {
				// Check if order still exists
				const orderResponse = await orderApi.getOrderDetails(
					notification.relatedOrderId
				)
				if (!orderResponse.success || !orderResponse.order) {
					setAlertMessage('This order no longer exists')
					setShowAlert(true)
					return
				}

				navigation.navigate('OrderDetails', {
					orderId: notification.relatedOrderId,
				})
			} catch (err) {
				console.error('Check order existence error:', err)
				setAlertMessage('Unable to open order')
				setShowAlert(true)
			}
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
			case 'order_confirmed':
				return 'check-circle'
			case 'order_ready':
				return 'bell-check'
			case 'order_declined':
				return 'close-circle'
			case 'order_cancelled':
				return 'cancel'
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

			{/* Delete Button */}
			<TouchableOpacity
				style={styles.deleteButton}
				onPress={(e) => {
					e.stopPropagation()
					setDeletingNotificationId(item.id)
					setShowDeleteConfirm(true)
				}}
				disabled={deletingNotificationId === item.id}>
				{deletingNotificationId === item.id ? (
					<ActivityIndicator size="small" color={colors.error} />
				) : (
					<MaterialCommunityIcons
						name="delete-outline"
						size={20}
						color={colors.error}
					/>
				)}
			</TouchableOpacity>
		</TouchableOpacity>
	)

	if (loading) {
		return (
			<DynamicKeyboardView style={styles.container}>
				<View style={styles.centerContainer}>
					<ActivityIndicator size="large" color={colors.primary} />
					<Text style={styles.loadingText}>Loading notifications...</Text>
				</View>
			</DynamicKeyboardView>
		)
	}

	const unreadCount = notifications.filter((n) => !n.isRead).length
	const readCount = notifications.filter((n) => n.isRead).length

	return (
		<DynamicKeyboardView style={styles.container}>
			{/* Custom Header */}
			<View style={styles.screenHeader}>
				<Text style={styles.screenTitle}>Notifications</Text>
				{readCount > 0 && (
					<TouchableOpacity
						style={styles.archiveButton}
						onPress={() => setShowArchiveConfirm(true)}>
						<MaterialCommunityIcons
							name="archive-outline"
							size={20}
							color={colors.primary}
						/>
						<Text style={styles.archiveButtonText}>Archive Read</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Unread Header */}
			{unreadCount > 0 && (
				<View style={styles.unreadHeader}>
					<Text style={styles.unreadHeaderText}>{unreadCount} unread</Text>
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
						You'll see order updates here
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

			{/* Modals */}
			<ConfirmationModal
				visible={showDeleteConfirm}
				onClose={() => {
					setShowDeleteConfirm(false)
					setDeletingNotificationId(null)
				}}
				title="Delete Notification"
				message="Are you sure you want to delete this notification?"
				onConfirm={() => {
					if (deletingNotificationId) {
						void handleDeleteNotification(deletingNotificationId)
					}
				}}
				onCancel={() => {
					setShowDeleteConfirm(false)
					setDeletingNotificationId(null)
				}}
				confirmText="Delete"
				cancelText="Cancel"
			/>

			<ConfirmationModal
				visible={showArchiveConfirm}
				onClose={() => setShowArchiveConfirm(false)}
				title="Archive Read Notifications"
				message={`Archive all ${readCount} read notifications?`}
				onConfirm={() => void handleArchiveReadNotifications()}
				onCancel={() => setShowArchiveConfirm(false)}
				confirmText="Archive"
				cancelText="Cancel"
			/>

			<AlertModal
				visible={showAlert}
				title="Notification"
				message={alertMessage}
				onClose={() => setShowAlert(false)}
			/>
		</DynamicKeyboardView>
	)
}

export default NotificationsScreen
