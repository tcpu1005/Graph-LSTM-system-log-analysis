# data_simulator.py 
import requests
import time
import json
import random

def generate_event_sequence(type_id):
    """Generate a sequence of events with a wide length range based on the type_id (normal or abnormal)."""
    if type_id == "normal":
        # Normal sequences with 5 to ~20 events without repetitive error-prone events
        return random.choices(['E1', 'E2', 'E5', 'E11', 'E9', 'E22'], k=random.randint(5, 20))
    else:
        # Abnormal sequences with ~20 to a very large number of events, containing repetitive error events
        base_events = ['E3', 'E4', 'E26', 'E23', 'E21']
        return base_events + random.choices(base_events + ['E5', 'E9', 'E11', 'E28'], k=random.randint(20, 100))

def generate_block_id():
    """Generate a unique block ID simulating typical ID patterns."""
    return f"blk_{random.randint(-999999999999999999, 999999999999999999)}"

def create_simulated_data(n_normal=1000, n_abnormal=10):
    """Generate a list of simulated data dictionaries with the specified number of normal and abnormal data."""
    simulated_data = []
    
    # Generate normal data
    for _ in range(n_normal):
        simulated_data.append({
            "block_id": generate_block_id(),
            "events": generate_event_sequence("normal")
        })

    # Generate abnormal data
    for _ in range(n_abnormal):
        simulated_data.append({
            "block_id": generate_block_id(),
            "events": generate_event_sequence("abnormal")
        })

    return simulated_data

def simulate_data_stream():
    test_data = create_simulated_data()
    
    for data in test_data:
        response = requests.post('http://localhost:5000/predict', json=data)
        print(response.json())
        time.sleep(2)  # 2초 간격으로 데이터 전송

if __name__ == '__main__':
    simulate_data_stream()
