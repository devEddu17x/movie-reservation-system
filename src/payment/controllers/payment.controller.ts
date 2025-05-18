import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { UseUserGuard } from 'src/core/shared/decorators/protected.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @UseUserGuard()
  @Post(':reservation_id')
  async payWithPaypal(
    @Param('reservation_id', ParseUUIDPipe) reservationId: string,
  ) {
    const orderPaymentUrl =
      await this.paymentService.createOrder(reservationId);
    if (!orderPaymentUrl) {
      throw new HttpException('Something went wrong', 500);
    }

    return {
      message: 'Url to pay with paypal',
      orderPaymentUrl,
    };
  }

  @Get('return')
  async returnFromPaypal(@Query('token') token: string) {
    const transactionCaptureResult =
      await this.paymentService.captureOrder(token);
    if (!transactionCaptureResult) {
      throw new HttpException('Something went wrong', 500);
    }

    return {
      message: 'Payment status',
      paymentStatus: transactionCaptureResult,
    };
  }
}
