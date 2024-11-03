# backend/app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
import torch
from models.gnn_model import GNN
from models.lstm_model import LSTMModel
import numpy as np
import subprocess  # 자동 대응 조치를 위한 라이브러리
import json
import torch.nn.functional as F  # 소프트맥스 함수 사용을 위해 추가
import logging
from torch_geometric.data import Data
import pandas as pd

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

# 로깅 설정
logging.basicConfig(filename='backend.log', level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

# 이벤트 ID 매핑 로드
with open('models/event_id_to_index.json', 'r') as f:
    event_id_to_index = json.load(f)

event_ids = list(event_id_to_index.keys())
num_node_features = len(event_id_to_index)
hidden_channels = 64  # GNN의 hidden_channels와 동일하게 설정

# 오류 설명 로드
error_descriptions = pd.read_csv('../data/Detailed_Type_Error_Descriptions.csv')
error_descriptions['Type'] = error_descriptions['Type'].astype(int)
error_type_to_description = dict(zip(error_descriptions['Type'], error_descriptions['ErrorDescription']))

# GNN 모델 로드
gnn_model = GNN(num_node_features=num_node_features, hidden_channels=hidden_channels)
gnn_model.load_state_dict(torch.load('models/gnn_model.pth', map_location='cpu'))
gnn_model.eval()

# LSTM 모델 로드
num_classes_type = max(error_descriptions['Type']) + 1  # 오류 유형의 수
lstm_model = LSTMModel(input_size=hidden_channels, hidden_size=128, num_layers=2,
                       num_classes_label=2, num_classes_type=num_classes_type, dropout=0.2)
lstm_model.load_state_dict(torch.load('models/lstm_model.pth', map_location='cpu'))
lstm_model.eval()

# 디바이스 설정 (CPU 사용)
device = torch.device('cpu')

# 그래프 생성 함수
def create_graph(block_events):
    edge_index = [[], []]

    # 엣지 생성 (이벤트 시퀀스에 따라)
    for i in range(len(block_events) - 1):
        src = event_id_to_index.get(block_events[i], -1)
        dst = event_id_to_index.get(block_events[i + 1], -1)
        if src != -1 and dst != -1:
            edge_index[0].append(src)
            edge_index[1].append(dst)

    # 텐서로 변환
    edge_index = torch.tensor(edge_index, dtype=torch.long)
    x = torch.eye(num_node_features)  # 노드 특징 (원-핫 인코딩)
    return x, edge_index

# 데이터 전처리 함수
def preprocess_input(events):
    # 그래프 생성
    x, edge_index = create_graph(events)
    x = x.to(device)
    edge_index = edge_index.to(device)

    # GNN 모델을 통해 노드 임베딩 생성
    with torch.no_grad():
        node_embeddings = gnn_model.get_node_embeddings(x, edge_index)

    # 이벤트 시퀀스에 따른 임베딩 추출
    seq_indices = [event_id_to_index.get(e, -1) for e in events]
    seq_indices = [idx for idx in seq_indices if idx != -1]

    if not seq_indices:
        # 이벤트가 매핑되지 않는 경우 처리
        seq_embeddings = torch.zeros((1, hidden_channels)).to(device)
    else:
        seq_embeddings = node_embeddings[seq_indices]

    return seq_embeddings.unsqueeze(0)  # (1, seq_len, hidden_channels)

# 자동 대응 조치 함수
def respond_to_anomaly(block_id, error_type, error_description):
    # 실제 환경에 맞게 조치 내용을 구현
    # 예시: 오류 유형에 따라 다른 대응 수행

    # 로그에 기록
    logging.info(f"Anomaly detected in Block {block_id}. Error Type: {error_type}, Description: {error_description}")

    # 관리자에게 이메일 전송
    try:
        email_command = f"echo 'Anomaly detected in Block {block_id}. Error Type: {error_type}, Description: {error_description}' | mail -s 'Anomaly Alert' admin@example.com"
        subprocess.run(email_command, shell=True, check=True)
        print(f"Block {block_id}: Alert email sent to administrator.")
    except subprocess.CalledProcessError:
        print(f"Block {block_id}: Failed to send alert email.")
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        block_id = data.get('block_id')
        events = data.get('events')  # 이벤트 시퀀스 리스트

        if not block_id or not events:
            logging.error("Missing 'block_id' or 'events' in the request.")
            return jsonify({'error': "Missing 'block_id' or 'events' in the request."}), 400

        # 데이터 전처리
        seq_embeddings = preprocess_input(events)
        input_tensor = seq_embeddings.to(device)  # (1, seq_len, input_size)

        # LSTM 모델을 통해 예측
        with torch.no_grad():
            label_output, type_output = lstm_model(input_tensor)
            #LSTM 모델을 통해 레이블(label_output)과 오류 유형(type_output)을 예측.
            #F.softmax 함수를 사용하여 예측 결과에 소프트맥스를 적용해 확률을 계산.
            label_prob = F.softmax(label_output, dim=1)
            type_prob = F.softmax(type_output, dim=1)

            _, label_predicted = torch.max(label_output, 1)
            label = label_predicted.item()  # 0: Normal, 1: Anomaly

            if label == 1:
                label_probability = label_prob[0][1].item()  # Anomaly 확률
                _, type_predicted = torch.max(type_output, 1)
                error_type = type_predicted.item()
                error_description = error_type_to_description.get(error_type, 'Unknown Error')
                type_probability = type_prob[0][type_predicted].item()
            else:
                label_probability = 0.0  # 정상 데이터일 경우 확률을 0으로 설정
                error_type = -1
                error_description = 'N/A'
                type_probability = 0.0

        result = {
            'block_id': block_id,
            'label': label,
            'label_probability': round(label_probability, 4),  # 소수점 4자리까지 반올림
            'error_type': error_type,
            'error_description': error_description,
            'type_probability': round(type_probability, 4),
            'events': events
        }

        # 이상 탐지 시 자동 대응 조치 수행
        if label == 1:
            respond_to_anomaly(block_id, error_type, error_description)
            logging.info(f"Anomaly detected in Block {block_id}.")
        else:
            logging.info(f"Normal activity in Block {block_id}.")

        # 실시간 알림 전송
        socketio.emit('new_alert', result)

        return jsonify(result)
    except Exception as e:
        logging.error(f"Error in predict endpoint: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500


# 정적 파일 서빙 (프론트엔드 대시보드)
@app.route('/', methods=['GET'])
def serve_dashboard():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_static_files(path):
    return send_from_directory('../frontend', path)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)