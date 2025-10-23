export interface PriceComponent {
  type: 'base' | 'singleSupplement' | 'childDiscount' | 'earlyBooking' | 'groupRate' | 'extension';
  name: string;
  value: number;
  isPercentage: boolean;
  description?: string;
}

export interface PriceVersion {
  id: string;
  productId: string;
  departureId?: string; // Optional: specific departure or season-wide
  effectiveDate: string;
  basePrice: number;
  components: PriceComponent[];
  totalPrice: number;
  costBasis: number;
  marginPercent: number;
  season: string;
  reasonCode: string;
  changedBy: string;
  notes?: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  region: 'South America' | 'Africa' | 'Europe' | 'Asia/Pacific';
  category: string;
  duration: number;
  currentPrice: number;
  currentMargin: number;
  targetMargin: number;
  costBasis: number;
  imageUrl: string;
  lastUpdated: string;
  typicalCapacity: number; // typical group size
  minCapacity?: number;
  maxCapacity?: number;
}

export interface Departure {
  id: string;
  productId: string;
  departureDate: string;
  returnDate: string;
  season: string;
  capacity: number;
  bookings: number;
  currentPrice: number;
  costBasis: number;
  marginPercent: number;
  status: 'open' | 'nearly_full' | 'sold_out' | 'cancelled';
  bookingPace: 'fast' | 'normal' | 'slow' | 'stalled';
  daysUntilDeparture: number;
  bookingVelocity: number; // bookings per day
  occupancyRate: number; // percentage
  revenuePerAvailableSeat: number;
  lastBookingDate?: string;
  openedForBookingDate: string;
}

export interface Season {
  id: string;
  name: string;
  startMonth: number;
  endMonth: number;
  type: 'high' | 'shoulder' | 'low';
  description: string;
}

export interface MarginAnalytics {
  averageMargin: number;
  yoyDelta: number;
  totalProducts: number;
  belowTarget: number;
  revenueOpportunity: number;
}

export interface TrendDataPoint {
  date: string;
  margin: number;
  priceChanges: number;
}

export interface ForecastSuggestion {
  productId: string;
  departureId?: string;
  season: string;
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  expectedMargin: number;
  confidence: number;
  reasoning: string;
  historicalData: {
    year: number;
    price: number;
    margin: number;
    occupancy?: number;
  }[];
  demandSignal?: 'high' | 'normal' | 'low';
  pricingAction?: string;
}

export interface SeasonalInventory {
  productId: string;
  season: string;
  totalCapacity: number;
  totalBookings: number;
  occupancyRate: number;
  averagePrice: number;
  weightedMargin: number;
  departureCount: number;
  revenue: number;
  revPAS: number; // Revenue per Available Seat
}

