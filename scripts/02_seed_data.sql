-- Seed data for Fleet Monitoring System
-- Insert sample vehicles and initial telemetry

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_id, vehicle_type, make, model, year, vin, license_plate, status, last_maintenance_date, next_maintenance_date, odometer)
VALUES 
    ('VEH-1001', 'Truck', 'Freightliner', 'Cascadia', 2022, '1FUJGHDV8NLXXXXXX', 'TRK-001', 'active', '2024-12-01', '2025-03-01', 125430.50),
    ('VEH-1002', 'Van', 'Ford', 'Transit', 2023, '1FTBW2CM5PKA12345', 'VAN-002', 'active', '2024-11-15', '2025-02-15', 87650.25),
    ('VEH-1003', 'Sedan', 'Toyota', 'Camry', 2023, '4T1B11HK5KU123456', 'SED-003', 'active', '2024-12-10', '2025-03-10', 45230.75),
    ('VEH-1004', 'SUV', 'Chevrolet', 'Tahoe', 2022, '1GNSKCKD8NR123456', 'SUV-004', 'active', '2024-11-20', '2025-02-20', 98765.00),
    ('VEH-1005', 'Truck', 'Peterbilt', '579', 2021, '1XPWD40X1ED123456', 'TRK-005', 'maintenance', '2024-12-15', '2025-01-15', 156890.30)
ON CONFLICT (vehicle_id) DO NOTHING;

-- Insert sample telemetry data (last 24 hours simulation)
INSERT INTO telemetry (vehicle_id, timestamp, latitude, longitude, speed, engine_temperature, fuel_level, odometer, engine_status, tire_pressure_fl, tire_pressure_fr, tire_pressure_rl, tire_pressure_rr, battery_voltage)
VALUES 
    -- VEH-1001 (Normal operation)
    ('VEH-1001', NOW() - INTERVAL '1 hour', 37.774929, -122.419416, 65.5, 92.3, 78.5, 125430.50, 'normal', 32.5, 32.8, 33.1, 32.9, 13.8),
    ('VEH-1001', NOW() - INTERVAL '30 minutes', 37.784929, -122.409416, 70.2, 94.1, 77.8, 125465.30, 'normal', 32.4, 32.7, 33.0, 32.8, 13.9),
    ('VEH-1001', NOW() - INTERVAL '5 minutes', 37.794929, -122.399416, 55.0, 88.5, 77.2, 125485.10, 'normal', 32.5, 32.8, 33.1, 32.9, 13.7),
    
    -- VEH-1002 (Low fuel warning)
    ('VEH-1002', NOW() - INTERVAL '2 hours', 34.052235, -118.243683, 45.0, 85.2, 18.5, 87650.25, 'low_fuel', 31.5, 31.8, 32.1, 31.9, 13.5),
    ('VEH-1002', NOW() - INTERVAL '1 hour', 34.062235, -118.233683, 50.3, 87.8, 16.2, 87680.50, 'low_fuel', 31.4, 31.7, 32.0, 31.8, 13.6),
    ('VEH-1002', NOW() - INTERVAL '10 minutes', 34.072235, -118.223683, 35.0, 82.1, 14.8, 87695.30, 'low_fuel', 31.5, 31.8, 32.1, 31.9, 13.4),
    
    -- VEH-1003 (Overheating issue)
    ('VEH-1003', NOW() - INTERVAL '3 hours', 40.712776, -74.005974, 80.0, 98.5, 65.0, 45230.75, 'normal', 33.0, 33.2, 33.5, 33.3, 14.0),
    ('VEH-1003', NOW() - INTERVAL '1.5 hours', 40.722776, -74.015974, 95.5, 108.2, 63.5, 45275.20, 'overheating', 33.1, 33.3, 33.6, 33.4, 13.8),
    ('VEH-1003', NOW() - INTERVAL '15 minutes', 40.732776, -74.025974, 110.0, 112.5, 62.0, 45310.50, 'overheating', 33.2, 33.4, 33.7, 33.5, 13.9),
    
    -- VEH-1004 (Normal operation)
    ('VEH-1004', NOW() - INTERVAL '45 minutes', 41.878113, -87.629799, 60.0, 90.0, 55.0, 98765.00, 'normal', 32.0, 32.3, 32.6, 32.4, 13.6),
    ('VEH-1004', NOW() - INTERVAL '20 minutes', 41.888113, -87.619799, 65.5, 92.5, 54.2, 98790.25, 'normal', 32.1, 32.4, 32.7, 32.5, 13.7),
    
    -- VEH-1005 (In maintenance - no recent data)
    ('VEH-1005', NOW() - INTERVAL '5 days', 29.760427, -95.369804, 0.0, 70.0, 45.0, 156890.30, 'normal', 30.0, 30.0, 30.0, 30.0, 12.5)
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (vehicle_id, alert_type, severity, message, acknowledged, created_at)
VALUES 
    ('VEH-1003', 'overheating', 'critical', 'Engine temperature exceeded 110°C. Immediate attention required.', FALSE, NOW() - INTERVAL '15 minutes'),
    ('VEH-1002', 'low_fuel', 'high', 'Fuel level below 15%. Refueling recommended.', FALSE, NOW() - INTERVAL '10 minutes'),
    ('VEH-1001', 'maintenance_due', 'medium', 'Scheduled maintenance due within 30 days.', TRUE, NOW() - INTERVAL '2 days'),
    ('VEH-1004', 'tire_pressure', 'low', 'Front left tire pressure slightly below recommended level.', TRUE, NOW() - INTERVAL '1 day'),
    ('VEH-1003', 'high_speed', 'medium', 'Vehicle exceeded speed limit of 100 km/h.', FALSE, NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;
