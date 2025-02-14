// paypal-webhook.controller.ts
import { Controller, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaypalWebHookService } from '../services/paypal-webhook.service';

@Controller('webhook/paypal')
export class PaypalWebhookController {
  private readonly logger = new Logger(PaypalWebhookController.name);
  constructor(private readonly paypalWebHookService: PaypalWebHookService) {}

  @Post()
  async webhookReceiver(@Req() req: Request, @Res() res: Response) {
    const result = await this.paypalWebHookService.handleWebhook(
      (req as any).rawBody,
      req.headers,
    );
    if (result.success) {
      this.logger.log('Webhook received and processed');
      res.status(HttpStatus.OK).send();
    } else {
      this.logger.error('Webhook processing failed');
      this.logger.error(result.error);
      res.status(HttpStatus.BAD_REQUEST).send();
    }
  }
}
