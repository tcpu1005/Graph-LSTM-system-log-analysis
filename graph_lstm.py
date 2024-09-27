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

def create_graph(block_events):
    nodes = []
    edge_index = [[], []]

    # 이벤트 ID를 인덱스로 변환하여 노드 리스트 생성
    for event_id in event_ids:
        node_idx = event_id_to_index[event_id]
        nodes.append(node_idx)

    # 엣지 생성 (이벤트 시퀀스에 따라)
    for i in range(len(block_events) - 1):
        src = event_id_to_index[block_events[i]]
        dst = event_id_to_index[block_events[i + 1]]
        edge_index[0].append(src)
        edge_index[1].append(dst)

    # 텐서로 변환
    edge_index = torch.tensor(edge_index, dtype=torch.long)
    x = torch.eye(len(event_ids))  # 노드 특징 (원-핫 인코딩)
    return x, edge_index

graph_data_list = []

for idx, row in merged_data.iterrows():
    label = row['AnomalyLabel']
    events = row['Features']

    # 이벤트가 1개 이하인 경우 제외
    if len(events) <= 1:
        continue

    # 그래프 생성
    x, edge_index = create_graph(events)

    # 그래프 데이터 객체 생성
    data = Data(x=x, edge_index=edge_index, y=torch.tensor([label], dtype=torch.long))
    graph_data_list.append(data)

import torch
import torch_geometric
import networkx as nx
import matplotlib.pyplot as plt
from torch_geometric.utils import to_networkx

# 그래프 데이터 중 하나 선택
data = graph_data_list[0]

# NetworkX 그래프로 변환
G = to_networkx(data, node_attrs=['x'], edge_attrs=None)

# 그래프 레이아웃 설정
pos = nx.spring_layout(G, seed=42)

# 노드 특징에 따라 색상 지정
node_colors = [i for i in range(len(G.nodes()))]

# 그래프 그리기
plt.figure(figsize=(12, 8))
nx.draw(G, pos, with_labels=True, node_color=node_colors, cmap=plt.cm.Set3)
plt.title('Graph Visualization')
plt.show()

# 첫 번째 그래프 데이터가 어떤 BlockId에 해당하는지 확인
first_graph_index = 0  # 첫 번째 그래프의 인덱스
for idx, row in merged_data.iterrows():
    events = row['Features']
    if len(events) > 1:  # create_graph에서 사용된 필터 조건과 일치시킴
        if first_graph_index == 0:
            print(f"graph_data_list[0]에 해당하는 BlockId: {row['BlockId']}")
            break
        first_graph_index -= 1
