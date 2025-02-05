import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Aplica express.raw solo para peticiones con Content-Type 'application/json'
    bodyParser.raw({ type: 'application/json' })(req, res, () => {
      // Una vez procesado, guarda el raw body en req.rawBody
      (req as any).rawBody = req.body;
      next();
    });
  }
}
