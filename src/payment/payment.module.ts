import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './payment.service';
import { ReservationModule } from 'src/reservation/reservation.module';
import { SharedModule } from 'src/core/shared/shared.module';

@Module({
  imports: [SharedModule, ReservationModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
