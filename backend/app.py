# backend/app.py 
# 가상환경 활성화 conda activate anomaly_detection_env
# 백엔드 서버 실행 python app.py
# 데이터 시뮬레이터 실행 python data_simulator.py
from flask import Flask, request, jsonify, send_from_directory
from flask_socketio import SocketIO, emit
import torch
from models.gnn_model import GNN
from models.lstm_model import LSTMModel
import numpy as np
import subprocess  # 자동 대응 조치를 위한 라이브러리
import json
import torch.nn.functional as F
import logging
from torch_geometric.data import Data

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

num_node_features = len(event_id_to_index)  # 정확한 노드 특징 수 설정
hidden_channels = 64  # Colab에서 사용한 hidden_channels와 동일하게 설정

# GNN 모델 로드
gnn_model = GNN(num_node_features=num_node_features, hidden_channels=hidden_channels)
gnn_model.load_state_dict(torch.load('models/gnn_model.pth', map_location=torch.device('cpu'), weights_only=True))
gnn_model.eval()

# LSTM 모델 로드
lstm_model = LSTMModel(input_size=hidden_channels, hidden_size=128, num_layers=2)
lstm_model.load_state_dict(torch.load('models/lstm_model.pth', map_location=torch.device('cpu'), weights_only=True))
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
        node_embeddings = gnn_model.conv1(x, edge_index)
        node_embeddings = F.relu(node_embeddings)
        node_embeddings = gnn_model.conv2(node_embeddings, edge_index)
        node_embeddings = F.relu(node_embeddings)

    # 이벤트 시퀀스에 따른 임베딩 추출
    seq_indices = [event_id_to_index.get(e, -1) for e in events]
    # 유효한 인덱스만 필터링
    seq_indices = [idx for idx in seq_indices if idx != -1]
    if not seq_indices:
        # 모든 이벤트가 매핑되지 않은 경우, 0 벡터 사용
        seq_embeddings = np.zeros((1, hidden_channels))
    else:
        # 해당 인덱스의 임베딩 추출
        seq_embeddings = node_embeddings[seq_indices].cpu().numpy()

    return seq_embeddings

# 자동 대응 조치 함수
def respond_to_anomaly(block_id):
    # 실제 환경에 맞게 조치 내용을 구현하세요.
    # 예시: 시스템 백업, 관리자에게 이메일 전송, 체크포인트 조정 등

    # 백업 수행 (예시: 시스템 명령어 실행)
    try:
        backup_command = f"echo 'Backing up Block {block_id}'"  # 실제 백업 명령어로 교체
        subprocess.run(backup_command, shell=True, check=True)
        print(f"Block {block_id}: Backup completed.")
        logging.info(f"Block {block_id}: Backup completed.")
    except subprocess.CalledProcessError:
        print(f"Block {block_id}: Backup failed.")
        logging.error(f"Block {block_id}: Backup failed.")

    # 관리자에게 이메일 전송 (예시)
    try:
        email_command = f"echo 'Anomaly detected in Block {block_id}' | mail -s 'Anomaly Alert' admin@example.com"
        subprocess.run(email_command, shell=True, check=True)
        print(f"Block {block_id}: Alert email sent to administrator.")
        logging.info(f"Block {block_id}: Alert email sent to administrator.")
    except subprocess.CalledProcessError:
        print(f"Block {block_id}: Failed to send alert email.")
        logging.error(f"Block {block_id}: Failed to send alert email.")

    # 체크포인트 설정 조정 (예시)
    try:
        checkpoint_command = f"echo 'Adjusting checkpoint settings for Block {block_id}'"  # 실제 명령어로 교체
        subprocess.run(checkpoint_command, shell=True, check=True)
        print(f"Block {block_id}: Checkpoint settings adjusted.")
        logging.info(f"Block {block_id}: Checkpoint settings adjusted.")
    except subprocess.CalledProcessError:
        print(f"Block {block_id}: Failed to adjust checkpoint settings.")
        logging.error(f"Block {block_id}: Failed to adjust checkpoint settings.")

# API 엔드포인트: 이상 탐지
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        block_id = data.get('block_id')
        events = data.get('events')  # 이벤트 시퀀스 리스트, 예: ['E1', 'E2', 'E3']

        if not block_id or not events:
            logging.error("Missing 'block_id' or 'events' in the request.")
            return jsonify({'error': "Missing 'block_id' or 'events' in the request."}), 400

        # 데이터 전처리
        seq_embeddings = preprocess_input(events)
        input_tensor = torch.tensor(seq_embeddings, dtype=torch.float32).unsqueeze(0)  # (1, seq_len, input_size=64)

        # LSTM 모델을 통해 예측
        with torch.no_grad():
            output = lstm_model(input_tensor)
            _, predicted = torch.max(output, 1)
            label = predicted.item()  # 0: Normal, 1: Anomaly

        result = {
            'block_id': block_id,
            'label': label,
            'events': events
        }

        # 이상 탐지 시 자동 대응 조치 수행
        if label == 1:
            respond_to_anomaly(block_id)
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




# 테스트용 코드 (app.py 내에 임시로 추가)
if __name__ == '__main__':
    # 예시 이벤트 시퀀스
    test_events = ['E1', 'E2', 'E3']
    seq_embeddings = preprocess_input(test_events)
    print(f"Sequence Embeddings Shape: {seq_embeddings.shape}")  # Expected: (3, 64) or similar
