import { Router, Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics';

const router = Router();
const analyticsService = new AnalyticsService();

// GET /api/analytics/margins - Portfolio-wide margin stats
router.get('/margins', (req: Request, res: Response) => {
  try {
    const analytics = analyticsService.getMarginAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching margin analytics:', error);
    res.status(500).json({ error: 'Failed to fetch margin analytics' });
  }
});

// GET /api/analytics/trends - Trend data over time
router.get('/trends', (req: Request, res: Response) => {
  try {
    const { period = '12m' } = req.query;
    const trends = analyticsService.getTrendData(period as string);
    res.json(trends);
  } catch (error) {
    console.error('Error fetching trend data:', error);
    res.status(500).json({ error: 'Failed to fetch trend data' });
  }
});

// GET /api/analytics/outliers - Products with unusual pricing
router.get('/outliers', (req: Request, res: Response) => {
  try {
    const outliers = analyticsService.getOutliers();
    res.json(outliers);
  } catch (error) {
    console.error('Error fetching outliers:', error);
    res.status(500).json({ error: 'Failed to fetch outliers' });
  }
});

// GET /api/analytics/recent-changes - Recent price changes
router.get('/recent-changes', (req: Request, res: Response) => {
  try {
    const { limit = '20' } = req.query;
    const changes = analyticsService.getRecentChanges(parseInt(limit as string));
    res.json(changes);
  } catch (error) {
    console.error('Error fetching recent changes:', error);
    res.status(500).json({ error: 'Failed to fetch recent changes' });
  }
});

export default router;

