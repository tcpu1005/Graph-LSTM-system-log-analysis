import torch
import torch.nn.functional as F
from torch.nn import Linear
import torch.nn as nn
from torch_geometric.nn import GCNConv, global_mean_pool
class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, num_classes_label, num_classes_type, dropout=0.2):
        super(LSTMModel, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        # LSTM 레이어
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=dropout)
        # 분류기 레이어
        self.fc_label = nn.Linear(hidden_size, num_classes_label)  # 이상 여부 예측용
        self.fc_type = nn.Linear(hidden_size, num_classes_type)    # 오류 유형 예측용
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # 초기 hidden 및 cell 상태 설정
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)

        # LSTM 전방향 패스
        out, _ = self.lstm(x, (h0, c0))

        # Dropout 적용
        out = self.dropout(out)

        # 마지막 타임스텝의 출력값을 사용하여 분류
        out = out[:, -1, :]  # (batch_size, hidden_size)

        # 두 개의 출력 생성
        label_output = self.fc_label(out)  # 이상 여부 예측
        type_output = self.fc_type(out)    # 오류 유형 예측

        return label_output, type_output