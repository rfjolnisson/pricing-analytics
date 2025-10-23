import { Router, Request, Response } from 'express';
import { DataStore } from '../services/dataStore';

const router = Router();
const dataStore = new DataStore();

// GET /api/departures - List all departures
router.get('/', (req: Request, res: Response) => {
  try {
    const { productId, season, status, bookingPace } = req.query;
    
    let departures = dataStore.getAllDepartures();
    
    // Filter by product
    if (productId) {
      departures = departures.filter(d => d.productId === productId);
    }
    
    // Filter by season
    if (season) {
      departures = departures.filter(d => d.season === season);
    }
    
    // Filter by status
    if (status) {
      departures = departures.filter(d => d.status === status);
    }
    
    // Filter by booking pace
    if (bookingPace) {
      departures = departures.filter(d => d.bookingPace === bookingPace);
    }
    
    res.json(departures);
  } catch (error) {
    console.error('Error fetching departures:', error);
    res.status(500).json({ error: 'Failed to fetch departures' });
  }
});

// GET /api/departures/:id - Get single departure
router.get('/:id', (req: Request, res: Response) => {
  try {
    const departure = dataStore.getDepartureById(req.params.id);
    if (!departure) {
      return res.status(404).json({ error: 'Departure not found' });
    }
    res.json(departure);
  } catch (error) {
    console.error('Error fetching departure:', error);
    res.status(500).json({ error: 'Failed to fetch departure' });
  }
});

// GET /api/departures/product/:productId - Get departures for a product
router.get('/product/:productId', (req: Request, res: Response) => {
  try {
    const { season } = req.query;
    
    let departures = dataStore.getDeparturesByProduct(req.params.productId);
    
    if (season) {
      departures = departures.filter(d => d.season === season);
    }
    
    res.json(departures);
  } catch (error) {
    console.error('Error fetching product departures:', error);
    res.status(500).json({ error: 'Failed to fetch product departures' });
  }
});

// GET /api/departures/season/:productId/:season - Get departures for product in specific season
router.get('/season/:productId/:season', (req: Request, res: Response) => {
  try {
    const departures = dataStore.getDeparturesBySeason(
      req.params.productId,
      decodeURIComponent(req.params.season)
    );
    res.json(departures);
  } catch (error) {
    console.error('Error fetching seasonal departures:', error);
    res.status(500).json({ error: 'Failed to fetch seasonal departures' });
  }
});

export default router;

