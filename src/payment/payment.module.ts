import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { ReservationModule } from 'src/reservation/reservation.module';
import { SharedModule } from 'src/core/shared/shared.module';
import { RawBodyMiddleware } from 'src/core/shared/middlewares/raw-body.middleware';
import { PaypalWebhookController } from './controllers/paypal-webhook.controller';
import { HandleWebhooksEventsService } from './services/handle-webhooks-events.service';
import { PaypalWebHookService } from './services/paypal-webhook.service';

@Module({
  imports: [SharedModule, ReservationModule],
  controllers: [PaymentController, PaypalWebhookController],
  providers: [
    PaymentService,
    PaypalWebHookService,
    HandleWebhooksEventsService,
  ],
})
export class PaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({ path: 'webhook/paypal', method: RequestMethod.POST });
  }
}
