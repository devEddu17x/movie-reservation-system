import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import fetch from 'node-fetch';
import * as crypto from 'crypto';
import crc32 from 'buffer-crc32';
import { ConfigService } from '@nestjs/config';
import { WebhookResponseDTO } from '../dtos/webhook-response.dto';
import { HandleWebhooksEventsService } from './handle-webhooks-events.service';

@Injectable()
export class PaypalWebHookService {
  private readonly WEBHOOK_ID: string;
  private readonly CACHE_DIR = 'certs';
  private readonly logger = new Logger(PaypalWebHookService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly handlerWebhooksEventsService: HandleWebhooksEventsService,
  ) {
    this.WEBHOOK_ID = this.configService.get<string>('paypal.webhookId');
  }

  async handleWebhook(eventRaw: Buffer, headers): Promise<WebhookResponseDTO> {
    try {
      const eventString = eventRaw.toString('utf-8');
      const data = JSON.parse(eventString);

      const isSignatureValid = await this.verifySignature(eventRaw, headers);

      if (!isSignatureValid) {
        this.logger.error(
          `Signature is not valid for ${data?.id} ${headers['correlation-id']}`,
        );
        return {
          success: false,
          error: 'Error processing webhook',
        };
      }
      this.logger.log('Signature is valid.');
      await this.handlerWebhooksEventsService.handleEvent(
        data.event_type,
        data,
      );
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(`Error processing webhook: ${error.message}`);
    }
  }

  private async verifySignature(event: Buffer, headers: any): Promise<boolean> {
    const transmissionId = headers['paypal-transmission-id'];
    const timeStamp = headers['paypal-transmission-time'];
    const crc = parseInt('0x' + crc32(event).toString('hex'));
    const message = `${transmissionId}|${timeStamp}|${this.WEBHOOK_ID}|${crc}`;

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
