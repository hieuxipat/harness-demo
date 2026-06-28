import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      if (duration > 500 || res.statusCode > 302) {
        console.log(`Duration: ${duration}ms - Status: ${res.statusCode} - Request: ${req.method} ${req.originalUrl}`);
      }
    });
    next();
  }
}
