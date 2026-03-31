import { Router } from 'express';
import { exampleRoutes } from './example.routes';

export const router = Router();

router.use('/examples', exampleRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
