"""
Kafka Producer Example
Demonstrates how to send vehicle telemetry to Kafka
Note: Requires kafka-python library (pip install kafka-python)
"""

import json
import time
from datetime import datetime
from vehicle_simulator import VehicleSimulator

# Uncomment when using actual Kafka
# from kafka import KafkaProducer

def create_kafka_producer():
    """
    Create and configure Kafka producer
    In production, configure with your Kafka broker addresses
    """
    # Example Kafka producer configuration
    # producer = KafkaProducer(
    #     bootstrap_servers=['localhost:9092'],
    #     value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    #     key_serializer=lambda k: k.encode('utf-8') if k else None,
    #     acks='all',  # Wait for all replicas to acknowledge
    #     retries=3,
    #     max_in_flight_requests_per_connection=1
    # )
    # return producer
    
    print("[Kafka Producer] Mock producer created (replace with actual Kafka configuration)")
    return None


def send_telemetry_to_kafka(producer, telemetry: dict, topic: str = "vehicle-telemetry"):
    """
    Send telemetry data to Kafka topic
    
    Args:
        producer: Kafka producer instance
        telemetry: Vehicle telemetry data
        topic: Kafka topic name
    """
    try:
        if producer:
            # Send to Kafka with vehicle_id as key for partitioning
            # future = producer.send(
            #     topic,
            #     key=telemetry['vehicle_id'],
            #     value=telemetry
            # )
            # record_metadata = future.get(timeout=10)
            # print(f"[Kafka] Sent to {record_metadata.topic}:{record_metadata.partition}")
            pass
        else:
            # Mock: just print the data
            print(f"[Mock Kafka] Would send to topic '{topic}': {telemetry['vehicle_id']}")
    
    except Exception as e:
        print(f"[Kafka Error] Failed to send telemetry: {e}")


def main():
    """
    Main function to simulate vehicles and send data to Kafka
    """
    print("=" * 80)
    print("IoT Vehicle Simulator with Kafka Integration")
    print("=" * 80)
    
    # Create Kafka producer
    producer = create_kafka_producer()
    
    # Initialize vehicles
    vehicles = [
        VehicleSimulator("VEH-1001", "Truck", 37.7749, -122.4194),
        VehicleSimulator("VEH-1002", "Van", 34.0522, -118.2437),
        VehicleSimulator("VEH-1003", "Sedan", 40.7128, -74.0060),
    ]
    
    print(f"\n[Simulator] Initialized {len(vehicles)} vehicles")
    print("[Simulator] Starting telemetry transmission...\n")
    
    try:
        iteration = 0
        while True:
            iteration += 1
            print(f"\n--- Iteration {iteration} | {datetime.now().strftime('%H:%M:%S')} ---")
            
            for vehicle in vehicles:
                telemetry = vehicle.generate_telemetry()
                send_telemetry_to_kafka(producer, telemetry)
                
                # Print summary
                status_emoji = "🔥" if telemetry['engine_status'] == "overheating" else "✓"
                print(f"  {status_emoji} {telemetry['vehicle_id']}: "
                      f"{telemetry['speed']}km/h, "
                      f"{telemetry['engine_temperature']}°C, "
                      f"{telemetry['fuel_level']}% fuel")
            
            time.sleep(3)  # Send telemetry every 3 seconds
    
    except KeyboardInterrupt:
        print("\n\n[Simulator] Shutting down...")
        if producer:
            # producer.flush()
            # producer.close()
            pass
        print("[Simulator] Stopped successfully")


if __name__ == "__main__":
    main()
