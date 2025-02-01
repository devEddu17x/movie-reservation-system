import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReservationService } from 'src/reservation/services/reservation.service';
import {
  CheckoutPaymentIntent,
  OrdersController,
  Client,
  Environment,
  AmountWithBreakdown,
  OrderRequest,
} from '@paypal/paypal-server-sdk';
@Injectable()
export class PaymentService {
  private readonly client: Client;
  private readonly ordersController: OrdersController;

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
    const body: OrderRequest = {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount,
        },
      ],
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
}
