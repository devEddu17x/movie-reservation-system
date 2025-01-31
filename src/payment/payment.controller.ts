import {
  Controller,
  HttpException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(':id')
  async payWithPaypal(@Param('id', ParseUUIDPipe) id: string) {
    const orderPaymentUrl = await this.paymentService.createOrder(id);
    if (!orderPaymentUrl) {
      throw new HttpException('Something went wrong', 500);
    }

    return {
      message: 'Url to pay with paypal',
      orderPaymentUrl,
    };
  }
}
