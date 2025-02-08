import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':id')
  async payWithPaypal(@Param('id', ParseUUIDPipe) reservationId: string) {
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
    console.log('inside returnFromPaypal');
    console.log('token\n', token);
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
