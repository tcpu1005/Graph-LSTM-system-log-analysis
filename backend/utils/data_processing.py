
def preprocess_input(events):
    # 이벤트를 그래프로 변환
    x, edge_index = create_graph(events)  # create_graph 함수 필요
    x = x.to(device)
    edge_index = edge_index.to(device)
    # GNN을 통해 임베딩 추출
    with torch.no_grad():
        node_embeddings = gnn_model(x, edge_index)
    # 이벤트 시퀀스에 해당하는 임베딩 추출
    seq_embeddings = node_embeddings[[event_id_to_index[e] for e in events]]
    return seq_embeddings.cpu().numpy()
