// frontend/app.js

// 서버와의 소켓 연결 설정
const socket = io();

// 실시간 알림 수신
socket.on('new_alert', (data) => {
    displayAlert(data);
    updateChart(data);
});

// 알림 표시 함수
function displayAlert(data) {
    const alertsDiv = document.getElementById('alerts');
    const alertElement = document.createElement('div');
    alertElement.className = 'alert';
    alertElement.innerHTML = `
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Block ID:</strong> ${data.block_id}</p>
        <p><strong>Anomaly Detected:</strong> ${data.label === 1 ? 'Yes' : 'No'}</p>
        <p><strong>Events:</strong> ${data.events.join(', ')}</p>
        <hr>
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
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        second: 'HH:mm:ss'
                    }
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Anomaly Count'
                },
                ticks: {
                    stepSize: 1
                }
            }
        }
    }
});

// 이벤트 발생 추이 업데이트 함수
function updateChart(data) {
    const now = new Date();
    const label = data.label === 1 ? 1 : 0;
    eventChart.data.labels.push(now);
    eventChart.data.datasets[0].data.push(label);
    eventChart.update();
}
