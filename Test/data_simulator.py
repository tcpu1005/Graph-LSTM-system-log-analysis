# data_simulator.py
import requests
import time
import json

def simulate_data_stream():
    test_data = [
        {'block_id': 'blk_1001', 'events': ['E1', 'E2', 'E3']},  # 임의의 이벤트 시퀀스
        {'block_id': 'blk_1002', 'events': ['E4', 'E5', 'E6']},
        {'block_id': 'blk_1003', 'events': ['E7', 'E8', 'E9']},
        # 추가 테스트 데이터
        {'block_id': 'blk_7854771516489510256', 'events': ['E5','E5','E22','E5','E11','E9','E11','E9','E11','E9','E26','E26','E26','E2','E2','E2','E4','E4','E4','E4','E4','E4','E4','E4','E4','E4','E4','E4','E3','E4','E4','E4','E23','E23','E23','E21','E21','E21']},
        {'block_id': 'blk_-3544583377289625738', 'events': [
            'E5', 'E22', 'E5', 'E5', 'E11', 'E9', 'E11', 'E9', 'E11', 'E9',
            'E3', 'E26', 'E26', 'E26', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3', 'E3',
            'E3', 'E3', 'E3', 'E23', 'E23', 'E23', 'E21', 'E21', 'E21',
            'E20']},
        {'block_id': 'blk_-8531310335568756456','events': [
            'E5', 'E22', 'E5', 'E5', 'E11', 'E9', 'E11', 'E9', 'E11', 'E9',
            'E26', 'E26', 'E26', 'E2', 'E2', 'E2', 'E4', 'E4', 'E4', 'E4',
            'E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'E4', 'E4',
            'E3', 'E23', 'E23', 'E23', 'E21', 'E21', 'E28', 'E26', 'E21'
        ]},
    ]
    for data in test_data:
        response = requests.post('http://localhost:5000/predict', json=data)
        print(response.json())
        time.sleep(5)  # 5초 간격으로 데이터 전송

if __name__ == '__main__':
    simulate_data_stream()
