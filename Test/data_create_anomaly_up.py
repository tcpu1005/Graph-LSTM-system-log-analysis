# data_create_anomaly_up.py

import requests
import time
import pandas as pd
import ast
import re
import random
import logging


def load_data_from_csv():
    # CSV 파일 읽기
    df_traces = pd.read_csv('Event_traces_anomaly_up.csv')
    df_labels = pd.read_csv('anomaly_label_anomaly_up.csv')

    # BlockId를 기준으로 데이터 병합 (접미사 지정)
    df = pd.merge(df_traces, df_labels, on='BlockId', suffixes=('_traces', '_labels'))

    # 병합된 데이터프레임의 컬럼명 확인
    print("Merged df columns:", df.columns.tolist())

    data_list = []
    for index, row in df.iterrows():
        block_id = row['BlockId']
        features = row['Features']
        label = row['Label_labels']  # df_labels의 'Label' 컬럼 사용

        # 문자열 형태의 리스트를 올바른 형식으로 변환
        features_converted = re.sub(r'(\bE\d+\b)', r'"\1"', features)

        # 문자열 형태의 리스트를 실제 리스트로 변환
        events = ast.literal_eval(features_converted)

        data_list.append({
            'block_id': block_id,
            'events': events,
            'label': label
        })

    print(data_list)
    return data_list

def simulate_data_stream():
    # CSV 파일에서 데이터를 로드합니다.
    data_list = load_data_from_csv()

    # 데이터 순서를 섞어서 시뮬레이션의 현실감을 높입니다.
    random.shuffle(data_list)

    for data in data_list:
        response = requests.post('http://localhost:5000/predict', json=data)
        print(response.json())
        time.sleep(2)  # 2초 간격으로 데이터 전송

if __name__ == '__main__':
    simulate_data_stream()
