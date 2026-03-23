import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async notify(userId: string, title: string, message: string): Promise<void> {
    this.logger.log(`[Notification] To User ${userId}: ${title} - ${message}`);
    // In a real app, this would send an email, push notification, or trigger a webhook
  }
}
