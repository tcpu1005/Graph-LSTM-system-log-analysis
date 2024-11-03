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
