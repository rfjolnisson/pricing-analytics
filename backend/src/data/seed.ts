import { Product, PriceVersion, Season, PriceComponent, Departure } from '../types';
import { addDays, subMonths, addMonths, format, differenceInDays, parseISO } from 'date-fns';

// Season definitions
export const seasons: Season[] = [
  { id: 's1', name: 'Winter (Jan-Mar)', startMonth: 1, endMonth: 3, type: 'shoulder', description: 'Post-holiday travel period' },
  { id: 's2', name: 'Spring (Apr-Jun)', startMonth: 4, endMonth: 6, type: 'high', description: 'Peak European season' },
  { id: 's3', name: 'Summer (Jul-Sep)', startMonth: 7, endMonth: 9, type: 'high', description: 'Peak travel season worldwide' },
  { id: 's4', name: 'Fall (Oct-Dec)', startMonth: 10, endMonth: 12, type: 'shoulder', description: 'Autumn colors and holiday prep' }
];

// Mock products based on real tour operator offerings
export const products: Product[] = [
  // South America (8 products)
  {
    id: 'p001',
    name: 'Galapagos Islands: Classic 8-Day Cruise',
    code: 'GAL-CLASSIC-8',
    description: 'Explore the enchanted islands aboard our first-class yacht with naturalist guides',
    region: 'South America',
    category: 'Cruise',
    duration: 8,
    currentPrice: 5200,
    currentMargin: 24.5,
    targetMargin: 28.0,
    costBasis: 3926,
    imageUrl: '/images/galapagos.jpg',
    lastUpdated: '2024-10-15',
    typicalCapacity: 16,
    minCapacity: 12,
    maxCapacity: 16
  },
  {
    id: 'p002',
    name: 'Patagonia Adventure: Torres del Paine Trek',
    code: 'PAT-TREK-10',
    description: 'Ultimate hiking experience through Chilean Patagonia with W Circuit',
    region: 'South America',
    category: 'Trekking',
    duration: 10,
    currentPrice: 4800,
    currentMargin: 32.5,
    targetMargin: 30.0,
    costBasis: 3240,
    imageUrl: '/images/patagonia.jpg',
    lastUpdated: '2024-09-20'
  },
  {
    id: 'p003',
    name: 'Machu Picchu & Sacred Valley Explorer',
    code: 'PERU-MP-7',
    description: 'Cultural journey through Inca heritage sites with luxury accommodations',
    region: 'South America',
    category: 'Cultural',
    duration: 7,
    currentPrice: 3200,
    currentMargin: 28.8,
    targetMargin: 28.0,
    costBasis: 2278,
    imageUrl: '/images/machu-picchu.jpg',
    lastUpdated: '2024-10-01'
  },
  {
    id: 'p004',
    name: 'Argentina Wine Country & Buenos Aires',
    code: 'ARG-WINE-9',
    description: 'Mendoza vineyards and vibrant Buenos Aires culture',
    region: 'South America',
    category: 'Wine & Culinary',
    duration: 9,
    currentPrice: 3800,
    currentMargin: 31.2,
    targetMargin: 30.0,
    costBasis: 2614,
    imageUrl: '/images/argentina-wine.jpg',
    lastUpdated: '2024-08-12'
  },
  {
    id: 'p005',
    name: 'Amazon Rainforest Lodge Experience',
    code: 'AMAZ-LODGE-6',
    description: 'Eco-lodge stay with jungle excursions and wildlife spotting',
    region: 'South America',
    category: 'Nature & Wildlife',
    duration: 6,
    currentPrice: 2900,
    currentMargin: 26.5,
    targetMargin: 28.0,
    costBasis: 2132,
    imageUrl: '/images/amazon.jpg',
    lastUpdated: '2024-09-05'
  },
  {
    id: 'p006',
    name: 'Iguazu Falls & Brazilian Coastline',
    code: 'BRA-IGUAZU-8',
    description: 'Natural wonder of Iguazu Falls and Rio de Janeiro beaches',
    region: 'South America',
    category: 'Nature & Beach',
    duration: 8,
    currentPrice: 3600,
    currentMargin: 27.8,
    targetMargin: 28.0,
    costBasis: 2599,
    imageUrl: '/images/iguazu.jpg',
    lastUpdated: '2024-07-18'
  },
  {
    id: 'p007',
    name: 'Colombian Coffee Triangle Discovery',
    code: 'COL-COFFEE-7',
    description: 'Coffee plantation tours and colonial town exploration',
    region: 'South America',
    category: 'Cultural & Culinary',
    duration: 7,
    currentPrice: 2800,
    currentMargin: 29.6,
    targetMargin: 28.0,
    costBasis: 1971,
    imageUrl: '/images/colombia-coffee.jpg',
    lastUpdated: '2024-08-30'
  },
  {
    id: 'p008',
    name: 'Galapagos Islands: Luxury 11-Day Expedition',
    code: 'GAL-LUX-11',
    description: 'Extended cruise with premium accommodations and exclusive landing sites',
    region: 'South America',
    category: 'Cruise',
    duration: 11,
    currentPrice: 7800,
    currentMargin: 26.2,
    targetMargin: 28.0,
    costBasis: 5756,
    imageUrl: '/images/galapagos-luxury.jpg',
    lastUpdated: '2024-10-10'
  },

  // Africa (6 products)
  {
    id: 'p009',
    name: 'Kenya Safari: Masai Mara & Amboseli',
    code: 'KEN-SAFARI-10',
    description: 'Classic safari with great migration viewing and luxury tented camps',
    region: 'Africa',
    category: 'Safari',
    duration: 10,
    currentPrice: 6200,
    currentMargin: 22.8,
    targetMargin: 28.0,
    costBasis: 4787,
    imageUrl: '/images/kenya-safari.jpg',
    lastUpdated: '2024-09-25'
  },
  {
    id: 'p010',
    name: 'Tanzania: Serengeti & Ngorongoro Crater',
    code: 'TAN-SEREN-9',
    description: 'Wildlife spectacle with crater floor game drives',
    region: 'Africa',
    category: 'Safari',
    duration: 9,
    currentPrice: 5800,
    currentMargin: 24.1,
    targetMargin: 28.0,
    costBasis: 4402,
    imageUrl: '/images/tanzania.jpg',
    lastUpdated: '2024-10-05'
  },
  {
    id: 'p011',
    name: 'South Africa: Cape Town & Garden Route',
    code: 'SA-CAPE-12',
    description: 'Table Mountain, wine country, and coastal scenic drives',
    region: 'Africa',
    category: 'Adventure & Wine',
    duration: 12,
    currentPrice: 4900,
    currentMargin: 30.2,
    targetMargin: 30.0,
    costBasis: 3420,
    imageUrl: '/images/south-africa.jpg',
    lastUpdated: '2024-08-20'
  },
  {
    id: 'p012',
    name: 'Botswana: Okavango Delta Luxury Safari',
    code: 'BOT-OKAV-8',
    description: 'Exclusive mokoro excursions and premium lodge experiences',
    region: 'Africa',
    category: 'Safari',
    duration: 8,
    currentPrice: 8900,
    currentMargin: 25.6,
    targetMargin: 28.0,
    costBasis: 6622,
    imageUrl: '/images/botswana.jpg',
    lastUpdated: '2024-09-10'
  },
  {
    id: 'p013',
    name: 'Morocco: Imperial Cities & Sahara',
    code: 'MOR-IMP-10',
    description: 'Medinas, kasbahs, and desert camp under the stars',
    region: 'Africa',
    category: 'Cultural',
    duration: 10,
    currentPrice: 3800,
    currentMargin: 31.6,
    targetMargin: 30.0,
    costBasis: 2599,
    imageUrl: '/images/morocco.jpg',
    lastUpdated: '2024-07-28'
  },
  {
    id: 'p014',
    name: 'Uganda Gorilla Trekking Adventure',
    code: 'UGA-GOR-7',
    description: 'Mountain gorilla encounters in Bwindi Impenetrable Forest',
    region: 'Africa',
    category: 'Wildlife',
    duration: 7,
    currentPrice: 7200,
    currentMargin: 23.6,
    targetMargin: 28.0,
    costBasis: 5501,
    imageUrl: '/images/uganda.jpg',
    lastUpdated: '2024-09-15'
  },

  // Europe (8 products)
  {
    id: 'p015',
    name: 'Danube River Cruise: Budapest to Vienna',
    code: 'EUR-DAN-8',
    description: 'Scenic river cruise through Central European capitals',
    region: 'Europe',
    category: 'River Cruise',
    duration: 8,
    currentPrice: 4200,
    currentMargin: 29.5,
    targetMargin: 28.0,
    costBasis: 2961,
    imageUrl: '/images/danube.jpg',
    lastUpdated: '2024-10-12'
  },
  {
    id: 'p016',
    name: 'Rhine Valley: Castles & Wine Villages',
    code: 'EUR-RHINE-7',
    description: 'Medieval castles and Riesling wine region exploration',
    region: 'Europe',
    category: 'River Cruise',
    duration: 7,
    currentPrice: 3900,
    currentMargin: 28.2,
    targetMargin: 28.0,
    costBasis: 2800,
    imageUrl: '/images/rhine.jpg',
    lastUpdated: '2024-09-18'
  },
  {
    id: 'p017',
    name: 'Mediterranean Highlights: Spain, France & Italy',
    code: 'EUR-MED-14',
    description: 'Barcelona, Provence, and Italian Riviera coastal journey',
    region: 'Europe',
    category: 'Multi-Country',
    duration: 14,
    currentPrice: 5600,
    currentMargin: 32.1,
    targetMargin: 30.0,
    costBasis: 3802,
    imageUrl: '/images/mediterranean.jpg',
    lastUpdated: '2024-08-25'
  },
  {
    id: 'p018',
    name: 'Iceland: Fire & Ice Adventure',
    code: 'ICE-ADV-9',
    description: 'Glaciers, waterfalls, hot springs, and Northern Lights',
    region: 'Europe',
    category: 'Adventure',
    duration: 9,
    currentPrice: 4800,
    currentMargin: 27.1,
    targetMargin: 28.0,
    costBasis: 3499,
    imageUrl: '/images/iceland.jpg',
    lastUpdated: '2024-10-08'
  },
  {
    id: 'p019',
    name: 'Tuscany & Umbria: Hilltop Towns',
    code: 'ITA-TUSC-10',
    description: 'Renaissance art, wine estates, and Italian countryside',
    region: 'Europe',
    category: 'Cultural & Wine',
    duration: 10,
    currentPrice: 4400,
    currentMargin: 30.5,
    targetMargin: 30.0,
    costBasis: 3058,
    imageUrl: '/images/tuscany.jpg',
    lastUpdated: '2024-07-15'
  },
  {
    id: 'p020',
    name: 'Greek Islands: Santorini & Mykonos',
    code: 'GRE-ISL-8',
    description: 'Iconic white-washed villages and Aegean Sea beauty',
    region: 'Europe',
    category: 'Beach & Culture',
    duration: 8,
    currentPrice: 3800,
    currentMargin: 31.8,
    targetMargin: 30.0,
    costBasis: 2592,
    imageUrl: '/images/greek-islands.jpg',
    lastUpdated: '2024-09-02'
  },
  {
    id: 'p021',
    name: 'Norway Fjords & Arctic Circle',
    code: 'NOR-FJORD-11',
    description: 'Dramatic fjordland scenery and midnight sun experience',
    region: 'Europe',
    category: 'Nature & Cruise',
    duration: 11,
    currentPrice: 5900,
    currentMargin: 26.8,
    targetMargin: 28.0,
    costBasis: 4319,
    imageUrl: '/images/norway.jpg',
    lastUpdated: '2024-08-08'
  },
  {
    id: 'p022',
    name: 'Scottish Highlands & Edinburgh',
    code: 'SCO-HIGH-9',
    description: 'Castle tours, whisky distilleries, and Highland landscapes',
    region: 'Europe',
    category: 'Cultural',
    duration: 9,
    currentPrice: 3600,
    currentMargin: 29.4,
    targetMargin: 28.0,
    costBasis: 2542,
    imageUrl: '/images/scotland.jpg',
    lastUpdated: '2024-07-22'
  },

  // Asia/Pacific (6 products)
  {
    id: 'p023',
    name: 'New Zealand: South Island Grand Tour',
    code: 'NZ-SOUTH-14',
    description: 'Fjords, glaciers, and adventure capital Queenstown',
    region: 'Asia/Pacific',
    category: 'Adventure',
    duration: 14,
    currentPrice: 6200,
    currentMargin: 28.7,
    targetMargin: 28.0,
    costBasis: 4421,
    imageUrl: '/images/new-zealand.jpg',
    lastUpdated: '2024-09-30'
  },
  {
    id: 'p024',
    name: 'Vietnam & Cambodia: Heritage & Temples',
    code: 'VIET-CAM-12',
    description: 'Halong Bay, Angkor Wat, and Mekong Delta discovery',
    region: 'Asia/Pacific',
    category: 'Cultural',
    duration: 12,
    currentPrice: 3400,
    currentMargin: 33.5,
    targetMargin: 30.0,
    costBasis: 2261,
    imageUrl: '/images/vietnam.jpg',
    lastUpdated: '2024-10-03'
  },
  {
    id: 'p025',
    name: 'Japan: Cherry Blossom Discovery',
    code: 'JAP-CHERRY-10',
    description: 'Tokyo, Kyoto, and Mount Fuji during sakura season',
    region: 'Asia/Pacific',
    category: 'Cultural',
    duration: 10,
    currentPrice: 5400,
    currentMargin: 25.9,
    targetMargin: 28.0,
    costBasis: 4001,
    imageUrl: '/images/japan.jpg',
    lastUpdated: '2024-08-17'
  },
  {
    id: 'p026',
    name: 'Thailand: Bangkok to Chiang Mai',
    code: 'THAI-NORTH-9',
    description: 'Temples, street food, and northern hill tribe encounters',
    region: 'Asia/Pacific',
    category: 'Cultural',
    duration: 9,
    currentPrice: 2900,
    currentMargin: 34.5,
    targetMargin: 30.0,
    costBasis: 1900,
    imageUrl: '/images/thailand.jpg',
    lastUpdated: '2024-07-10'
  },
  {
    id: 'p027',
    name: 'Australia: Great Barrier Reef & Outback',
    code: 'AUS-REEF-13',
    description: 'Reef diving, Uluru, and Sydney Opera House',
    region: 'Asia/Pacific',
    category: 'Adventure',
    duration: 13,
    currentPrice: 6800,
    currentMargin: 27.2,
    targetMargin: 28.0,
    costBasis: 4950,
    imageUrl: '/images/australia.jpg',
    lastUpdated: '2024-09-12'
  },
  {
    id: 'p028',
    name: 'Bali & Java: Temples & Rice Terraces',
    code: 'INDO-BALI-10',
    description: 'Ubud culture, Borobudur, and beach relaxation',
    region: 'Asia/Pacific',
    category: 'Beach & Culture',
    duration: 10,
    currentPrice: 3200,
    currentMargin: 32.8,
    targetMargin: 30.0,
    costBasis: 2150,
    imageUrl: '/images/bali.jpg',
    lastUpdated: '2024-08-05'
  }
];

const users = ['Sarah Chen', 'David Martinez', 'Emily Johnson', 'Michael Torres', 'Jennifer Kim'];
const reasonCodes = ['seasonal adjustment', 'competitor response', 'cost increase', 'demand optimization', 'currency adjustment', 'fuel surcharge'];

function generatePriceComponents(basePrice: number, season: string): PriceComponent[] {
  const components: PriceComponent[] = [
    {
      type: 'base',
      name: 'Base Land Services',
      value: basePrice,
      isPercentage: false,
      description: 'Core tour package price'
    },
    {
      type: 'singleSupplement',
      name: 'Single Supplement',
      value: season === 'high' ? 75 : 65,
      isPercentage: true,
      description: 'Additional charge for solo travelers'
    },
    {
      type: 'childDiscount',
      name: 'Child Discount (Under 12)',
      value: -30,
      isPercentage: true,
      description: 'Discount for children'
    },
    {
      type: 'earlyBooking',
      name: 'Early Booking (90+ days)',
      value: season === 'low' ? -15 : -10,
      isPercentage: true,
      description: 'Advance booking incentive'
    },
    {
      type: 'groupRate',
      name: 'Group Rate (8+)',
      value: -10,
      isPercentage: true,
      description: 'Group booking discount'
    }
  ];

  return components;
}

function calculateTotalPrice(basePrice: number): number {
  // Default to base price for standard booking
  return basePrice;
}

function calculateMargin(price: number, cost: number): number {
  return ((price - cost) / price) * 100;
}

// Generate pricing history for all products
export function generatePricingVersions(): PriceVersion[] {
  const versions: PriceVersion[] = [];
  const now = new Date();

  products.forEach(product => {
    // Generate 15-25 price changes over the last 2-3 years
    const numChanges = 15 + Math.floor(Math.random() * 11);

    for (let i = 0; i < numChanges; i++) {
      const monthsAgo = Math.floor((i / numChanges) * 30); // Spread over 30 months
      const changeDate = subMonths(now, monthsAgo);
      
      // Determine season based on month
      const month = changeDate.getMonth() + 1;
      let season: string;
      let seasonType: 'high' | 'shoulder' | 'low';
      
      if (month >= 6 && month <= 9) {
        season = 'Summer (Jul-Sep)';
        seasonType = 'high';
      } else if (month >= 4 && month <= 6) {
        season = 'Spring (Apr-Jun)';
        seasonType = 'high';
      } else if (month >= 10 && month <= 12) {
        season = 'Fall (Oct-Dec)';
        seasonType = 'shoulder';
      } else {
        season = 'Winter (Jan-Mar)';
        seasonType = 'shoulder';
      }

      // Price variation based on season and time
      let priceMultiplier = 1.0;
      if (seasonType === 'high') {
        priceMultiplier = 1.0 + (Math.random() * 0.15); // Up to 15% higher
      } else if (seasonType === 'shoulder') {
        priceMultiplier = 0.95 + (Math.random() * 0.1); // 95-105%
      } else {
        priceMultiplier = 0.75 + (Math.random() * 0.15); // 75-90%
      }

      // Add some variation for competitive/cost reasons
      priceMultiplier *= (0.95 + Math.random() * 0.1);

      const basePrice = Math.round(product.currentPrice * priceMultiplier);
      const components = generatePriceComponents(basePrice, seasonType);
      const totalPrice = calculateTotalPrice(basePrice);
      
      // Cost basis varies slightly over time (inflation, currency, fuel)
      const costVariation = 0.95 + (Math.random() * 0.15);
      const costBasis = Math.round(product.costBasis * costVariation);
      const marginPercent = calculateMargin(basePrice, costBasis);

      versions.push({
        id: `v-${product.id}-${i}`,
        productId: product.id,
        effectiveDate: format(changeDate, 'yyyy-MM-dd'),
        basePrice,
        components,
        totalPrice,
        costBasis,
        marginPercent,
        season,
        reasonCode: reasonCodes[Math.floor(Math.random() * reasonCodes.length)],
        changedBy: users[Math.floor(Math.random() * users.length)],
        notes: i === 0 ? 'Current active pricing' : undefined,
        timestamp: format(addDays(changeDate, -3), 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'')
      });
    }
  });

  // Sort by timestamp descending (most recent first)
  return versions.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getSeasonForMonth(month: number): Season {
  return seasons.find(s => month >= s.startMonth && month <= s.endMonth) || seasons[0];
}

// Generate realistic departures for all products
export function generateDepartures(): Departure[] {
  const departures: Departure[] = [];
  const now = new Date();
  
  // Assign typical capacities to products (will update product objects separately)
  const productCapacities: Record<string, { typical: number; min: number; max: number }> = {
    // Galapagos cruises - small boats
    'p001': { typical: 16, min: 12, max: 16 },
    'p008': { typical: 12, min: 10, max: 12 },
    // Trekking - small groups
    'p002': { typical: 12, min: 8, max: 14 },
    // Cultural tours - medium groups
    'p003': { typical: 16, min: 12, max: 18 },
    'p004': { typical: 14, min: 10, max: 16 },
    'p005': { typical: 10, min: 8, max: 12 },
    'p006': { typical: 16, min: 12, max: 18 },
    'p007': { typical: 14, min: 10, max: 16 },
    // Safaris - vehicle capacity
    'p009': { typical: 8, min: 6, max: 8 },
    'p010': { typical: 8, min: 6, max: 8 },
    'p011': { typical: 12, min: 8, max: 14 },
    'p012': { typical: 6, min: 4, max: 6 },
    'p013': { typical: 14, min: 10, max: 16 },
    'p014': { typical: 8, min: 6, max: 8 },
    // River cruises - larger boats
    'p015': { typical: 24, min: 20, max: 28 },
    'p016': { typical: 24, min: 20, max: 28 },
    'p017': { typical: 20, min: 16, max: 24 },
    'p018': { typical: 14, min: 10, max: 16 },
    'p019': { typical: 16, min: 12, max: 18 },
    'p020': { typical: 14, min: 10, max: 16 },
    'p021': { typical: 20, min: 16, max: 24 },
    'p022': { typical: 16, min: 12, max: 18 },
    // Asia/Pacific tours
    'p023': { typical: 16, min: 12, max: 18 },
    'p024': { typical: 14, min: 10, max: 16 },
    'p025': { typical: 16, min: 12, max: 18 },
    'p026': { typical: 14, min: 10, max: 16 },
    'p027': { typical: 16, min: 12, max: 18 },
    'p028': { typical: 14, min: 10, max: 16 },
  };

  products.forEach(product => {
    const capacityInfo = productCapacities[product.id] || { typical: 16, min: 12, max: 18 };
    
    // Generate departures for next 12 months (future departures)
    // Frequency varies by product type and season
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const monthDate = addMonths(now, monthOffset);
      const month = monthDate.getMonth() + 1;
      const seasonInfo = getSeasonForMonth(month);
      
      // Determine departure frequency based on season
      let departuresPerMonth = 2; // default
      if (seasonInfo.type === 'high') {
        departuresPerMonth = 4; // weekly departures in high season
      } else if (seasonInfo.type === 'shoulder') {
        departuresPerMonth = 3; // bi-weekly
      } else {
        departuresPerMonth = 2; // bi-weekly to monthly
      }
      
      // Generate departures for this month
      for (let i = 0; i < departuresPerMonth; i++) {
        const dayOfMonth = Math.floor((i + 1) * (28 / (departuresPerMonth + 1)));
        const departureDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), dayOfMonth);
        const returnDate = addDays(departureDate, product.duration);
        
        // Skip past dates
        if (departureDate < now) continue;
        
        const daysUntilDeparture = differenceInDays(departureDate, now);
        const openedDate = subMonths(departureDate, 6); // opened 6 months in advance
        const daysSinceOpened = differenceInDays(now, openedDate);
        
        // Calculate realistic booking progress
        let bookingRate = 0.5; // base 50% occupancy
        
        // Adjust by season
        if (seasonInfo.type === 'high') {
          bookingRate = 0.7 + (Math.random() * 0.25); // 70-95%
        } else if (seasonInfo.type === 'shoulder') {
          bookingRate = 0.5 + (Math.random() * 0.3); // 50-80%
        } else {
          bookingRate = 0.3 + (Math.random() * 0.3); // 30-60%
        }
        
        // Adjust by how close to departure (closer = should be fuller)
        if (daysUntilDeparture < 30) {
          bookingRate = Math.min(bookingRate * 1.4, 0.98);
        } else if (daysUntilDeparture < 60) {
          bookingRate = Math.min(bookingRate * 1.2, 0.95);
        } else if (daysUntilDeparture < 90) {
          bookingRate = Math.min(bookingRate * 1.1, 0.90);
        }
        
        // Add some variation to create interesting departures
        const variation = (Math.random() - 0.5) * 0.3; // +/- 15%
        bookingRate = Math.max(0.1, Math.min(0.98, bookingRate + variation));
        
        const capacity = capacityInfo.typical;
        const bookings = Math.round(capacity * bookingRate);
        const occupancyRate = (bookings / capacity) * 100;
        
        // Determine status
        let status: 'open' | 'nearly_full' | 'sold_out' | 'cancelled' = 'open';
        if (occupancyRate >= 95) {
          status = 'sold_out';
        } else if (occupancyRate >= 80) {
          status = 'nearly_full';
        } else if (occupancyRate < 20 && daysUntilDeparture < 45) {
          // Cancel low-occupancy departures close to date
          status = 'cancelled';
        }
        
        // Calculate booking velocity
        const bookingVelocity = daysSinceOpened > 0 ? bookings / daysSinceOpened : 0;
        
        // Determine booking pace compared to historical average
        const historicalVelocity = capacity / 180; // assumes filling over 6 months typically
        let bookingPace: 'fast' | 'normal' | 'slow' | 'stalled' = 'normal';
        
        if (bookingVelocity > historicalVelocity * 1.2) {
          bookingPace = 'fast';
        } else if (bookingVelocity < historicalVelocity * 0.5) {
          bookingPace = 'slow';
        } else if (bookingVelocity < historicalVelocity * 0.2) {
          bookingPace = 'stalled';
        }
        
        // Price variation based on demand
        let priceMultiplier = 1.0;
        if (bookingPace === 'fast') {
          priceMultiplier = 1.05 + (Math.random() * 0.1); // 5-15% premium
        } else if (bookingPace === 'slow') {
          priceMultiplier = 0.90 + (Math.random() * 0.1); // 10-20% discount
        } else if (bookingPace === 'stalled') {
          priceMultiplier = 0.75 + (Math.random() * 0.15); // 25-40% discount
        }
        
        // Season adjustment
        if (seasonInfo.type === 'high') {
          priceMultiplier *= 1.1;
        } else if (seasonInfo.type === 'low') {
          priceMultiplier *= 0.85;
        }
        
        const departurePrice = Math.round(product.currentPrice * priceMultiplier);
        const costBasis = product.costBasis;
        const marginPercent = ((departurePrice - costBasis) / departurePrice) * 100;
        const revenue = departurePrice * bookings;
        const revPAS = revenue / capacity;
        
        // Last booking date (simulate recent booking activity)
        let lastBookingDate: string | undefined;
        if (bookings > 0) {
          const daysAgo = Math.floor(Math.random() * 14); // last booking within 14 days
          lastBookingDate = format(subMonths(now, 0), 'yyyy-MM-dd');
        }
        
        departures.push({
          id: `d-${product.id}-${format(departureDate, 'yyyy-MM-dd')}`,
          productId: product.id,
          departureDate: format(departureDate, 'yyyy-MM-dd'),
          returnDate: format(returnDate, 'yyyy-MM-dd'),
          season: seasonInfo.name,
          capacity,
          bookings,
          currentPrice: departurePrice,
          costBasis,
          marginPercent,
          status,
          bookingPace,
          daysUntilDeparture,
          bookingVelocity,
          occupancyRate,
          revenuePerAvailableSeat: revPAS,
          lastBookingDate,
          openedForBookingDate: format(openedDate, 'yyyy-MM-dd')
        });
      }
    }
  });
  
  return departures.sort((a, b) => 
    new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
  );
}

