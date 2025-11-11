import express from 'express'
import {
	getNotifications,
	markAsRead,
	markAllAsRead,
	deleteNotification,
	deleteReadNotifications,
} from '../backend/notification'

const router = express.Router()

router.get('/user/:userId', getNotifications)
router.put('/read/:notificationId', markAsRead)
router.put('/read-all/:userId', markAllAsRead)
router.delete('/:notificationId', deleteNotification)
router.delete('/read-all/:userId', deleteReadNotifications)

export default router
