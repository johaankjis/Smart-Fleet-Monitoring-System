# Fleet Monitoring System

A comprehensive IoT vehicle monitoring platform with real-time telemetry, analytics, and alert management.

> 📊 **[View Comprehensive Repository Review](REPOSITORY_REVIEW.md)** - Detailed technical analysis, code quality assessment, and recommendations

## Architecture

This system simulates a production-grade fleet monitoring architecture:

\`\`\`
IoT Vehicle Simulators (Python)
        ↓
Kafka Cluster (simulated via REST API)
        ↓
Next.js Backend (API Routes)
        ↓
Analytics Engine (Anomaly Detection)
        ↓
Database (In-memory / PostgreSQL)
        ↓
React Dashboard (Real-time UI)
\`\`\`

## Features

### 1. Python IoT Simulators
- **Location**: `/scripts/vehicle_simulator.py`
- Generates realistic vehicle telemetry data
- Simulates: location, speed, temperature, fuel, tire pressure, battery
- Configurable fleet size and update intervals
- Kafka producer example included

### 2. Database Schema
- **Location**: `/scripts/*.sql`
- PostgreSQL-compatible schema
- Tables: vehicles, telemetry, alerts
- Optimized indexes for time-series queries
- Views for latest status and critical alerts

### 3. Backend API (Next.js)
- **Location**: `/app/api/*`
- RESTful endpoints for all operations
- Endpoints:
  - `GET /api/vehicles` - List all vehicles
  - `GET /api/vehicles/:id` - Get vehicle details
  - `POST /api/telemetry` - Ingest telemetry data
  - `GET /api/telemetry` - Query telemetry
  - `GET /api/alerts` - Get alerts
  - `POST /api/alerts/:id/acknowledge` - Acknowledge alert
  - `GET /api/status` - Get fleet status
  - `GET /api/analytics/stats` - Fleet statistics
  - `GET /api/analytics/maintenance/:id` - Predict maintenance

### 4. Analytics Engine
- **Location**: `/lib/analytics.ts`
- Real-time anomaly detection
- Monitors:
  - Engine temperature (critical > 110°C)
  - Fuel level (critical < 10%)
  - Speed violations (> 100 km/h)
  - Tire pressure anomalies
  - Battery voltage issues
- Automatic alert generation
- Predictive maintenance analysis

### 5. Fleet Dashboard
- **Location**: `/app/page.tsx`, `/components/*`
- Real-time vehicle monitoring
- Live telemetry charts (Recharts)
- Vehicle status cards
- Fleet-wide statistics
- Auto-refresh every 5 seconds
- Dark theme inspired by Vercel observability

### 6. Alert System
- **Location**: `/app/alerts/page.tsx`
- Real-time toast notifications (Sonner)
- Alert management interface
- Filter by severity (critical, high, medium, low)
- Acknowledge/resolve workflows
- Separate views for acknowledged/unacknowledged

## Getting Started

### 1. Run Python Simulator
\`\`\`bash
cd scripts
python vehicle_simulator.py
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Send Telemetry to API
\`\`\`bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d @scripts/sample_telemetry.json
\`\`\`

### 4. View Dashboard
Open [http://localhost:3000](http://localhost:3000)

## API Examples

### Ingest Telemetry
\`\`\`bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH-1001",
    "vehicle_type": "Truck",
    "timestamp": "2025-01-06T10:30:45.123Z",
    "location": {"latitude": 37.7749, "longitude": -122.4194},
    "speed": 65.5,
    "engine_temperature": 92.3,
    "fuel_level": 78.5,
    "odometer": 125430.5,
    "engine_status": "normal",
    "tire_pressure": {"front_left": 32.5, "front_right": 32.8, "rear_left": 33.1, "rear_right": 32.9},
    "battery_voltage": 13.8
  }'
\`\`\`

### Get Fleet Status
\`\`\`bash
curl http://localhost:3000/api/status
\`\`\`

### Get Alerts
\`\`\`bash
curl http://localhost:3000/api/alerts?acknowledged=false
\`\`\`

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Charts**: Recharts
- **Data Fetching**: SWR (auto-refresh)
- **Notifications**: Sonner
- **Backend**: Next.js API Routes
- **Simulators**: Python 3
- **Database**: PostgreSQL-compatible (in-memory for demo)

## Production Deployment

To deploy to production with real infrastructure:

1. **Database**: Replace in-memory DB with Supabase/Neon
2. **Kafka**: Set up actual Kafka cluster
3. **Lambda**: Deploy analytics to AWS Lambda
4. **Monitoring**: Add observability (Vercel Analytics, Sentry)
5. **Auth**: Implement authentication (NextAuth.js)

## Architecture Notes

This implementation uses Next.js to simulate the Spring Boot microservice layer, making it fully functional in the browser while maintaining the same API contracts. The Python simulators can be run separately and configured to send data to the Next.js API endpoints, which then process the data through the analytics engine and update the dashboard in real-time.

## License

MIT
