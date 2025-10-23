# Departure Revenue Optimization | Kaptio Edge

A lightweight Edge app that enables departure-level yield management for tour operators. Built to demonstrate the power of EdgeToken architecture with comprehensive mock data.

## Overview

Tour operators don't sell "Summer Galapagos"—they sell Seat 1 on the July 5th departure. This tool helps you:

- **See every departure** - Visual inventory grid showing capacity, occupancy, and booking pace
- **Understand demand patterns** - Historical pricing intelligence and seasonal trends
- **Optimize revenue** - Data-driven recommendations for each departure (raise price, promote, or cancel)
- **Scale across portfolio** - Manage 10,000+ departures annually, not just seasonal averages

**Core Philosophy:** Manage departure-level inventory like airlines (yield management) rather than seasonal pricing like spreadsheets.

## Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite for fast development
- Tailwind CSS with Kaptio design system
- Recharts for data visualization
- React Router for navigation
- Framer Motion for animations

**Backend:**
- Node.js + Express + TypeScript
- JSON file storage (easily upgradeable to database)
- RESTful API design
- Comprehensive mock data generation

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)

### Local Development (Without Docker)

1. **Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

Backend will run on http://localhost:3013

2. **Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5175

### Using Docker

```bash
# Build and start both services
docker-compose up --build

# Stop services
docker-compose down
```

- Frontend: http://localhost:5175
- Backend API: http://localhost:3013
- Health Check: http://localhost:3013/health

### Deploy to Cloud (5 Minutes)

**Easiest: Deploy to Render (FREE)**

See [`DEPLOY_CHECKLIST.md`](./DEPLOY_CHECKLIST.md) for step-by-step instructions.

**TL;DR:**
1. Push to GitHub
2. Connect Render to your repo
3. Deploy backend + frontend (copy + paste config)
4. **Done!** Auto-deploys on every git push

**Alternatives:** Railway ($5/mo), Vercel + Render, or any Docker host

## Features

### 🎯 Departure Inventory (Primary Feature)
**The Wow Moment** - Visual departure grid showing:
- **Color-coded demand signals:** Green (fast-filling), Yellow (nearly full), Red (slow-filling)
- **Real-time metrics:** Occupancy rate, booking pace, revenue per seat
- **Smart filtering:** By product, season, status, or demand signal
- **Aggregate insights:** Portfolio-wide opportunity and risk analysis

**Key Value:** See 30-50 departures per product at a glance. Know which to raise prices on (fast), which to promote (slow), and which to cancel early (at-risk).

### 📊 Portfolio View
- **KPI Cards:** Total departures, average occupancy, fast-pace opportunities, at-risk count
- **Margin Trends:** 12-month view across all products
- **Product Performance:** Searchable table with departure-level rollups
- **Recent Activity:** Latest pricing and inventory decisions

### 🔮 Optimization Tools (Forecasting)
- **Data-driven recommendations:** Based on 2-3 years of historical patterns
- **Scenario analysis:** Promote vs cancel decisions with dollar impacts
- **Confidence scoring:** Know which suggestions are backed by strong data
- **Historical context:** See what worked (and didn't) in previous seasons

### 📈 Product Detail
- **Price version history:** Timeline of all pricing decisions with reason codes
- **Departure performance:** How individual departures are tracking
- **Margin analysis:** Component-level breakdown (base price, supplements, costs)
- **Quick actions:** Jump to forecasting or departure grid

## API Endpoints

### Departures (Primary)
- `GET /api/departures` - All departures with filters (productId, season, status, bookingPace)
- `GET /api/departures/product/:productId` - Departures for specific product
- `GET /api/departures/:id` - Single departure detail

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Single product detail
- `GET /api/products/:id/versions` - Price change history

### Analytics
- `GET /api/analytics/margins` - Portfolio-wide margin stats
- `GET /api/analytics/trends?period=12m` - Trend data
- `GET /api/analytics/outliers` - Products below target
- `GET /api/analytics/recent-changes?limit=20` - Recent updates

### Forecasting
- `GET /api/forecast/:productId?season=X` - Price suggestions
- `GET /api/forecast/patterns/:productId` - Historical patterns

## Mock Data

The application includes realistic mock data for:

**28 Products** across:
- **South America:** Galapagos cruises, Patagonia treks, Machu Picchu tours
- **Africa:** Kenya/Tanzania safaris, Morocco cultural tours, gorilla trekking
- **Europe:** River cruises, Mediterranean tours, Iceland adventures
- **Asia/Pacific:** New Zealand, Vietnam/Cambodia, Japan, Thailand, Australia

**~840 Departures** with:
- **Dynamic booking patterns:** Fast-filling (high demand), Normal, Slow-filling (at-risk)
- **Realistic capacity:** 8-60 seats depending on product type (small group, coach, cruise)
- **Seasonal variations:** Higher prices and occupancy in peak season
- **Status tracking:** Confirmed, Nearly Full, At Risk, Cancelled
- **Revenue metrics:** Booking pace, occupancy rate, revenue per available seat

**Price Intelligence:**
- 15-25 price changes per product over 2-3 years
- Reason codes and audit trail (who changed what, when)
- Seasonal pricing variations (high/shoulder/low season)
- Component breakdown (base price, supplements, discounts)
- Margin targets and performance tracking

## Design System

Based on Kaptio's brand guidelines:
- **Primary Colors:** Teal/cyan family (#032E36, #056F82, #B4D4DA)
- **CTA Color:** Warm yellow (#FFBC42)
- **Typography:** Lexend font family
- **Components:** Shadow-kaptio, rounded corners, smooth transitions

## Project Structure

```
pricing-analytics-3/
├── backend/
│   ├── src/
│   │   ├── data/          # Mock data generation
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript types
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Helper functions
│   │   └── App.tsx
│   └── package.json
└── docker-compose.yml
```

## Development Notes

- **Port 3013** chosen to avoid conflicts with onboarding-tool (3011-3012)
- **Port 5175** for frontend (avoiding 5174)
- Mock data is generated on first backend start
- JSON files stored in `backend/src/data/` directory
- All timestamps use ISO 8601 format
- Currency values in USD

## Roadmap: Manual → Semi-Automated → Fully Automated

**Phase 1: Manual Optimization (Current Demo)**
- ✅ Departure-level visibility
- ✅ Historical intelligence
- ✅ Data-driven recommendations
- ✅ User makes all decisions

**Phase 2: Semi-Automated (Q2 2025)**
- 🔄 System alerts: "5 fast departures need price raises"
- 🔄 One-click approvals
- 🔄 Batch operations (raise all fast departures by 10%)
- 🔄 Email/Slack notifications

**Phase 3: Fully Automated (Q4 2025)**
- 🎯 Dynamic pricing like airlines
- 🎯 Real-time price adjustments based on booking velocity
- 🎯 User sets rules (max raise: 15%, min occupancy: 60%)
- 🎯 System optimizes automatically

**Technical Enhancements:**
- Real Kaptio data integration (via EdgeTokens)
- Machine learning demand forecasting
- Competitive intelligence feeds
- Currency hedging recommendations
- Export to PDF/CSV reports
- User authentication and role-based permissions

## Demo Scenarios & Value Prop

### The 8-Minute Story

**Act 1: THE PROBLEM (2 min)**
- Tour operators manage "Summer pricing" but sell departure-level inventory
- G Adventures runs 10,000+ departures/year = 10,000 optimization opportunities
- No visibility into which departures are filling fast (underpriced) vs slow (at-risk)

**Act 2: THE SOLUTION (5 min)**
- **Scene 1:** Departure Grid - See all 30 departures for Galapagos at once
  - Point to fast-filling departure (14/16 booked, 14 days out) → Raise price $400-600
  - Point to slow-filling departure (6/16 booked, 83 days out) → Promote or cancel
- **Scene 2:** Historical Context - Why is January underpriced?
  - Show 3 years of conservative pricing ($4,580 → $4,650 → $4,720)
  - Data says you can charge $5,200 and still fill 75-85%
- **Scene 3:** Recommendations - What should you do?
  - Fast departures: Raise price → $48K opportunity
  - Slow departures: Promote or cancel early → Save $38K in sunk costs

**Act 3: THE SCALE (1 min)**
- ONE product (Galapagos): $127K annual opportunity
- 28 products (demo): $550K demonstrated
- 200 products (G Adventures): $3-5.5M projected

**Built in 3 days using EdgeTokens. Ready for 30-day POC.**

### Specific Examples

1. **Fast-Filling Galapagos (November 7):** 87% booked with 14 days to go, priced at $5,200, should be $5,600-5,800 = $1,000 lost opportunity
2. **Slow-Filling Galapagos (January 15):** 37% booked with 83 days to go, needs promotion NOW or cancel at 60 days to avoid $15K sunk costs
3. **Baseline Pricing Fix:** January departures consistently priced 12% below market demand for 3 years = $41K annual opportunity
4. **Portfolio View:** 8 fast departures (raise prices), 5 slow departures (at-risk), 17 on-track = Clear action plan

## License

Proprietary - Kaptio Edge Apps

## Support

For questions or issues, contact the Kaptio development team.

