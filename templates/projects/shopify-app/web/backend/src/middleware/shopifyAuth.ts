import { Request, Response, NextFunction } from 'express';

export const verifyShopifySession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  // TODO: Verify Shopify session token
  // const sessionToken = authHeader.replace('Bearer ', '');
  // const payload = await shopify.session.decodeSessionToken(sessionToken);

  next();
};
