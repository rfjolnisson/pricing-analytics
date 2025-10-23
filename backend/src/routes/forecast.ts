import { Router, Request, Response } from 'express';
import { ForecastingService } from '../services/forecasting';

const router = Router();
const forecastingService = new ForecastingService();

// GET /api/forecast/:productId - Get price suggestions for product
router.get('/:productId', (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { season } = req.query;
    
    const forecast = forecastingService.getForecast(productId, season as string | undefined);
    
    if (!forecast) {
      return res.status(404).json({ error: 'Forecast not available for this product' });
    }
    
    res.json(forecast);
  } catch (error) {
    console.error('Error generating forecast:', error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

// GET /api/forecast/patterns/:productId - Get historical patterns
router.get('/patterns/:productId', (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const patterns = forecastingService.getHistoricalPatterns(productId);
    res.json(patterns);
  } catch (error) {
    console.error('Error fetching patterns:', error);
    res.status(500).json({ error: 'Failed to fetch historical patterns' });
  }
});

export default router;

