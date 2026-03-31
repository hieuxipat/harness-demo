import { Router, Request, Response } from 'express';
import crypto from 'crypto';

export const webhookRoutes = Router();

const verifyHmac = (body: string, hmac: string): boolean => {
  const secret = process.env.SHOPIFY_API_SECRET || '';
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmac));
};

webhookRoutes.post('/', (req: Request, res: Response) => {
  const hmac = req.headers['x-shopify-hmac-sha256'] as string;
  const topic = req.headers['x-shopify-topic'] as string;

  if (!hmac || !verifyHmac(JSON.stringify(req.body), hmac)) {
    return res.status(401).json({ error: 'Invalid HMAC' });
  }

  // Respond quickly, process async
  res.status(200).json({ received: true });

  // Handle webhook topics
  switch (topic) {
    case 'app/uninstalled':
      // TODO: Cleanup shop data
      console.log('App uninstalled:', req.body);
      break;
    case 'customers/data_request':
      // TODO: Return customer data (GDPR)
      console.log('Customer data request:', req.body);
      break;
    case 'customers/redact':
      // TODO: Delete customer data (GDPR)
      console.log('Customer redact:', req.body);
      break;
    case 'shop/redact':
      // TODO: Delete shop data (GDPR)
      console.log('Shop redact:', req.body);
      break;
    default:
      console.log(`Unhandled webhook topic: ${topic}`);
  }
});
