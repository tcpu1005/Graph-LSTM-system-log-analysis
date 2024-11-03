# backend/models/gnn_model.py
import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, global_mean_pool
from torch.nn import Linear, Dropout

class GNN(torch.nn.Module):
    def __init__(self, num_node_features, hidden_channels, dropout=0.6):
        super(GNN, self).__init__()
        self.conv1 = GCNConv(num_node_features, hidden_channels)
        self.dropout1 = Dropout(dropout)
        self.conv2 = GCNConv(hidden_channels, hidden_channels)
        self.dropout2 = Dropout(dropout)
        self.lin = Linear(hidden_channels, 2)  # 그래프 분류를 위한 출력 레이어
        self.dropout3 = Dropout(dropout)

    def forward(self, x, edge_index, batch):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.dropout1(x)
        x = self.conv2(x, edge_index)
        x = F.relu(x)
        x = self.dropout2(x)
        x = global_mean_pool(x, batch)  # 그래프 임베딩 생성
        x = self.dropout3(x)
        x = self.lin(x)
        return x

    def get_node_embeddings(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = self.dropout1(x)
        x = self.conv2(x, edge_index)
        x = F.relu(x)
        x = self.dropout2(x)
        return x  # 노드 임베딩 반환
