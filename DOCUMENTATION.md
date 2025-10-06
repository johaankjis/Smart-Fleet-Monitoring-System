# Smart Fleet Monitoring System - Technical Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [System Components](#system-components)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Analytics Engine](#analytics-engine)
- [Frontend Components](#frontend-components)
- [IoT Simulators](#iot-simulators)
- [Deployment Guide](#deployment-guide)
- [Development Guide](#development-guide)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Smart Fleet Monitoring System is a comprehensive IoT vehicle monitoring platform designed for real-time telemetry tracking, analytics, and alert management. It simulates a production-grade fleet monitoring architecture using modern web technologies while maintaining extensibility for real-world deployment.

### Key Features
- **Real-time Vehicle Tracking**: Monitor vehicle location, speed, and health metrics in real-time
- **Anomaly Detection**: Automated detection of critical vehicle conditions (overheating, low fuel, speed violations)
- **Predictive Maintenance**: AI-driven maintenance predictions based on telemetry patterns
- **Alert Management**: Comprehensive alert system with severity levels and acknowledgment workflows
- **Fleet Analytics**: Dashboard with fleet-wide statistics and individual vehicle monitoring
- **IoT Simulation**: Python-based vehicle simulators for realistic telemetry generation

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     IoT Vehicle Simulators                       │
│                         (Python Scripts)                         │
│     Generate realistic telemetry: location, speed, temp, etc.   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP POST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Kafka/Message Queue                          │
│                    (Simulated via REST API)                      │
│            Production: Apache Kafka, AWS Kinesis, etc.          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Backend (API Routes)                  │
│    - Telemetry Ingestion    - Vehicle Management                │
│    - Alert Processing        - Analytics Endpoints              │
└────────────┬───────────────────────┬────────────────────────────┘
             │                       │
             ▼                       ▼
┌──────────────────────┐   ┌────────────────────────────────────┐
│  Analytics Engine    │   │   Database Layer                   │
│  - Anomaly Detection │   │   - In-Memory (Development)        │
│  - Alert Generation  │   │   - PostgreSQL (Production)        │
│  - Predictive ML     │   │   - Tables: vehicles, telemetry,   │
│                      │   │     alerts                         │
└──────────┬───────────┘   └────────┬───────────────────────────┘
           │                        │
           └────────┬───────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              React Dashboard (Frontend)                          │
│   - Real-time Vehicle Monitoring  - Telemetry Charts            │
│   - Fleet Statistics              - Alert Management UI         │
│   - Auto-refresh (SWR)            - Dark Theme UI               │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Telemetry Generation**: Python simulators generate realistic vehicle data
2. **Data Ingestion**: Telemetry posted to `/api/telemetry` endpoint
3. **Real-time Analysis**: Analytics engine processes data for anomalies
4. **Alert Generation**: Critical conditions trigger automated alerts
5. **Database Storage**: Telemetry and alerts stored in database
6. **Frontend Display**: Dashboard auto-refreshes every 5 seconds using SWR
7. **User Interaction**: Operators acknowledge/resolve alerts through UI

### Design Patterns

- **Microservices-inspired**: API routes simulate independent services
- **Event-driven**: Telemetry ingestion triggers analytics processing
- **Real-time Updates**: SWR for automatic data refresh without polling overhead
- **Separation of Concerns**: Clear boundaries between data, business logic, and presentation

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Notifications**: Sonner (Toast notifications)
- **Icons**: Lucide React
- **Theme**: next-themes (Dark mode support)

### Backend
- **Runtime**: Next.js API Routes (Node.js)
- **Language**: TypeScript
- **Database**: In-memory (Development), PostgreSQL-compatible (Production)
- **Message Queue**: REST API simulation (Production: Kafka, AWS Kinesis)

### IoT Simulation
- **Language**: Python 3.x
- **Libraries**: 
  - `kafka-python` (for Kafka integration example)
  - `requests` (for HTTP telemetry posting)
  - Standard library for data generation

### Database
- **Development**: In-memory TypeScript objects
- **Production**: PostgreSQL, Supabase, or Neon
- **Schema**: Time-series optimized with indexes

### DevOps & Deployment
- **Hosting**: Vercel (recommended), AWS, Azure, GCP
- **Analytics**: Vercel Analytics (optional)
- **Monitoring**: Sentry (recommended for production)
- **Authentication**: NextAuth.js (for production)

---

## System Components

### 1. Backend API (`/app/api/*`)

#### Telemetry Service (`/api/telemetry`)
- **GET**: Retrieve telemetry data with optional vehicle filtering
- **POST**: Ingest new telemetry data from vehicles

#### Vehicle Service (`/api/vehicles`)
- **GET**: List all vehicles in the fleet
- **GET** (`/:id`): Get detailed information about a specific vehicle

#### Alert Service (`/api/alerts`)
- **GET**: Retrieve alerts with filtering (acknowledged/unacknowledged, severity)
- **POST** (`/:id/acknowledge`): Acknowledge a specific alert

#### Status Service (`/api/status`)
- **GET**: Get real-time status of all vehicles with latest telemetry

#### Analytics Service (`/api/analytics`)
- **GET** (`/stats`): Fleet-wide statistics and aggregations
- **GET** (`/maintenance/:id`): Predictive maintenance analysis for a vehicle

### 2. Analytics Engine (`/lib/analytics.ts`)

The analytics engine is the core intelligence of the system, responsible for:

#### Anomaly Detection Thresholds
```typescript
- ENGINE_TEMP_CRITICAL: 110°C
- ENGINE_TEMP_HIGH: 105°C
- ENGINE_TEMP_WARNING: 100°C
- FUEL_LEVEL_CRITICAL: 10%
- FUEL_LEVEL_LOW: 15%
- SPEED_LIMIT: 100 km/h
- SPEED_EXCESSIVE: 120 km/h
- TIRE_PRESSURE_LOW: 28 PSI
- TIRE_PRESSURE_HIGH: 36 PSI
- BATTERY_VOLTAGE_LOW: 12.0V
- BATTERY_VOLTAGE_HIGH: 14.8V
```

#### Analysis Functions
- `analyzeTelemetry()`: Detects anomalies in real-time telemetry data
- `processAndAlert()`: Processes telemetry and creates alerts automatically
- `calculateFleetStats()`: Aggregates fleet-wide metrics
- `predictMaintenance()`: Predicts maintenance needs based on historical data

### 3. Database Layer (`/lib/db.ts` & `/lib/db-schema.ts`)

#### In-Memory Implementation
For development and demonstration, the system uses in-memory storage with:
- Array-based storage for vehicles, telemetry, and alerts
- Automatic cleanup (keeps last 1000 records per vehicle)
- Type-safe interfaces matching PostgreSQL schema

#### Database Operations
- CRUD operations for vehicles, telemetry, and alerts
- Aggregated queries for vehicle status
- Time-series queries for telemetry history
- Alert filtering and acknowledgment

### 4. Frontend Components (`/components/*`)

#### Core Components
- **FleetDashboard** (`fleet-dashboard.tsx`): Main dashboard view
- **VehicleStatusCard** (`vehicle-status-card.tsx`): Individual vehicle metrics
- **TelemetryChart** (`telemetry-chart.tsx`): Real-time telemetry visualization
- **FleetStats** (`fleet-stats.tsx`): Fleet-wide statistics display
- **AlertsList** (`alerts-list.tsx`): Alert management interface
- **AlertNotifications** (`alert-notifications.tsx`): Toast notifications

#### UI Components (`/components/ui/*`)
Full set of shadcn/ui components including:
- Cards, Badges, Buttons
- Tabs, Tables, Dialogs
- Forms, Inputs, Selects
- Charts, Tooltips, Popovers
- And 30+ more UI primitives

### 5. IoT Simulators (`/scripts/*`)

#### Vehicle Simulator (`vehicle_simulator.py`)
- Generates realistic telemetry data for fleet vehicles
- Configurable fleet size and update intervals
- Simulates realistic patterns:
  - GPS movement (random walk)
  - Speed variations (0-120 km/h)
  - Engine temperature correlated with speed
  - Fuel consumption based on speed
  - Tire pressure variations
  - Battery voltage fluctuations
  - Random anomaly injection (overheating, low fuel)

#### Kafka Producer Example (`kafka_producer_example.py`)
- Example integration with Apache Kafka
- Shows how to stream telemetry to Kafka topics
- Production-ready pattern for event streaming

---

## Database Schema

### Tables

#### `vehicles`
Stores fleet vehicle information.

```sql
CREATE TABLE vehicles (
    vehicle_id VARCHAR(50) PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    vin VARCHAR(17) UNIQUE,
    license_plate VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    last_maintenance_date TIMESTAMP,
    next_maintenance_date TIMESTAMP,
    odometer DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `vehicle_id`
- Unique constraint on `vin`
- Index on `status` for filtering

#### `telemetry`
Stores time-series sensor data from vehicles.

```sql
CREATE TABLE telemetry (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(vehicle_id),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    speed DECIMAL(5, 2),
    engine_temperature DECIMAL(5, 2),
    fuel_level DECIMAL(5, 2),
    odometer DECIMAL(10, 2),
    engine_status VARCHAR(50),
    tire_pressure_fl DECIMAL(4, 1),
    tire_pressure_fr DECIMAL(4, 1),
    tire_pressure_rl DECIMAL(4, 1),
    tire_pressure_rr DECIMAL(4, 1),
    battery_voltage DECIMAL(4, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Foreign key on `vehicle_id`
- Composite index on `(vehicle_id, timestamp DESC)` for time-series queries
- Index on `timestamp` for temporal queries

#### `alerts`
Stores detected anomalies and maintenance alerts.

```sql
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(vehicle_id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    telemetry_id INTEGER REFERENCES telemetry(id),
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by VARCHAR(100),
    acknowledged_at TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- Primary key on `id`
- Foreign key on `vehicle_id` and `telemetry_id`
- Composite index on `(vehicle_id, acknowledged, created_at DESC)`
- Index on `severity` for priority sorting

### Views

#### `vehicle_latest_status`
Provides the latest telemetry and alert status for each vehicle.

```sql
CREATE VIEW vehicle_latest_status AS
SELECT 
    v.vehicle_id,
    v.vehicle_type,
    v.status AS vehicle_status,
    t.timestamp AS last_update,
    t.latitude,
    t.longitude,
    t.speed,
    t.engine_temperature,
    t.fuel_level,
    t.odometer,
    t.engine_status,
    t.battery_voltage,
    COUNT(a.id) AS unacknowledged_alerts
FROM vehicles v
LEFT JOIN LATERAL (
    SELECT * FROM telemetry
    WHERE vehicle_id = v.vehicle_id
    ORDER BY timestamp DESC
    LIMIT 1
) t ON TRUE
LEFT JOIN alerts a ON a.vehicle_id = v.vehicle_id 
    AND a.acknowledged = FALSE
GROUP BY v.vehicle_id, v.vehicle_type, v.status, 
    t.timestamp, t.latitude, t.longitude, t.speed,
    t.engine_temperature, t.fuel_level, t.odometer,
    t.engine_status, t.battery_voltage;
```

#### `critical_alerts`
Shows only critical and high-priority unacknowledged alerts.

```sql
CREATE VIEW critical_alerts AS
SELECT 
    a.id,
    a.vehicle_id,
    v.vehicle_type,
    a.alert_type,
    a.severity,
    a.message,
    a.acknowledged,
    a.created_at
FROM alerts a
JOIN vehicles v ON a.vehicle_id = v.vehicle_id
WHERE a.severity IN ('critical', 'high')
    AND a.acknowledged = FALSE
ORDER BY 
    CASE a.severity 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
    END,
    a.created_at DESC;
```

---

## API Documentation

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

### Response Format

All API responses follow this structure:

```typescript
{
  "success": boolean,
  "data": T | undefined,
  "error": string | undefined,
  "timestamp": string (ISO 8601)
}
```

### Endpoints

#### 1. Telemetry Endpoints

##### GET `/api/telemetry`
Retrieve telemetry data with optional filtering.

**Query Parameters:**
- `vehicleId` (optional): Filter by vehicle ID
- `limit` (optional): Number of records to return (default: 100, max: 1000)

**Example Request:**
```bash
curl "http://localhost:3000/api/telemetry?vehicleId=VEH-1001&limit=50"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vehicle_id": "VEH-1001",
      "timestamp": "2025-01-06T10:30:45.123Z",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "speed": 65.5,
      "engine_temperature": 92.3,
      "fuel_level": 78.5,
      "odometer": 125430.5,
      "engine_status": "normal",
      "tire_pressure_fl": 32.5,
      "tire_pressure_fr": 32.8,
      "tire_pressure_rl": 33.1,
      "tire_pressure_rr": 32.9,
      "battery_voltage": 13.8,
      "created_at": "2025-01-06T10:30:45.123Z"
    }
  ],
  "timestamp": "2025-01-06T10:30:50.000Z"
}
```

##### POST `/api/telemetry`
Ingest new telemetry data from a vehicle.

**Request Body:**
```json
{
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
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d @scripts/sample_telemetry.json
```

**Response:** Returns created telemetry record with 201 status.

#### 2. Vehicle Endpoints

##### GET `/api/vehicles`
List all vehicles in the fleet.

**Example Request:**
```bash
curl http://localhost:3000/api/vehicles
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "vehicle_id": "VEH-1001",
      "vehicle_type": "Truck",
      "make": "Freightliner",
      "model": "Cascadia",
      "year": 2022,
      "vin": "1FUJGHDV8NLXXXXXX",
      "license_plate": "TRK-001",
      "status": "active",
      "last_maintenance_date": "2024-12-01T00:00:00.000Z",
      "next_maintenance_date": "2025-03-01T00:00:00.000Z",
      "odometer": 125430.5,
      "created_at": "2025-01-06T10:00:00.000Z",
      "updated_at": "2025-01-06T10:00:00.000Z"
    }
  ],
  "timestamp": "2025-01-06T10:30:50.000Z"
}
```

##### GET `/api/vehicles/:vehicleId`
Get details of a specific vehicle.

**Example Request:**
```bash
curl http://localhost:3000/api/vehicles/VEH-1001
```

#### 3. Alert Endpoints

##### GET `/api/alerts`
Retrieve alerts with optional filtering.

**Query Parameters:**
- `vehicleId` (optional): Filter by vehicle ID
- `acknowledged` (optional): Filter by acknowledgment status (true/false)

**Example Request:**
```bash
curl "http://localhost:3000/api/alerts?acknowledged=false"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "vehicle_id": "VEH-1003",
      "alert_type": "overheating_critical",
      "severity": "critical",
      "message": "CRITICAL: Engine temperature at 112°C. Immediate shutdown recommended.",
      "telemetry_id": 15,
      "acknowledged": false,
      "acknowledged_by": null,
      "acknowledged_at": null,
      "resolved": false,
      "resolved_at": null,
      "created_at": "2025-01-06T10:15:00.000Z"
    }
  ],
  "timestamp": "2025-01-06T10:30:50.000Z"
}
```

##### POST `/api/alerts/:alertId/acknowledge`
Acknowledge a specific alert.

**Request Body:**
```json
{
  "acknowledged_by": "operator@example.com"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/alerts/1/acknowledge \
  -H "Content-Type: application/json" \
  -d '{"acknowledged_by": "operator@example.com"}'
```

#### 4. Status Endpoint

##### GET `/api/status`
Get real-time status of all vehicles with latest telemetry and alert counts.

**Example Request:**
```bash
curl http://localhost:3000/api/status
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "vehicle_id": "VEH-1001",
      "vehicle_type": "Truck",
      "vehicle_status": "active",
      "last_update": "2025-01-06T10:30:45.123Z",
      "latitude": 37.7749,
      "longitude": -122.4194,
      "speed": 65.5,
      "engine_temperature": 92.3,
      "fuel_level": 78.5,
      "odometer": 125430.5,
      "engine_status": "normal",
      "battery_voltage": 13.8,
      "unacknowledged_alerts": 0
    }
  ],
  "timestamp": "2025-01-06T10:30:50.000Z"
}
```

#### 5. Analytics Endpoints

##### GET `/api/analytics/stats`
Get fleet-wide statistics and aggregations.

**Example Request:**
```bash
curl http://localhost:3000/api/analytics/stats
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalVehicles": 5,
    "activeVehicles": 4,
    "maintenanceVehicles": 1,
    "totalAlerts": 3,
    "criticalAlerts": 1,
    "highAlerts": 1,
    "averageSpeed": 65.2,
    "averageEngineTemp": 94.8,
    "averageFuelLevel": 63.6
  },
  "timestamp": "2025-01-06T10:30:50.000Z"
}
```

##### GET `/api/analytics/maintenance/:vehicleId`
Get predictive maintenance analysis for a specific vehicle.

**Example Request:**
```bash
curl http://localhost:3000/api/analytics/maintenance/VEH-1001
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "maintenanceNeeded": true,
    "reasons": [
      "Consistently high engine temperature indicates cooling system issues",
      "High mileage since last maintenance"
    ],
    "estimatedDays": 30
  },
  "timestamp": "2025-01-06T10:30:50.000Z"
}
```

---

## Analytics Engine

### Overview
The Analytics Engine is a TypeScript-based event-driven system that processes telemetry data in real-time, detects anomalies, and generates alerts.

### Core Features

#### 1. Real-time Anomaly Detection
Analyzes incoming telemetry against predefined thresholds to identify critical conditions.

**Monitored Parameters:**
- **Engine Temperature**: Detects overheating (warning, high, critical levels)
- **Fuel Level**: Alerts for low fuel situations
- **Speed**: Identifies speed violations and excessive speeds
- **Tire Pressure**: Monitors all four tires for pressure anomalies
- **Battery Voltage**: Detects electrical system issues

#### 2. Automatic Alert Generation
When anomalies are detected, the system automatically:
1. Creates an alert record in the database
2. Assigns appropriate severity level (critical, high, medium, low)
3. Generates human-readable messages
4. Links alert to source telemetry record

#### 3. Fleet-wide Statistics
Calculates aggregated metrics across the entire fleet:
- Total, active, and maintenance vehicles
- Alert counts by severity
- Average speed, temperature, and fuel levels
- Vehicle health distribution

#### 4. Predictive Maintenance
Analyzes historical telemetry patterns to predict maintenance needs:
- Engine temperature trends
- Mileage-based maintenance scheduling
- Fuel efficiency analysis
- Battery health assessment
- Tire wear patterns

### Implementation Details

```typescript
// Example: Processing telemetry through analytics
const telemetry = await db.createTelemetry(payload);
await AnalyticsEngine.processAndAlert(payload);
```

The `processAndAlert` method:
1. Analyzes telemetry for anomalies
2. Creates alerts for detected issues
3. Returns immediately (non-blocking)
4. Simulates event-driven processing (like AWS Lambda)

### Extending the Analytics Engine

To add new anomaly detection rules:

1. Add threshold constants:
```typescript
private static readonly THRESHOLDS = {
  // Existing thresholds...
  NEW_METRIC_WARNING: 50,
  NEW_METRIC_CRITICAL: 75,
}
```

2. Add detection logic in `analyzeTelemetry()`:
```typescript
if (telemetry.new_metric >= this.THRESHOLDS.NEW_METRIC_CRITICAL) {
  anomalies.push({
    type: "new_metric_critical",
    severity: "critical",
    message: `New metric at critical level: ${telemetry.new_metric}`,
  });
}
```

---

## Frontend Components

### Dashboard Architecture

The frontend uses a component-based architecture with clear separation of concerns:

```
FleetDashboard (Main Container)
├── Header (Navigation, Alerts Badge)
├── FleetStats (Overview Metrics)
├── VehicleStatusCard (For each vehicle)
│   ├── Vehicle Info
│   ├── Status Badge
│   └── Alert Count
├── TelemetryChart (Selected Vehicle)
│   ├── Temperature Chart
│   ├── Speed Chart
│   └── Fuel Level Chart
├── AlertsList (Recent Alerts)
│   └── Alert Items
└── AlertNotifications (Toast Notifications)
```

### Data Fetching Strategy

Uses SWR for optimal data fetching:

```typescript
const { data, error } = useSWR<ApiResponse<VehicleLatestStatus[]>>(
  "/api/status", 
  fetcher, 
  { refreshInterval: 5000 }
);
```

**Benefits:**
- Automatic revalidation every 5 seconds
- Stale-while-revalidate pattern (shows cached data while fetching)
- Automatic error retry
- Focus revalidation (refreshes on window focus)
- Deduplication of requests

### Key Components

#### 1. FleetDashboard (`fleet-dashboard.tsx`)
Main container component that orchestrates the entire dashboard.

**Responsibilities:**
- Fetches fleet status and alerts
- Manages selected vehicle state
- Renders all child components
- Handles error states

#### 2. VehicleStatusCard (`vehicle-status-card.tsx`)
Displays individual vehicle metrics in a card format.

**Props:**
```typescript
{
  vehicle: VehicleLatestStatus;
  onClick: () => void;
  selected: boolean;
}
```

**Features:**
- Real-time metrics display
- Color-coded status badges
- Alert count indicators
- Click to select for detailed view

#### 3. TelemetryChart (`telemetry-chart.tsx`)
Visualizes telemetry data over time using Recharts.

**Props:**
```typescript
{
  vehicleId: string;
  metric: 'temperature' | 'speed' | 'fuel';
  limit?: number;
}
```

**Features:**
- Line charts for time-series data
- Responsive design
- Hover tooltips
- Color-coded thresholds

#### 4. FleetStats (`fleet-stats.tsx`)
Displays fleet-wide statistics and aggregations.

**Data Displayed:**
- Total vehicles
- Active/maintenance counts
- Alert statistics
- Average metrics

#### 5. AlertsList (`alerts-list.tsx`)
Shows recent alerts with filtering options.

**Features:**
- Severity-based filtering
- Acknowledgment actions
- Time-stamped alerts
- Vehicle association

#### 6. AlertNotifications (`alert-notifications.tsx`)
Toast notifications for real-time alerts.

**Features:**
- Non-intrusive notifications
- Auto-dismiss
- Severity-based icons
- Click to view details

### Styling Approach

The application uses Tailwind CSS with a custom design system:

**Color Scheme:**
- Background: Dark theme (inspired by Vercel observability)
- Primary: Blue accent for interactive elements
- Status Colors:
  - Success: Green
  - Warning: Yellow
  - Error: Red
  - Info: Blue

**Responsive Design:**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexbox and Grid for layouts

---

## IoT Simulators

### Vehicle Simulator

The Python-based vehicle simulator generates realistic telemetry data for testing and demonstration.

#### Features

1. **Realistic Movement Simulation**
   - Random walk algorithm for GPS coordinates
   - Natural speed variations (0-120 km/h)
   - Acceleration/deceleration patterns

2. **Temperature Modeling**
   - Engine temperature correlated with speed
   - Gradual heating/cooling (thermal inertia)
   - Random temperature spikes (5% probability)

3. **Fuel Consumption**
   - Speed-dependent fuel consumption
   - Realistic depletion rates
   - Low fuel warnings

4. **Tire Pressure Variation**
   - All four tires monitored independently
   - Random pressure fluctuations
   - Wear-based pressure changes

5. **Battery Monitoring**
   - Voltage variations
   - Charging/discharging patterns

#### Usage

```bash
# Basic usage
cd scripts
python vehicle_simulator.py

# With custom configuration
python vehicle_simulator.py --fleet-size 10 --interval 5
```

#### Configuration Options

```python
# In vehicle_simulator.py
FLEET_SIZE = 5  # Number of vehicles to simulate
UPDATE_INTERVAL = 10  # Seconds between telemetry updates
API_ENDPOINT = "http://localhost:3000/api/telemetry"
```

#### Sample Output

```json
{
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
}
```

### Kafka Producer Example

For production scenarios with Apache Kafka:

```python
from kafka import KafkaProducer
import json

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Send telemetry to Kafka topic
producer.send('vehicle-telemetry', telemetry_data)
```

---

## Deployment Guide

### Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/johaankjis/Smart-Fleet-Monitoring-System.git
cd Smart-Fleet-Monitoring-System
```

2. **Install dependencies:**
```bash
npm install
# or
pnpm install
```

3. **Run development server:**
```bash
npm run dev
```

4. **Start vehicle simulator (in another terminal):**
```bash
cd scripts
python vehicle_simulator.py
```

5. **Access the dashboard:**
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Deployment

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Configure environment variables in Vercel dashboard:**
```
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

#### Option 2: Docker

Create a `Dockerfile`:

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

Build and run:
```bash
docker build -t fleet-monitoring .
docker run -p 3000:3000 fleet-monitoring
```

#### Option 3: AWS/Azure/GCP

1. **Build the application:**
```bash
npm run build
```

2. **Deploy using platform-specific tools:**
   - AWS: Elastic Beanstalk, ECS, or App Runner
   - Azure: App Service or Container Instances
   - GCP: Cloud Run or App Engine

### Database Setup (Production)

#### Using Supabase

1. **Create Supabase project** at [supabase.com](https://supabase.com)

2. **Run SQL migrations:**
```bash
psql -U postgres -h your-project.supabase.co -d postgres -f scripts/01_create_tables.sql
psql -U postgres -h your-project.supabase.co -d postgres -f scripts/02_seed_data.sql
```

3. **Update database connection in code:**
Replace `/lib/db.ts` with Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const db = {
  async getVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*');
    return data || [];
  },
  // ... other methods
};
```

#### Using Neon

Similar to Supabase, but using Neon's PostgreSQL service.

### Message Queue Setup (Production)

#### Apache Kafka

1. **Install Kafka:**
```bash
# Using Docker
docker run -d --name kafka \
  -p 9092:9092 \
  apache/kafka:latest
```

2. **Create topic:**
```bash
kafka-topics --create \
  --topic vehicle-telemetry \
  --bootstrap-server localhost:9092
```

3. **Update telemetry ingestion to consume from Kafka**

---

## Development Guide

### Project Structure

```
Smart-Fleet-Monitoring-System/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── alerts/
│   │   ├── analytics/
│   │   ├── status/
│   │   ├── telemetry/
│   │   └── vehicles/
│   ├── alerts/               # Alerts page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── alert-notifications.tsx
│   ├── alerts-list.tsx
│   ├── fleet-dashboard.tsx
│   ├── fleet-stats.tsx
│   ├── telemetry-chart.tsx
│   └── vehicle-status-card.tsx
├── lib/                      # Utilities and core logic
│   ├── analytics.ts          # Analytics engine
│   ├── db.ts                 # Database layer
│   ├── db-schema.ts          # Type definitions
│   └── utils.ts              # Helper functions
├── scripts/                  # Python simulators & SQL
│   ├── 01_create_tables.sql
│   ├── 02_seed_data.sql
│   ├── vehicle_simulator.py
│   ├── kafka_producer_example.py
│   └── sample_telemetry.json
├── public/                   # Static assets
├── styles/                   # Additional styles
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.mjs           # Next.js config
├── tailwind.config.ts        # Tailwind config
└── README.md                 # Project README
```

### Adding New Features

#### 1. Adding a New Telemetry Metric

**Step 1:** Update TypeScript types in `/lib/db-schema.ts`:
```typescript
export interface Telemetry {
  // ... existing fields
  new_metric?: number;
}
```

**Step 2:** Update database schema in `/scripts/01_create_tables.sql`:
```sql
ALTER TABLE telemetry ADD COLUMN new_metric DECIMAL(5, 2);
```

**Step 3:** Update vehicle simulator in `/scripts/vehicle_simulator.py`:
```python
def generate_telemetry(self):
    # ... existing code
    return {
        # ... existing fields
        "new_metric": random.uniform(0, 100)
    }
```

**Step 4:** Add analytics rule in `/lib/analytics.ts`:
```typescript
// Add threshold
NEW_METRIC_WARNING: 75,

// Add detection logic
if (telemetry.new_metric >= this.THRESHOLDS.NEW_METRIC_WARNING) {
  anomalies.push({
    type: "new_metric_warning",
    severity: "medium",
    message: `New metric at warning level: ${telemetry.new_metric}`,
  });
}
```

#### 2. Adding a New API Endpoint

Create a new route file in `/app/api/your-endpoint/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { ApiResponse } from "@/lib/db-schema";

export async function GET(request: NextRequest) {
  try {
    const data = await db.yourMethod();
    
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}
```

### Code Style Guidelines

1. **TypeScript**: Use strict typing, avoid `any`
2. **React**: Use functional components with hooks
3. **Naming**: 
   - Components: PascalCase (`VehicleStatusCard`)
   - Files: kebab-case (`vehicle-status-card.tsx`)
   - Functions: camelCase (`getVehicles`)
4. **Imports**: Organize by external, internal, types
5. **Comments**: Use JSDoc for functions, inline for complex logic

### Testing

While the current implementation doesn't include tests, here's how you would add them:

#### Unit Tests (Jest)

```typescript
// __tests__/analytics.test.ts
import { AnalyticsEngine } from '@/lib/analytics';

describe('AnalyticsEngine', () => {
  it('detects critical engine temperature', async () => {
    const telemetry = {
      engine_temperature: 115,
      // ... other fields
    };
    
    const result = await AnalyticsEngine.analyzeTelemetry(telemetry);
    
    expect(result.hasAnomaly).toBe(true);
    expect(result.anomalies[0].severity).toBe('critical');
  });
});
```

#### Integration Tests (Playwright)

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard displays vehicles', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await expect(page.locator('text=VEH-1001')).toBeVisible();
  await expect(page.locator('[data-testid="vehicle-card"]')).toHaveCount(5);
});
```

---

## Security Considerations

### Current Implementation
The current implementation is designed for **demonstration and development** purposes. It lacks production-level security features.

### Production Security Checklist

#### 1. Authentication & Authorization
- [ ] Implement NextAuth.js for user authentication
- [ ] Add role-based access control (RBAC)
- [ ] Secure API endpoints with middleware
- [ ] Use JWT tokens for stateless authentication

```typescript
// Example: Protecting an API route
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // ... protected logic
}
```

#### 2. API Security
- [ ] Rate limiting (using middleware or Vercel protection)
- [ ] Input validation (Zod schemas)
- [ ] SQL injection prevention (parameterized queries)
- [ ] CORS configuration
- [ ] API key authentication for external systems

#### 3. Data Protection
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for all communications
- [ ] Secure database connections (SSL/TLS)
- [ ] Hash passwords with bcrypt
- [ ] Implement data retention policies

#### 4. Environment Variables
- [ ] Never commit secrets to Git
- [ ] Use `.env.local` for local development
- [ ] Use platform secret management in production
- [ ] Rotate credentials regularly

```bash
# .env.local (never commit this file)
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your-super-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 5. Monitoring & Logging
- [ ] Implement error tracking (Sentry)
- [ ] Log security events
- [ ] Monitor API usage
- [ ] Set up alerts for suspicious activity

---

## Performance Optimization

### Current Optimizations

1. **In-memory Database**: Fast reads/writes for development
2. **SWR Caching**: Reduces redundant API calls
3. **Auto-cleanup**: Limits telemetry to last 1000 records per vehicle
4. **Lazy Loading**: Components load on demand
5. **Code Splitting**: Next.js automatic code splitting

### Production Optimizations

#### 1. Database Optimization
- Add indexes on frequently queried columns
- Implement database connection pooling
- Use read replicas for heavy read workloads
- Archive old telemetry data

```sql
-- Partitioning for time-series data
CREATE TABLE telemetry_2025_01 PARTITION OF telemetry
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

#### 2. Caching Strategy
- Redis for session storage
- CDN for static assets
- API response caching (stale-while-revalidate)
- Client-side caching with SWR

#### 3. API Optimization
- Pagination for large datasets
- Field selection (GraphQL or sparse fieldsets)
- Compression (gzip/brotli)
- HTTP/2 or HTTP/3

```typescript
// Example: Pagination
export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get('page') || '1');
  const limit = Number(request.nextUrl.searchParams.get('limit') || '50');
  
  const telemetry = await db.getTelemetry(undefined, limit, (page - 1) * limit);
  // ...
}
```

#### 4. Frontend Optimization
- Image optimization (next/image)
- Bundle analysis and tree shaking
- Lazy load charts and heavy components
- Memoization (React.memo, useMemo)

#### 5. Real-time Updates
Replace polling with WebSockets or Server-Sent Events:

```typescript
// Example: WebSocket for real-time telemetry
const ws = new WebSocket('wss://your-domain.com/ws');

ws.onmessage = (event) => {
  const telemetry = JSON.parse(event.data);
  updateDashboard(telemetry);
};
```

---

## Troubleshooting

### Common Issues

#### 1. API Endpoints Returning 404
**Cause**: Next.js routing issue or incorrect path.

**Solution:**
- Ensure API route files are named `route.ts` (not `index.ts`)
- Check file structure matches URL pattern
- Restart development server

#### 2. Telemetry Not Appearing in Dashboard
**Cause**: Vehicle simulator not running or API endpoint mismatch.

**Solution:**
```bash
# Check if simulator is running
ps aux | grep vehicle_simulator

# Verify API endpoint in simulator
# Edit vehicle_simulator.py and check API_ENDPOINT

# Test API manually
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d @scripts/sample_telemetry.json
```

#### 3. Database Connection Errors (Production)
**Cause**: Incorrect connection string or firewall rules.

**Solution:**
- Verify `DATABASE_URL` environment variable
- Check database firewall allows connections
- Test connection with `psql` command
- Ensure SSL is configured if required

#### 4. High Memory Usage
**Cause**: In-memory database growing too large.

**Solution:**
- Implement more aggressive telemetry cleanup
- Reduce `UPDATE_INTERVAL` in simulator
- Switch to persistent database for production

#### 5. SWR Not Refreshing
**Cause**: Cache configuration or network issues.

**Solution:**
```typescript
// Force revalidation
import { mutate } from 'swr';
mutate('/api/status');

// Adjust refresh interval
useSWR('/api/status', fetcher, { 
  refreshInterval: 3000,
  revalidateOnFocus: true 
});
```

### Debug Mode

Enable detailed logging:

```typescript
// Add to API routes
console.log('Request:', request.method, request.url);
console.log('Body:', await request.json());
console.log('Response:', response);
```

### Performance Monitoring

```typescript
// Add to components
import { useEffect } from 'react';

useEffect(() => {
  console.time('Dashboard Render');
  return () => {
    console.timeEnd('Dashboard Render');
  };
}, []);
```

---

## Future Enhancements

### Planned Features

1. **Advanced Analytics**
   - Machine learning for predictive maintenance
   - Route optimization
   - Fuel efficiency analysis
   - Driver behavior scoring

2. **Enhanced Visualizations**
   - Map view with vehicle locations
   - Heat maps for fleet activity
   - Custom dashboard builder
   - Export reports (PDF/Excel)

3. **Integration Capabilities**
   - Webhook support for alerts
   - Third-party integrations (Slack, Teams, PagerDuty)
   - REST API for external systems
   - GraphQL API

4. **Mobile Application**
   - React Native mobile app
   - Push notifications
   - Offline support
   - Driver mobile interface

5. **Advanced Features**
   - Multi-tenant support
   - Custom alert rules engine
   - Scheduled reports
   - Audit logging
   - Data export and backup

---

## Contributing

This is a demonstration project, but contributions are welcome! Areas for improvement:

- Add comprehensive test coverage
- Implement additional analytics algorithms
- Enhance UI/UX with more interactive features
- Add more realistic simulator scenarios
- Improve documentation

---

## License

MIT License - See LICENSE file for details.

---

## Support & Contact

For questions or support:
- GitHub Issues: [Create an issue](https://github.com/johaankjis/Smart-Fleet-Monitoring-System/issues)
- Documentation: This file
- README: See README.md for quick start guide

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Author**: Smart Fleet Monitoring System Team
