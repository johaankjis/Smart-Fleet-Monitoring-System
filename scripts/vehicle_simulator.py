"""
IoT Vehicle Simulator
Generates realistic telemetry data for fleet vehicles
Simulates: location, speed, temperature, fuel level, engine status
"""

import json
import random
import time
from datetime import datetime
from typing import Dict, List

class VehicleSimulator:
    def __init__(self, vehicle_id: str, vehicle_type: str, initial_lat: float, initial_lon: float):
        self.vehicle_id = vehicle_id
        self.vehicle_type = vehicle_type
        self.latitude = initial_lat
        self.longitude = initial_lon
        self.speed = 0.0
        self.engine_temp = 70.0  # Celsius
        self.fuel_level = 100.0  # Percentage
        self.odometer = random.randint(10000, 150000)  # km
        self.engine_status = "normal"
        self.last_maintenance = datetime.now().isoformat()
        
    def generate_telemetry(self) -> Dict:
        """Generate a single telemetry data point"""
        
        # Simulate movement (random walk)
        self.latitude += random.uniform(-0.001, 0.001)
        self.longitude += random.uniform(-0.001, 0.001)
        
        # Simulate speed variations (0-120 km/h)
        self.speed = max(0, min(120, self.speed + random.uniform(-10, 10)))
        
        # Engine temperature correlates with speed
        target_temp = 70 + (self.speed / 120) * 50  # 70-120°C range
        self.engine_temp += (target_temp - self.engine_temp) * 0.1
        
        # Add random temperature spikes (simulate potential issues)
        if random.random() < 0.05:  # 5% chance
            self.engine_temp += random.uniform(5, 15)
        
        # Fuel consumption (decreases with speed)
        if self.speed > 0:
            self.fuel_level -= (self.speed / 120) * 0.1
            self.fuel_level = max(0, self.fuel_level)
        
        # Odometer increases with speed
        self.odometer += self.speed / 3600  # Convert to km per second
        
        # Determine engine status based on conditions
        if self.engine_temp > 105:
            self.engine_status = "overheating"
        elif self.fuel_level < 15:
            self.engine_status = "low_fuel"
        elif self.speed > 100:
            self.engine_status = "high_speed"
        else:
            self.engine_status = "normal"
        
        # Generate telemetry payload
        telemetry = {
            "vehicle_id": self.vehicle_id,
            "vehicle_type": self.vehicle_type,
            "timestamp": datetime.now().isoformat(),
            "location": {
                "latitude": round(self.latitude, 6),
                "longitude": round(self.longitude, 6)
            },
            "speed": round(self.speed, 2),
            "engine_temperature": round(self.engine_temp, 2),
            "fuel_level": round(self.fuel_level, 2),
            "odometer": round(self.odometer, 2),
            "engine_status": self.engine_status,
            "tire_pressure": {
                "front_left": round(random.uniform(30, 35), 1),
                "front_right": round(random.uniform(30, 35), 1),
                "rear_left": round(random.uniform(30, 35), 1),
                "rear_right": round(random.uniform(30, 35), 1)
            },
            "battery_voltage": round(random.uniform(12.0, 14.5), 2)
        }
        
        return telemetry


def simulate_fleet(num_vehicles: int = 5, duration_seconds: int = 60, interval_seconds: int = 2):
    """
    Simulate a fleet of vehicles sending telemetry data
    
    Args:
        num_vehicles: Number of vehicles to simulate
        duration_seconds: How long to run the simulation
        interval_seconds: Time between telemetry transmissions
    """
    
    # Initialize fleet with different vehicle types and starting locations
    vehicle_types = ["Truck", "Van", "Sedan", "SUV"]
    base_locations = [
        (37.7749, -122.4194),  # San Francisco
        (34.0522, -118.2437),  # Los Angeles
        (40.7128, -74.0060),   # New York
        (41.8781, -87.6298),   # Chicago
        (29.7604, -95.3698),   # Houston
    ]
    
    fleet: List[VehicleSimulator] = []
    for i in range(num_vehicles):
        vehicle_id = f"VEH-{1000 + i}"
        vehicle_type = random.choice(vehicle_types)
        lat, lon = base_locations[i % len(base_locations)]
        fleet.append(VehicleSimulator(vehicle_id, vehicle_type, lat, lon))
    
    print(f"[Fleet Simulator] Starting simulation with {num_vehicles} vehicles")
    print(f"[Fleet Simulator] Duration: {duration_seconds}s, Interval: {interval_seconds}s")
    print("-" * 80)
    
    start_time = time.time()
    iteration = 0
    
    try:
        while time.time() - start_time < duration_seconds:
            iteration += 1
            print(f"\n[Iteration {iteration}] Timestamp: {datetime.now().strftime('%H:%M:%S')}")
            
            # Generate telemetry for each vehicle
            for vehicle in fleet:
                telemetry = vehicle.generate_telemetry()
                
                # Print telemetry (in production, this would be sent to Kafka)
                print(f"  {telemetry['vehicle_id']} | "
                      f"Speed: {telemetry['speed']}km/h | "
                      f"Temp: {telemetry['engine_temperature']}°C | "
                      f"Fuel: {telemetry['fuel_level']}% | "
                      f"Status: {telemetry['engine_status']}")
                
                # In production: send to Kafka
                # producer.send('vehicle-telemetry', value=telemetry)
            
            time.sleep(interval_seconds)
    
    except KeyboardInterrupt:
        print("\n[Fleet Simulator] Simulation stopped by user")
    
    print("\n" + "-" * 80)
    print(f"[Fleet Simulator] Simulation completed. Total iterations: {iteration}")


if __name__ == "__main__":
    # Run simulation with 5 vehicles for 60 seconds, sending data every 2 seconds
    simulate_fleet(num_vehicles=5, duration_seconds=60, interval_seconds=2)
