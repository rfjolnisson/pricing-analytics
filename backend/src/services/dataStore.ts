import * as fs from 'fs';
import * as path from 'path';
import { Product, PriceVersion, Season, Departure } from '../types';
import { products, seasons, generatePricingVersions, generateDepartures } from '../data/seed';

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
function initializeDataFiles() {
  const productsPath = path.join(DATA_DIR, 'products.json');
  const versionsPath = path.join(DATA_DIR, 'pricing-versions.json');
  const seasonsPath = path.join(DATA_DIR, 'seasons.json');
  const departuresPath = path.join(DATA_DIR, 'departures.json');

  if (!fs.existsSync(productsPath)) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  }

  if (!fs.existsSync(seasonsPath)) {
    fs.writeFileSync(seasonsPath, JSON.stringify(seasons, null, 2));
  }

  if (!fs.existsSync(versionsPath)) {
    const versions = generatePricingVersions();
    fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2));
  }

  if (!fs.existsSync(departuresPath)) {
    const departures = generateDepartures();
    fs.writeFileSync(departuresPath, JSON.stringify(departures, null, 2));
  }
}

// Initialize on module load
initializeDataFiles();

export class DataStore {
  private productsPath: string;
  private versionsPath: string;
  private seasonsPath: string;
  private departuresPath: string;

  constructor() {
    this.productsPath = path.join(DATA_DIR, 'products.json');
    this.versionsPath = path.join(DATA_DIR, 'pricing-versions.json');
    this.seasonsPath = path.join(DATA_DIR, 'seasons.json');
    this.departuresPath = path.join(DATA_DIR, 'departures.json');
  }

  // Products
  getAllProducts(): Product[] {
    const data = fs.readFileSync(this.productsPath, 'utf-8');
    return JSON.parse(data);
  }

  getProductById(id: string): Product | null {
    const products = this.getAllProducts();
    return products.find(p => p.id === id) || null;
  }

  // Pricing Versions
  getAllPricingVersions(): PriceVersion[] {
    const data = fs.readFileSync(this.versionsPath, 'utf-8');
    return JSON.parse(data);
  }

  getPricingVersionsByProduct(productId: string): PriceVersion[] {
    const versions = this.getAllPricingVersions();
    return versions.filter(v => v.productId === productId)
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  }

  getPricingVersionsFiltered(productId?: string, startDate?: string, endDate?: string): PriceVersion[] {
    let versions = this.getAllPricingVersions();

    if (productId) {
      versions = versions.filter(v => v.productId === productId);
    }

    if (startDate) {
      versions = versions.filter(v => new Date(v.effectiveDate) >= new Date(startDate));
    }

    if (endDate) {
      versions = versions.filter(v => new Date(v.effectiveDate) <= new Date(endDate));
    }

    return versions.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());
  }

  addPriceVersion(version: PriceVersion): void {
    const versions = this.getAllPricingVersions();
    versions.unshift(version);
    fs.writeFileSync(this.versionsPath, JSON.stringify(versions, null, 2));
  }

  // Seasons
  getAllSeasons(): Season[] {
    const data = fs.readFileSync(this.seasonsPath, 'utf-8');
    return JSON.parse(data);
  }

  // Departures
  getAllDepartures(): Departure[] {
    const data = fs.readFileSync(this.departuresPath, 'utf-8');
    return JSON.parse(data);
  }

  getDeparturesByProduct(productId: string): Departure[] {
    const departures = this.getAllDepartures();
    return departures.filter(d => d.productId === productId)
      .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
  }

  getDeparturesBySeason(productId: string, season: string): Departure[] {
    const departures = this.getDeparturesByProduct(productId);
    return departures.filter(d => d.season === season);
  }

  getDepartureById(id: string): Departure | null {
    const departures = this.getAllDepartures();
    return departures.find(d => d.id === id) || null;
  }
}

