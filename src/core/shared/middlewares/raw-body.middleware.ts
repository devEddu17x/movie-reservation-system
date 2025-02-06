import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // just for request with Content-Type 'application/json'
    bodyParser.raw({ type: 'application/json' })(req, res, () => {
      if (!Buffer.isBuffer(req.body)) {
        req.body = Buffer.from(JSON.stringify(req.body), 'utf-8');
      }
      (req as any).rawBody = req.body;
      next();
    });
  }
}
