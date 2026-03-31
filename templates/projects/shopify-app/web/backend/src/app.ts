import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { webhookRoutes } from './routes/webhooks';
import { shopifyService } from './services/shopify';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/webhooks', webhookRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

export { app };
