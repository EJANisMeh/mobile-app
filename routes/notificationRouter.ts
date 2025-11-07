import express from 'express'
import {
	getNotifications,
	markAsRead,
	markAllAsRead,
} from '../backend/notification'

const router = express.Router()

router.get('/user/:userId', getNotifications)
router.put('/read/:notificationId', markAsRead)
router.put('/read-all/:userId', markAllAsRead)

export default router
