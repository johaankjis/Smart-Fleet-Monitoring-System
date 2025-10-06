-- Fleet Monitoring System Database Schema
-- PostgreSQL compatible schema for vehicles, telemetry, and alerts

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
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

-- Create telemetry table (stores all vehicle sensor data)
CREATE TABLE IF NOT EXISTS telemetry (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
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

-- Create alerts table (stores anomaly detections and warnings)
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    vehicle_id VARCHAR(50) NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_id ON telemetry(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_vehicle_timestamp ON telemetry(vehicle_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_vehicle_id ON alerts(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON alerts(acknowledged);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

-- Create view for latest vehicle status
CREATE OR REPLACE VIEW vehicle_latest_status AS
SELECT 
    v.vehicle_id,
    v.vehicle_type,
    v.status as vehicle_status,
    t.timestamp as last_update,
    t.latitude,
    t.longitude,
    t.speed,
    t.engine_temperature,
    t.fuel_level,
    t.odometer,
    t.engine_status,
    t.battery_voltage,
    (SELECT COUNT(*) FROM alerts a 
     WHERE a.vehicle_id = v.vehicle_id 
     AND a.acknowledged = FALSE) as unacknowledged_alerts
FROM vehicles v
LEFT JOIN LATERAL (
    SELECT * FROM telemetry 
    WHERE vehicle_id = v.vehicle_id 
    ORDER BY timestamp DESC 
    LIMIT 1
) t ON true;

-- Create view for critical alerts
CREATE OR REPLACE VIEW critical_alerts AS
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
ORDER BY a.created_at DESC;

COMMENT ON TABLE vehicles IS 'Master table for all fleet vehicles';
COMMENT ON TABLE telemetry IS 'Time-series data from vehicle sensors';
COMMENT ON TABLE alerts IS 'Anomaly detections and system alerts';
COMMENT ON VIEW vehicle_latest_status IS 'Latest telemetry status for each vehicle';
COMMENT ON VIEW critical_alerts IS 'Unacknowledged critical and high severity alerts';
