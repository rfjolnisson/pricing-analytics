import { Router, Request, Response } from 'express';
import { DataStore } from '../services/dataStore';
import { PriceVersion } from '../types';

const router = Router();
const dataStore = new DataStore();

// GET /api/pricing/versions - Get filtered pricing versions
router.get('/versions', (req: Request, res: Response) => {
  try {
    const { productId, startDate, endDate } = req.query;
    
    const versions = dataStore.getPricingVersionsFiltered(
      productId as string | undefined,
      startDate as string | undefined,
      endDate as string | undefined
    );
    
    res.json(versions);
  } catch (error) {
    console.error('Error fetching pricing versions:', error);
    res.status(500).json({ error: 'Failed to fetch pricing versions' });
  }
});

// POST /api/pricing/snapshot - Create new price version
router.post('/snapshot', (req: Request, res: Response) => {
  try {
    const version: PriceVersion = req.body;
    
    // Basic validation
    if (!version.productId || !version.basePrice) {
      return res.status(400).json({ error: 'Invalid price version data' });
    }
    
    dataStore.addPriceVersion(version);
    res.status(201).json(version);
  } catch (error) {
    console.error('Error creating price snapshot:', error);
    res.status(500).json({ error: 'Failed to create price snapshot' });
  }
});

export default router;

