import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReservationService } from 'src/reservation/services/reservation.service';
import {
  CheckoutPaymentIntent,
  OrdersController,
  Client,
  Environment,
  AmountWithBreakdown,
  OrderRequest,
  OrderApplicationContext,
} from '@paypal/paypal-server-sdk';
@Injectable()
export class PaymentService {
  private readonly client: Client;
  private readonly ordersController: OrdersController;
  private readonly RETURN_URL: string;

  constructor(
    private readonly configService: ConfigService,

    private readonly reservationService: ReservationService,
  ) {
    this.client = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: configService.get<string>('paypal.clientId'),
        oAuthClientSecret: configService.get<string>('paypal.clientSecret'),
      },
      environment: Environment[configService.get<string>('paypal.enviroment')],
    });

    this.ordersController = new OrdersController(this.client);
    this.RETURN_URL = configService.get<string>('paypal.returnUrl');
  }

  async createOrder(reservationId: string) {
    // reservation user was made
    const reservation =
      await this.reservationService.getReservation(reservationId);

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    const amount: AmountWithBreakdown = {
      currencyCode: 'USD',
      value: '' + reservation.totalPrice,
    };

    const applicationContext: OrderApplicationContext = {
      returnUrl: this.RETURN_URL,
    };

    const body: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          customId: reservationId,
          amount,
        },
      ],
      applicationContext,
    };
    try {
      const paypalApiResponse = await this.ordersController.ordersCreate({
        body,
        prefer: 'return=minimal',
      });

      const url = paypalApiResponse.result.links.find(
        (link) => link.rel === 'approve',
      );

      return { id: paypalApiResponse.result.id, url: url.href };
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong');
    }
  }

  async captureOrder(token: string) {
    try {
      const response = await this.ordersController.ordersCapture({
        id: token,
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to capture order', 500);
    }
  }
}
