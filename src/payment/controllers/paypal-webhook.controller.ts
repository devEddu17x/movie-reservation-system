// paypal-webhook.controller.ts
import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaypalWebHookService } from '../services/paypal-webhook.service';

@Controller('webhook/paypal')
export class PaypalWebhookController {
  constructor(private readonly paypalWebHookService: PaypalWebHookService) {}

  @Post()
  async webhookReceiver(@Req() req: Request, @Res() res: Response) {
    const result = await this.paypalWebHookService.handleWebhook(
      (req as any).rawBody,
      req.headers,
    );
    if (result.success) {
      res.status(HttpStatus.OK).send();
    } else {
      res.status(HttpStatus.BAD_REQUEST).send();
    }
  }
}
