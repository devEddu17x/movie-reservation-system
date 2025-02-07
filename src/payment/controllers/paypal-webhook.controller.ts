// paypal-webhook.controller.ts
import { Controller, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import crc32 from 'buffer-crc32';
import * as fs from 'fs/promises';
import fetch from 'node-fetch';

@Controller('webhook/paypal')
export class PaypalWebhookController {
  private readonly WEBHOOK_ID: string;
  private readonly CACHE_DIR = 'certs';
  private readonly logger = new Logger(PaypalWebhookController.name);

  constructor(private readonly configService: ConfigService) {
    this.WEBHOOK_ID = this.configService.get<string>('paypal.webhookId');
  }

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    console.log('inside handleWebhook');
    try {
      // Usar el rawBody proporcionado por el middleware
      const eventRaw: Buffer = (req as any).rawBody;
      const eventString = eventRaw.toString('utf-8');
      const data = JSON.parse(eventString);

      this.logger.log(`Headers recibidos: ${JSON.stringify(req.headers)}\n`);
      this.logger.log(`Evento parseado: ${JSON.stringify(data, null, 2)}\n`);
      this.logger.log(`Evento raw: ${eventString}\n`);

      const isSignatureValid = await this.verifySignature(
        eventRaw,
        req.headers,
      );

      if (isSignatureValid) {
        this.logger.log('La firma es válida.');
        // Procesa el evento según la lógica de negocio
        this.logger.log(`Evento recibido: ${JSON.stringify(data, null, 2)}`);
      } else {
        this.logger.error(
          `Firma no válida para el evento ${data?.id} ${req.headers['correlation-id']}`,
        );
      }

      return res.sendStatus(HttpStatus.OK);
    } catch (error) {
      console.log(error);
      this.logger.error(`Error procesando el webhook: ${error.message}`);
      return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async verifySignature(event: Buffer, headers: any): Promise<boolean> {
    const transmissionId = headers['paypal-transmission-id'];
    const timeStamp = headers['paypal-transmission-time'];
    const crc = parseInt('0x' + crc32(event).toString('hex'));
    const message = `${transmissionId}|${timeStamp}|${this.WEBHOOK_ID}|${crc}`;
    this.logger.log(`Mensaje firmado original: ${message}`);

    const certUrl: string = headers['paypal-cert-url'];
    const certPem = await this.downloadAndCache(certUrl);

    const signatureBuffer = Buffer.from(
      headers['paypal-transmission-sig'],
      'base64',
    );

    const verifier = crypto.createVerify('SHA256');
    verifier.update(message);

    return verifier.verify(certPem, signatureBuffer);
  }

  private async downloadAndCache(
    url: string,
    cacheKey?: string,
  ): Promise<string> {
    if (!cacheKey) {
      cacheKey = url.replace(/\W+/g, '-');
    }
    const filePath = `${this.CACHE_DIR}/${cacheKey}`;

    let cachedData: string | null = null;
    try {
      cachedData = await fs.readFile(filePath, 'utf-8');
    } catch (err) {
      cachedData = null;
    }
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(url);
    const data = await response.text();

    await fs.mkdir(this.CACHE_DIR, { recursive: true });
    await fs.writeFile(filePath, data);

    return data;
  }
}
