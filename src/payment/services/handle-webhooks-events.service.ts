import { Injectable } from '@nestjs/common';
import { PaypalWebHookEvents } from '../enums/webhook.events.enum';
import { ReservationService } from 'src/reservation/services/reservation.service';

@Injectable()
export class HandleWebhooksEventsService {
  constructor(private readonly reservationService: ReservationService) {}
  async handleEvent(eventType: string, data: any) {
    switch (eventType) {
      case PaypalWebHookEvents.CAPTURE_COMPLETED:
        return await this.handleCaptureEvent(data.resource.custom_id);
      case PaypalWebHookEvents.CAPTURE_DENIED:
        return this.handleDeniedEvent();
      default:
        return;
    }
  }
  private async handleCaptureEvent(reservationId: string) {
    await this.reservationService.confirmReservation(reservationId);
  }
  private async handleDeniedEvent() {}
}
