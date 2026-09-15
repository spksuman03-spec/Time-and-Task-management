import Notification from '../models/Notification.js';
import { emitToUser } from './socketService.js';

export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  link = '',
  workspace = null
}) => {
  try {
    // Avoid sending notification to self
    if (sender && sender.toString() === recipient.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      link,
      workspace
    });

    const populated = await Notification.findById(notification._id)
      .populate('sender', 'name email avatar');

    emitToUser(recipient, 'new_notification', populated);
    return populated;
  } catch (error) {
    console.error('[Notification Creation Error]', error);
  }
};
