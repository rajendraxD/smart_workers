import { sendEmail } from "./emailService.js";
import { logger } from "../config/logger.js";
import NotificationModel from "../models/NotificationModel.js";

/**
 * Create an in-app notification and optionally send an email.
 */
export async function notify({
  userId,
  event,
  title,
  message,
  metadata = {},
  email = null,
}) {
  try {
    await NotificationModel.create({ userId, event, title, message, metadata });

    if (email && email.to) {
      try {
        await sendEmail(email);
      } catch (emailErr) {
        logger.error(`Email notification failed: ${emailErr.message}`);
      }
    }
  } catch (err) {
    logger.error(`Notification failed (${event}): ${err.message}`);
  }
}
