// frontend/app.js

// 서버와의 소켓 연결 설정
const socket = io();

// 알림 카운트
let anomalyCount = 0;

// 비정상 데이터 유형 분포 데이터
const anomalyTypeCounts = {};

// 정상 및 비정상 데이터 카운트
let normalCount = 0;
let anomalyTotalCount = 0;

// 실시간 알림 수신
socket.on('new_alert', (data) => {
    displayAlert(data);
    updateAnomalyCount(data);
    updateAnomalyTypeCounts(data);
    updateAnomalyCountChart(data);
    updateAnomalyTypePieChart();
    updateAnomalyTypeBarChart(data);
    updateAnomalyProbabilityChart(data);
    updateNormalAnomalyRatioChart(data);
});

// 알림 표시 함수
function displayAlert(data) {
    const alertsDiv = document.getElementById('alerts');
    const alertElement = document.createElement('div');
    alertElement.className = data.label === 1 ? 'alert alert-danger' : 'alert alert-secondary';
    alertElement.innerHTML = `
        <h5 class="alert-heading">Block ID: ${data.block_id}</h5>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Anomaly Detected:</strong> ${data.label === 1 ? 'Yes' : 'No'}</p>
        <p><strong>Anomaly Probability:</strong> ${data.label === 1 ? (data.label_probability * 100).toFixed(2) + '%' : '0.00%'}</p>
        <p><strong>Error Type:</strong> ${data.error_type !== -1 ? data.error_type : 'N/A'}</p>
        <p><strong>Error Description:</strong> ${data.error_description}</p>
        <p><strong>Events:</strong> ${data.events.join(', ')}</p>
    `;
    alertsDiv.prepend(alertElement);
}

// Chart.js를 사용한 이벤트 발생 추이 그래프 설정
const ctx = document.getElementById('eventChart').getContext('2d');
const eventChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],  // 시간 축
        datasets: [{
            label: 'Anomaly Count',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
        }]
    },
    options: {
        responsive: true,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        minute: 'HH:mm'
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Anomaly Count'
                }
            }]
        }
    }
});

// 비정상 데이터 유형 분포 그래프 설정 (파이 차트)
const ctxPie = document.getElementById('anomalyTypePieChart').getContext('2d');
const anomalyTypePieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
        labels: [],  // 오류 유형 라벨
        datasets: [{
            data: [],  // 오류 유형 빈도
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#C9CBCF',
                '#BDBDBD',
                '#8DD3C7',
                '#FFFFB3'
            ]
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Anomaly Types Distribution'
        }
    }
});

// 비정상 데이터 유형 빈도 그래프 설정 (막대 차트)
const ctxBar = document.getElementById('anomalyTypeBarChart').getContext('2d');
const anomalyTypeBarChart = new Chart(ctxBar, {
    type: 'bar',
    data: {
        labels: [],  // 시간 축
        datasets: [{
            label: 'Error Type Frequency',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        minute: 'HH:mm'
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Frequency'
                }
            }]
        },
        title: {
            display: true,
            text: 'Anomaly Types Frequency Over Time'
        }
    }
});

// 비정상 데이터 확률 추이 그래프 설정 (라인 차트)
const ctxProbability = document.getElementById('anomalyProbabilityChart').getContext('2d');
const anomalyProbabilityChart = new Chart(ctxProbability, {
    type: 'line',
    data: {
        labels: [],  // 시간 축
        datasets: [{
            label: 'Anomaly Probability',
            data: [],
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(255, 159, 64, 0.2)'
        }]
    },
    options: {
        responsive: true,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'minute',
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        minute: 'HH:mm'
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    max: 1,
                    stepSize: 0.1,
                    callback: function(value) {
                        return (value * 100).toFixed(0) + '%';
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Anomaly Probability'
                }
            }]
        }
    }
});

// 정상 vs 비정상 데이터 비율 그래프 설정 (파이 차트)
const ctxRatio = document.getElementById('normalAnomalyRatioChart').getContext('2d');
const normalAnomalyRatioChart = new Chart(ctxRatio, {
    type: 'pie',
    data: {
        labels: ['Normal', 'Anomaly'],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                '#36A2EB',
                '#FF6384'
            ]
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Normal vs Anomaly Ratio'
        }
    }
});

// 비정상 데이터 유형 빈도 업데이트 함수
function updateAnomalyTypeCounts(data) {
    if (data.label === 1 && data.error_type !== -1) {
        if (anomalyTypeCounts[data.error_type]) {
            anomalyTypeCounts[data.error_type]++;
        } else {
            anomalyTypeCounts[data.error_type] = 1;
        }
    }
}

// 비정상 데이터 유형 분포 그래프 업데이트 함수
function updateAnomalyTypePieChart() {
    anomalyTypePieChart.data.labels = Object.keys(anomalyTypeCounts);
    anomalyTypePieChart.data.datasets[0].data = Object.values(anomalyTypeCounts);
    anomalyTypePieChart.update();
}

// 비정상 데이터 발생 빈도 막대 차트 업데이트 함수
function updateAnomalyTypeBarChart(data) {
    if (data.label === 1 && data.error_type !== -1) {
        const now = new Date();
        anomalyTypeBarChart.data.labels.push(now);
        anomalyTypeBarChart.data.datasets[0].data.push(data.error_type);
        anomalyTypeBarChart.update();
    }
}

// 비정상 데이터 확률 추이 그래프 업데이트 함수
function updateAnomalyProbabilityChart(data) {
    const now = new Date();
    if (data.label === 1) {
        const probability = data.label_probability;
        anomalyProbabilityChart.data.labels.push(now);
        anomalyProbabilityChart.data.datasets[0].data.push(probability);
    } else {
        // 정상 데이터일 경우 확률을 0%로 설정
        anomalyProbabilityChart.data.labels.push(now);
        anomalyProbabilityChart.data.datasets[0].data.push(0.0);
    }
    anomalyProbabilityChart.update();
}

// 이벤트 발생 추이 업데이트 함수
function updateAnomalyCountChart(data) {
    const now = new Date();
    const label = data.label === 1 ? 1 : 0;
    eventChart.data.labels.push(now);
    const lastData = eventChart.data.datasets[0].data.slice(-1)[0] || 0;
    eventChart.data.datasets[0].data.push(lastData + label);
    eventChart.update();
}

// 정상 vs 비정상 데이터 비율 업데이트 함수
function updateNormalAnomalyRatioChart(data) {
    if (data.label === 1) {
        anomalyTotalCount++;
    } else {
        normalCount++;
    }
    normalAnomalyRatioChart.data.datasets[0].data = [normalCount, anomalyTotalCount];
    normalAnomalyRatioChart.update();
}

// 알림 카운트 업데이트 함수
function updateAnomalyCount(data) {
    if (data.label === 1) {
        anomalyCount++;
        // 네비게이션 바에 알림 배지 업데이트 (추후 구현 가능)
    }
}
