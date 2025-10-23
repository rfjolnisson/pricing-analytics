# Pricing Intelligence Dashboard - Feature Overview

## 🎯 Core Value Proposition

**"Your pricing decisions are flying blind without historical context. Our Pricing Intelligence app captures every price change as a versioned snapshot, letting you compare January vs April margins for the same Galapagos cruise instantly. Stop guessing which seasons are actually profitable."**

## ✨ Key Features

### 1. Dashboard (Landing Page)

**URL:** `http://localhost:5175/`

**Components:**
- **4 KPI Cards**
  - Average Margin: 28.7% (↑0.9pp vs last year)
  - Total Price Changes: 142 in last 90 days
  - Products Below Target: 12 products flagged
  - Revenue Opportunity: $120,417 potential gain

- **12-Month Margin Trend Chart**
  - Line chart showing margin performance over time
  - Target margin reference line (28%)
  - Visual annotations for significant changes

- **Product Portfolio Table**
  - Searchable and filterable (28 products)
  - Shows: Product name, region, price, current margin, target margin
  - Color-coded margin indicators (green = on target, yellow = close, red = below)
  - Quick link to product details

- **Recent Changes Table**
  - Last 20 pricing updates
  - Shows: Date, product, new price, margin impact, reason, changed by
  - Filterable by product, date range, or reason code

### 2. Product Detail Page

**URL:** `http://localhost:5175/product/:productId`

**Example:** `/product/p001` (Galapagos Classic 8-Day Cruise)

**Components:**
- **Product Summary Cards**
  - Current Price: $5,200
  - Current Margin: 24.5% (below target indicator)
  - Target Margin: 28.0%
  - Cost Basis: $3,926

- **Price Component Breakdown Chart**
  - Bar chart showing all pricing components:
    - Base Land Services: $5,200
    - Single Supplement: +75%
    - Child Discount: -30%
    - Early Booking: -10%
    - Group Rate: -10%

- **Price Version History Timeline**
  - Chronological list of all price changes (15-25 per product)
  - Shows: Date, price, margin, season, reason, changed by
  - Visual diff indicators showing % change from previous
  - Filterable by season or date range

- **Quick Actions**
  - "Get Forecast" button → Direct link to forecasting tool

### 3. Season Comparison Page

**URL:** `http://localhost:5175/comparison`

**Components:**
- **Product Selector**
  - Dropdown with all 28 products
  - Search functionality

- **Seasonal Comparison Cards (4 seasons)**
  - Winter (Jan-Mar)
  - Spring (Apr-Jun)
  - Summer (Jul-Sep)
  - Fall (Oct-Dec)
  
  Each card shows:
  - Current price for that season
  - Margin percentage
  - Delta vs previous season (↑/↓ with %)
  - Number of price changes in that season

- **Detailed Comparison Table**
  - Side-by-side view of all seasons
  - Columns: Season, Base Price, Margin %, Cost Basis, vs Target, Updates
  - Color-coded margin performance
  - Sort by any column

**Use Case:** Quickly spot that Summer pricing has 3% higher margins than Fall

### 4. Forecasting Tool

**URL:** `http://localhost:5175/forecasting`

**Components:**
- **Configuration Panel**
  - Product selector dropdown
  - Season selector (optional filter)
  - "Generate Forecast" button

- **Recommendation Card** (Gradient teal background)
  - Suggested Price: $5,850
  - Price Range: $5,265 - $6,435
  - Expected Margin: 32.8%
  - Confidence Score: 87%
  - Reasoning text explaining the recommendation

- **Historical Performance Chart**
  - Bar chart showing price trends over last 3 years
  - Overlay showing margin % for each year
  - Reference line for suggested price

- **Impact Assessment**
  - Side-by-side comparison:
    - Current Pricing (left)
    - Suggested Pricing (right, highlighted in yellow)
  - Shows margin improvement and price change %

**Example Output:**
```
Suggested Price: $5,400
Confidence: 82%

"Based on 3 years of data, prices have been trending upward by $120/year. 
This pricing achieves your target margin of 28%."
```

## 📊 Mock Data Details

### Products (28 total)

**South America (8 products):**
1. Galapagos Islands: Classic 8-Day Cruise - $5,200 (24.5% margin) ⚠️
2. Galapagos Islands: Luxury 11-Day Expedition - $7,800 (26.2% margin) ⚠️
3. Patagonia Adventure: Torres del Paine Trek - $4,800 (32.5% margin) ✅
4. Machu Picchu & Sacred Valley Explorer - $3,200 (28.8% margin) ✅
5. Argentina Wine Country & Buenos Aires - $3,800 (31.2% margin) ✅
6. Amazon Rainforest Lodge Experience - $2,900 (26.5% margin) ⚠️
7. Iguazu Falls & Brazilian Coastline - $3,600 (27.8% margin) ⚠️
8. Colombian Coffee Triangle Discovery - $2,800 (29.6% margin) ✅

**Africa (6 products):**
9. Kenya Safari: Masai Mara & Amboseli - $6,200 (22.8% margin) 🚨
10. Tanzania: Serengeti & Ngorongoro Crater - $5,800 (24.1% margin) ⚠️
11. South Africa: Cape Town & Garden Route - $4,900 (30.2% margin) ✅
12. Botswana: Okavango Delta Luxury Safari - $8,900 (25.6% margin) ⚠️
13. Morocco: Imperial Cities & Sahara - $3,800 (31.6% margin) ✅
14. Uganda Gorilla Trekking Adventure - $7,200 (23.6% margin) ⚠️

**Europe (8 products):**
15. Danube River Cruise: Budapest to Vienna - $4,200 (29.5% margin) ✅
16. Rhine Valley: Castles & Wine Villages - $3,900 (28.2% margin) ✅
17. Mediterranean Highlights: Spain, France & Italy - $5,600 (32.1% margin) ✅
18. Iceland: Fire & Ice Adventure - $4,800 (27.1% margin) ⚠️
19. Tuscany & Umbria: Hilltop Towns - $4,400 (30.5% margin) ✅
20. Greek Islands: Santorini & Mykonos - $3,800 (31.8% margin) ✅
21. Norway Fjords & Arctic Circle - $5,900 (26.8% margin) ⚠️
22. Scottish Highlands & Edinburgh - $3,600 (29.4% margin) ✅

**Asia/Pacific (6 products):**
23. New Zealand: South Island Grand Tour - $6,200 (28.7% margin) ✅
24. Vietnam & Cambodia: Heritage & Temples - $3,400 (33.5% margin) ✅
25. Japan: Cherry Blossom Discovery - $5,400 (25.9% margin) ⚠️
26. Thailand: Bangkok to Chiang Mai - $2,900 (34.5% margin) ✅
27. Australia: Great Barrier Reef & Outback - $6,800 (27.2% margin) ⚠️
28. Bali & Java: Temples & Rice Terraces - $3,200 (32.8% margin) ✅

Legend:
- ✅ At or above 28% target margin
- ⚠️ Within 3pp of target (25-28%)
- 🚨 5+ pp below target (<23%)

### Price Version History

Each product has **15-25 price changes** spanning **2-3 years** with:
- Realistic seasonal patterns (high/shoulder/low season)
- Reason codes: seasonal adjustment, competitor response, cost increase, demand optimization, currency adjustment, fuel surcharge
- Changed by: Sarah Chen, David Martinez, Emily Johnson, Michael Torres, Jennifer Kim
- Timestamps with proper date progression

### Seasonal Pricing Patterns

**High Season (Jun-Sep for Galapagos, Europe):**
- Premium pricing: +10-15% above baseline
- Higher margins expected
- Example: Galapagos in July = $5,800 (28.2% margin)

**Shoulder Season (Apr-May, Oct-Nov):**
- Competitive pricing: 95-105% of baseline
- Volume-focused strategy
- Example: Galapagos in April = $5,200 (26.8% margin)

**Low Season (Dec-Mar for most):**
- Promotional pricing: 75-90% of baseline
- Margin compression challenges
- Example: Galapagos in January = $4,580 (23.1% margin) ⚠️ **12% underpriced!**

## 🎯 Demo Scenarios

### Scenario 1: The Underpriced Galapagos Discovery

**Steps:**
1. Go to Dashboard
2. Click on "Galapagos Islands: Classic 8-Day Cruise"
3. Scroll to Price Version History
4. Filter by "Winter (Jan-Mar)" season
5. Observe: January pricing consistently 12% below historical norms

**Insight:** "You're leaving $600/booking on the table in January!"

### Scenario 2: Season-over-Season Safari Analysis

**Steps:**
1. Go to Season Comparison page
2. Select "Kenya Safari: Masai Mara & Amboseli"
3. Review the 4 seasonal cards
4. Notice Summer (Jul-Sep) margin: 22.8% vs Winter: 25.1%

**Insight:** "July migration season is highly competitive - consider value-adds instead of price cuts"

### Scenario 3: Smart Forecasting for Mediterranean Tour

**Steps:**
1. Go to Forecasting page
2. Select "Mediterranean Highlights: Spain, France & Italy"
3. Select "Spring (Apr-Jun)" season
4. Click "Generate Forecast"
5. Review suggestion: $5,850 (was $5,600)

**Insight:** "Historical data shows 4% annual price increases in Spring. Confidence: 89%"

## 🔧 Technical Implementation Highlights

### Design Consistency
- **Exact Kaptio branding** from onboarding-tool
- Lexend font family throughout
- Teal/cyan primary palette (#056F82)
- Warm yellow CTAs (#FFBC42)
- Consistent shadow-kaptio on cards

### Performance
- Lazy loading of data
- Efficient React hooks (useState, useEffect)
- Memoized calculations where appropriate
- JSON storage = instant reads (no database latency)

### Code Quality
- Full TypeScript coverage
- Shared types between frontend/backend
- Reusable component library
- Utility functions for formatting and calculations

### API Design
- RESTful endpoints
- Consistent JSON responses
- Query parameters for filtering
- Error handling with proper status codes

## 🚀 Quick Start Commands

```bash
# Local development
./start.sh

# Or manually:
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2

# Docker
docker-compose up --build
```

## 📈 Success Metrics Achieved

✅ A Galapagos product showing 12% underpricing in January vs historical norms
✅ Side-by-side seasonal comparison showing April pricing decisions from last 3 years
✅ Forecast suggesting optimal price range for upcoming season with 80%+ confidence
✅ Margin trend chart showing compression in competitive months (Safari season)
✅ Easy-to-understand KPIs answering "Am I leaving money on the table?"

## 🎨 UI/UX Highlights

- **Responsive design** - Works on desktop, tablet, mobile
- **Color-coded indicators** - Instant visual feedback on margin performance
- **Smooth animations** - Framer Motion for delightful interactions
- **Loading states** - Skeleton screens and spinners
- **Empty states** - Helpful guidance when no data
- **Error handling** - Graceful degradation
- **Accessible** - Semantic HTML, proper ARIA labels

## 💡 Edge App Positioning

This is a **composable Edge app** that:
- Sits on top of Kaptio's core pricing data
- Doesn't replace existing systems
- Provides intelligence layer only
- Python-compatible backend (easy to swap Express for Flask/FastAPI)
- Revenue-generating capability (margin intelligence = competitive advantage)

**The Wedge:** Nail pricing intelligence → earn trust → expand to inventory optimization → yield management → full revenue optimization suite

## 📞 Next Steps

1. **Demo to G Adventures** - Focus on Galapagos underpricing scenario
2. **Connect to real Kaptio data** - Replace mock data with actual pricing
3. **Add export functionality** - CSV/PDF reports
4. **Implement alerts** - Email when margins drop below threshold
5. **ML enhancements** - More sophisticated forecasting models

