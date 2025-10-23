import { Router, Request, Response } from 'express';
import { DataStore } from '../services/dataStore';

const router = Router();
const dataStore = new DataStore();

// GET /api/products - List all products
router.get('/', (req: Request, res: Response) => {
  try {
    const products = dataStore.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req: Request, res: Response) => {
  try {
    const product = dataStore.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET /api/products/:id/versions - Get price history for product
router.get('/:id/versions', (req: Request, res: Response) => {
  try {
    const versions = dataStore.getPricingVersionsByProduct(req.params.id);
    res.json(versions);
  } catch (error) {
    console.error('Error fetching versions:', error);
    res.status(500).json({ error: 'Failed to fetch price versions' });
  }
});

export default router;

