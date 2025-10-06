# 🚛 Smart Fleet Monitoring System

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Python](https://img.shields.io/badge/Python-3.x-3776ab)

**A Production-Grade IoT Vehicle Monitoring Platform**

*Real-time telemetry tracking | Anomaly detection | Predictive maintenance | Alert management*

[Live Demo](#getting-started) • [Documentation](DOCUMENTATION.md) • [Features](#-key-features) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [API Examples](#-api-examples)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Analytics Engine](#-analytics-engine)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **Smart Fleet Monitoring System** is a comprehensive IoT vehicle monitoring platform designed to simulate production-grade fleet management. It provides real-time telemetry tracking, intelligent anomaly detection, predictive maintenance analysis, and a sophisticated alert management system—all wrapped in a modern, responsive dashboard.

### Why This Project?

- ✅ **Production-Ready Architecture**: Simulates real-world microservices architecture
- ✅ **Real-Time Monitoring**: Auto-refreshing dashboard with 5-second intervals
- ✅ **Intelligent Analytics**: AI-driven anomaly detection and predictive maintenance
- ✅ **Scalable Design**: Built to handle fleet-scale data ingestion and processing
- ✅ **Modern Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- ✅ **IoT Simulation**: Realistic Python-based vehicle simulators included

---

## 🚀 Key Features

### 1. 📊 Real-Time Fleet Dashboard

- **Live Vehicle Monitoring**: Track all vehicles in your fleet simultaneously
- **Interactive Telemetry Charts**: Visualize speed, temperature, fuel levels, and more
- **Auto-Refresh**: Dashboard updates every 5 seconds using SWR
- **Dark Theme UI**: Modern, Vercel-inspired design optimized for 24/7 monitoring
- **Fleet-Wide Statistics**: Instant overview of fleet health and performance

### 2. 🔔 Intelligent Alert System

- **Real-Time Notifications**: Toast notifications for critical events (Sonner)
- **Severity Levels**: Critical, High, Medium, Low priority classification
- **Smart Detection**: Automatic anomaly detection triggers alerts
- **Alert Management**: Acknowledge/resolve workflows with filtering
- **Historical Tracking**: Complete alert history and resolution tracking

### 3. 🤖 Analytics Engine

Monitors multiple critical parameters:

- 🌡️ **Engine Temperature**: Critical threshold > 110°C
- ⛽ **Fuel Level**: Low fuel alerts < 10%
- 🏎️ **Speed Violations**: Excessive speed > 100 km/h
- 🔋 **Battery Voltage**: Voltage anomaly detection
- 🛞 **Tire Pressure**: Pressure anomaly alerts
- 🔧 **Predictive Maintenance**: ML-based maintenance predictions

### 4. 🐍 IoT Simulators (Python)

- **Realistic Data Generation**: Simulates authentic vehicle telemetry
- **Configurable Fleet Size**: Scale from 1 to 1000+ vehicles
- **Multiple Data Points**: Location, speed, temperature, fuel, tire pressure, battery
- **Kafka Integration**: Example producer for message queue integration
- **Flexible Update Intervals**: Customize data generation frequency

### 5. 🗄️ Database Schema

- **PostgreSQL-Compatible**: Production-ready schema design
- **Optimized Indexes**: Fast time-series queries
- **Three Core Tables**: vehicles, telemetry, alerts
- **Database Views**: Pre-computed aggregations for performance
- **Migration Scripts**: Complete SQL setup included

### 6. 🔌 RESTful API

Complete API coverage for all operations:

```
GET    /api/vehicles           - List all vehicles
GET    /api/vehicles/:id       - Get vehicle details
POST   /api/telemetry          - Ingest telemetry data
GET    /api/telemetry          - Query telemetry history
GET    /api/alerts             - Get alerts (filterable)
POST   /api/alerts/:id/ack     - Acknowledge alert
GET    /api/status             - Fleet status overview
GET    /api/analytics/stats    - Fleet-wide statistics
GET    /api/analytics/maintenance/:id - Maintenance predictions
```

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     IoT Vehicle Simulators                       │
│                         (Python Scripts)                         │
│     Generate realistic telemetry: location, speed, temp, etc.   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP POST (Telemetry Data)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Kafka/Message Queue                          │
│                    (Simulated via REST API)                      │
│            Production: Apache Kafka, AWS Kinesis                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Backend (API Routes)                  │
│    • Telemetry Ingestion    • Vehicle Management                │
│    • Alert Processing        • Analytics Endpoints              │
└────────────┬───────────────────────┬────────────────────────────┘
             │                       │
             ▼                       ▼
┌──────────────────────┐   ┌────────────────────────────────────┐
│  Analytics Engine    │   │   Database Layer                   │
│  • Anomaly Detection │   │   • In-Memory (Development)        │
│  • Alert Generation  │   │   • PostgreSQL (Production)        │
│  • Predictive ML     │   │   • Tables: vehicles, telemetry,   │
│  • Real-time Processing  │     alerts                         │
└──────────┬───────────┘   └────────┬───────────────────────────┘
           │                        │
           └────────┬───────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              React Dashboard (Frontend)                          │
│   • Real-time Vehicle Monitoring  • Telemetry Charts            │
│   • Fleet Statistics              • Alert Management UI         │
│   • Auto-refresh (SWR)            • Dark Theme UI               │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Telemetry Generation** → Python simulators generate realistic vehicle data
2. **Data Ingestion** → Posted to `/api/telemetry` endpoint
3. **Real-time Analysis** → Analytics engine processes data for anomalies
4. **Alert Generation** → Critical conditions trigger automated alerts
5. **Database Storage** → Telemetry and alerts persisted
6. **Frontend Display** → Dashboard auto-refreshes using SWR
7. **User Interaction** → Operators manage alerts through UI

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Component Library**: shadcn/ui (40+ components)
- **Charts**: Recharts
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Theme**: next-themes (Dark mode)

### Backend
- **Runtime**: Next.js API Routes (Node.js)
- **Language**: TypeScript 5
- **Database**: In-memory (Dev), PostgreSQL (Production)
- **Message Queue**: REST API simulation (Kafka-ready)

### IoT Simulation
- **Language**: Python 3.x
- **Libraries**:
  - `kafka-python` (Kafka integration)
  - `requests` (HTTP telemetry)
  - Standard library for data generation

### Development Tools
- **Package Manager**: npm/pnpm
- **Linter**: ESLint
- **Formatter**: Prettier (via ESLint config)
- **Version Control**: Git

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- Python 3.8+
- npm, pnpm, or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Smart-Fleet-Monitoring-System.git
   cd Smart-Fleet-Monitoring-System
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the dashboard**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Running the Python Simulator

1. **Navigate to scripts directory**
   ```bash
   cd scripts
   ```

2. **Run the vehicle simulator**
   ```bash
   python vehicle_simulator.py
   ```

3. **Send sample telemetry**
   ```bash
   curl -X POST http://localhost:3000/api/telemetry \
     -H "Content-Type: application/json" \
     -d @sample_telemetry.json
   ```

---

## 📡 API Examples

### Ingest Vehicle Telemetry

```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_id": "VEH-1001",
    "vehicle_type": "Truck",
    "timestamp": "2025-01-06T10:30:45.123Z",
    "location": {
      "latitude": 37.7749,
      "longitude": -122.4194
    },
    "speed": 65.5,
    "engine_temperature": 92.3,
    "fuel_level": 78.5,
    "odometer": 125430.5,
    "engine_status": "normal",
    "tire_pressure": {
      "front_left": 32.5,
      "front_right": 32.8,
      "rear_left": 33.1,
      "rear_right": 32.9
    },
    "battery_voltage": 13.8
  }'
```

### Get Fleet Status

```bash
curl http://localhost:3000/api/status
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "vehicle_id": "VEH-1001",
      "vehicle_type": "Truck",
      "status": "active",
      "speed": 65.5,
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "engine_temperature": 92.3,
      "fuel_level": 78.5,
      "last_update": "2025-01-06T10:30:45.123Z"
    }
  ]
}
```

### Query Alerts

```bash
# Get unacknowledged alerts
curl http://localhost:3000/api/alerts?acknowledged=false

# Get critical alerts
curl http://localhost:3000/api/alerts?severity=critical
```

### Acknowledge Alert

```bash
curl -X POST http://localhost:3000/api/alerts/alert-123/acknowledge
```

### Get Fleet Analytics

```bash
curl http://localhost:3000/api/analytics/stats
```

### Predict Maintenance

```bash
curl http://localhost:3000/api/analytics/maintenance/VEH-1001
```

---

## 📸 Screenshots

### Fleet Dashboard
*Real-time monitoring of all vehicles with live telemetry charts*

### Alert Management
*Comprehensive alert system with severity filtering and acknowledgment workflows*

### Vehicle Details
*Detailed view of individual vehicle status and historical telemetry*

> **Note**: Screenshots showcase the dark theme UI inspired by Vercel's observability platform

---

## 📁 Project Structure

```
Smart-Fleet-Monitoring-System/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes (Backend)
│   │   ├── alerts/          # Alert management endpoints
│   │   ├── analytics/       # Analytics and stats endpoints
│   │   ├── status/          # Fleet status endpoint
│   │   ├── telemetry/       # Telemetry ingestion endpoint
│   │   └── vehicles/        # Vehicle management endpoints
│   ├── alerts/              # Alerts page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components (40+)
│   ├── alert-notifications.tsx
│   ├── alerts-list.tsx
│   ├── fleet-dashboard.tsx
│   ├── fleet-stats.tsx
│   ├── telemetry-chart.tsx
│   └── vehicle-status-card.tsx
├── lib/                     # Core logic and utilities
│   ├── analytics.ts         # Analytics engine
│   ├── db.ts                # Database layer
│   ├── db-schema.ts         # TypeScript types
│   └── utils.ts             # Helper functions
├── scripts/                 # Python simulators & SQL
│   ├── 01_create_tables.sql
│   ├── 02_seed_data.sql
│   ├── vehicle_simulator.py
│   ├── kafka_producer_example.py
│   └── sample_telemetry.json
├── public/                  # Static assets
├── styles/                  # Additional styles
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.mjs          # Next.js config
├── tailwind.config.ts       # Tailwind config
├── README.md                # Quick start guide
├── DOCUMENTATION.md         # Technical documentation
└── SHOWCASE.md              # This file
```

---

## 🗄️ Database Schema

### Core Tables

#### 1. Vehicles Table
```sql
CREATE TABLE vehicles (
    vehicle_id VARCHAR(50) PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    year INTEGER,
    vin VARCHAR(17) UNIQUE,
    status VARCHAR(20) DEFAULT 'active',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_maintenance_date TIMESTAMP,
    next_maintenance_date TIMESTAMP
);
```

#### 2. Telemetry Table
```sql
CREATE TABLE telemetry (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES vehicles(vehicle_id),
    timestamp TIMESTAMP NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lon DECIMAL(11, 8),
    speed DECIMAL(5, 2),
    engine_temperature DECIMAL(5, 2),
    fuel_level DECIMAL(5, 2),
    odometer DECIMAL(10, 2),
    engine_status VARCHAR(20),
    tire_pressure_fl DECIMAL(4, 1),
    tire_pressure_fr DECIMAL(4, 1),
    tire_pressure_rl DECIMAL(4, 1),
    tire_pressure_rr DECIMAL(4, 1),
    battery_voltage DECIMAL(4, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_telemetry_vehicle_time ON telemetry(vehicle_id, timestamp DESC);
CREATE INDEX idx_telemetry_timestamp ON telemetry(timestamp DESC);
```

#### 3. Alerts Table
```sql
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) REFERENCES vehicles(vehicle_id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP,
    acknowledged_by VARCHAR(100),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_vehicle ON alerts(vehicle_id);
CREATE INDEX idx_alerts_severity ON alerts(severity, acknowledged);
CREATE INDEX idx_alerts_timestamp ON alerts(timestamp DESC);
```

### Database Views

#### Latest Vehicle Status View
```sql
CREATE VIEW latest_vehicle_status AS
SELECT DISTINCT ON (vehicle_id)
    vehicle_id,
    timestamp,
    location_lat,
    location_lon,
    speed,
    engine_temperature,
    fuel_level,
    engine_status
FROM telemetry
ORDER BY vehicle_id, timestamp DESC;
```

#### Critical Alerts View
```sql
CREATE VIEW critical_alerts AS
SELECT *
FROM alerts
WHERE severity = 'critical'
  AND acknowledged = FALSE
ORDER BY timestamp DESC;
```

---

## 🧠 Analytics Engine

The analytics engine is the brain of the fleet monitoring system, providing intelligent anomaly detection and predictive insights.

### Detection Thresholds

```typescript
{
  ENGINE_TEMP_CRITICAL: 110,    // °C
  ENGINE_TEMP_HIGH: 105,
  ENGINE_TEMP_WARNING: 100,
  FUEL_LEVEL_CRITICAL: 10,      // %
  FUEL_LEVEL_LOW: 15,
  SPEED_LIMIT: 100,             // km/h
  SPEED_EXCESSIVE: 120,
  TIRE_PRESSURE_LOW: 28,        // PSI
  TIRE_PRESSURE_HIGH: 36,
  BATTERY_VOLTAGE_LOW: 12.0,    // V
  BATTERY_VOLTAGE_HIGH: 14.8
}
```

### Anomaly Detection Flow

1. **Telemetry Ingestion** → Data received via API
2. **Threshold Checking** → Compare against defined thresholds
3. **Anomaly Classification** → Determine severity level
4. **Alert Generation** → Create alert if anomaly detected
5. **Notification** → Trigger UI notifications
6. **Database Logging** → Persist alert for historical tracking

### Predictive Maintenance

The system analyzes telemetry patterns to predict maintenance needs:

- **Engine Temperature Trends**: Detect gradual temperature increases
- **Fuel Efficiency**: Monitor fuel consumption patterns
- **Tire Wear**: Track pressure changes over time
- **Battery Health**: Analyze voltage stability
- **Odometer-Based**: Schedule maintenance based on mileage

---

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel
   ```

2. **Environment Variables**
   ```env
   DATABASE_URL=postgresql://...
   KAFKA_BROKERS=...
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Docker

**Dockerfile**
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

**Build and Run**
```bash
docker build -t fleet-monitoring .
docker run -p 3000:3000 fleet-monitoring
```

### Option 3: Traditional Hosting

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

### Production Infrastructure

For production deployment:

- ✅ **Database**: Supabase, Neon, or AWS RDS (PostgreSQL)
- ✅ **Message Queue**: Apache Kafka, AWS Kinesis, or Google Pub/Sub
- ✅ **Analytics**: AWS Lambda for serverless processing
- ✅ **Monitoring**: Vercel Analytics, Sentry, or Datadog
- ✅ **Authentication**: NextAuth.js with OAuth providers
- ✅ **CDN**: Vercel Edge Network or Cloudflare
- ✅ **Caching**: Redis for session and data caching

---

## 🤝 Contributing

Contributions are welcome! This is a demonstration project, but we're open to improvements.

### Areas for Contribution

- 🧪 **Testing**: Add comprehensive unit and integration tests
- 📊 **Analytics**: Implement advanced ML algorithms
- 🎨 **UI/UX**: Enhance dashboard with more interactive features
- 🚗 **Simulators**: Add more realistic driving scenarios
- 📚 **Documentation**: Improve guides and tutorials
- 🔒 **Security**: Implement authentication and authorization
- 📱 **Mobile**: Create responsive mobile views

### Contribution Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Vercel**: For hosting and deployment platform
- **shadcn**: For the beautiful UI component library
- **React Team**: For React 19
- **TypeScript Team**: For type safety
- **Open Source Community**: For continuous inspiration

---

## 📞 Support & Contact

- **GitHub Issues**: [Create an issue](https://github.com/johaankjis/Smart-Fleet-Monitoring-System/issues)
- **Documentation**: [Technical Documentation](DOCUMENTATION.md)
- **Quick Start**: [README](README.md)

---

<div align="center">

**Built with ❤️ using Next.js, React, and TypeScript**

⭐ Star this repository if you find it helpful!

[⬆ Back to Top](#-smart-fleet-monitoring-system)

</div>
