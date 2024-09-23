# # 라이브러리 설치
# !pip install torch torchvision torchaudio
# !pip install torch-geometric

# 필요 라이브러리 임포트
import pandas as pd
import numpy as np
import torch
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
from torch.nn import LSTM, Linear
from torch_geometric.loader import DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import torch.nn.functional as F
import ast

# Google Drive 마운트
drive.mount('/content/drive')

# 데이터 경로 설정
base_path = '/content/drive/MyDrive/Graph LSTM/HDFS_v1/preprocessed/'

anomaly_label_path = base_path + 'anomaly_label.csv'
event_occurrence_matrix_path = base_path + 'Event_occurrence_matrix.csv'
log_templates_path = base_path + 'HDFS.log_templates.csv'
event_traces_path = base_path + 'Event_traces.csv'

# 데이터 로드
anomaly_label = pd.read_csv(anomaly_label_path)
event_occurrence_matrix = pd.read_csv(event_occurrence_matrix_path)
log_templates = pd.read_csv(log_templates_path)
event_traces = pd.read_csv(event_traces_path)
# 라벨 인코딩
label_dict = {'Normal': 0, 'Anomaly': 1}
anomaly_label['Label'] = anomaly_label['Label'].map(label_dict)

# 이벤트 ID 매핑
event_id_to_template = dict(zip(log_templates['EventId'], log_templates['EventTemplate']))
event_ids = log_templates['EventId'].unique()
event_id_to_index = {event_id: idx for idx, event_id in enumerate(event_ids)}

# 필요없는 열 제거
event_occurrence_matrix = event_occurrence_matrix.drop(columns=['Label', 'Type'])
event_occurrence_matrix = event_occurrence_matrix.fillna(0)

# 문자열 형태의 리스트를 실제 리스트로 변환 (findall은 모두 찾아서 list로 반환하는....)
def parse_features(s):
    if not s or pd.isna(s):
        return []
    return re.findall(r'E\d+', s)

def parse_time_intervals(s):
    if not s or pd.isna(s):
        return []
    s = s.strip('[]')
    elements = s.split(',')
    elements = [float(e.strip()) for e in elements if e.strip()]
    return elements

event_traces['Features'] = event_traces['Features'].apply(parse_features)
event_traces['TimeInterval'] = event_traces['TimeInterval'].apply(parse_time_intervals)

# 'BlockId' 데이터 타입 통일
anomaly_label['BlockId'] = anomaly_label['BlockId'].astype(str)
event_traces['BlockId'] = event_traces['BlockId'].astype(str)

# 데이터 병합
merged_data = pd.merge(event_traces, anomaly_label.rename(columns={'Label': 'AnomalyLabel'}), on='BlockId', how='inner')
