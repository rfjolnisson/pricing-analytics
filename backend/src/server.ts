import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';
import pricingRouter from './routes/pricing';
import analyticsRouter from './routes/analytics';
import forecastRouter from './routes/forecast';
import departuresRouter from './routes/departures';

const app = express();
const PORT = process.env.PORT || 3013;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/forecast', forecastRouter);
app.use('/api/departures', departuresRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pricing Intelligence API running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   API endpoints: http://localhost:${PORT}/api/`);
});

