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

// 최대 데이터 포인트 수 설정
const maxDataPoints = 50;  // 각 차트에 표시할 최대 데이터 포인트 수

// 실시간 알림 수신 시 자동 대응 함수 호출 추가
socket.on('new_alert', (data) => {
    displayAlert(data);
    updateAnomalyCount(data);
    updateAnomalyTypeCounts(data);
    updateAnomalyCountChart(data);
    updateAnomalyTypePieChart();
    updateAnomalyTypeBarChart(data);
    updateAnomalyProbabilityChart(data);
    updateNormalAnomalyRatioChart(data);
  
    // 자동 대응 시스템 실행
    if (data.error_type === 31) {
      automatedResponseType31(data);
    } else if (data.error_type === 30) {
      automatedResponseType30(data);
    } else if (data.error_type === 29) {
      automatedResponseType29(data);
    } else if (data.error_type === 28) {
      automatedResponseType28(data);
    } else if (data.error_type === 27) {
      automatedResponseType27(data);
    } else if (data.error_type === 26) {
      automatedResponseType26(data);
    } else if (data.error_type === 25) {
      automatedResponseType25(data);
    } else if (data.error_type === 24) {
      automatedResponseType24(data);
    } else if (data.error_type === 23) {
      automatedResponseType23(data);
    } else if (data.error_type === 22) {
      automatedResponseType22(data);
    } else if (data.error_type === 21) {
      automatedResponseType21(data);
    } else if (data.error_type === 20) {
      automatedResponseType20(data);
    } else if (data.error_type === 19) {
      automatedResponseType19(data);
    } else if (data.error_type === 18) {
      automatedResponseType18(data);
    } else if (data.error_type === 17) {
      automatedResponseType17(data);
    } else if (data.error_type === 16) {
      automatedResponseType16(data);
    } else if (data.error_type === 15) {
      automatedResponseType15(data);
    } else if (data.error_type === 14) {
      automatedResponseType14(data);
    } else if (data.error_type === 13) {
      automatedResponseType13(data);
    } else if (data.error_type === 12) {
      automatedResponseType12(data);
    } else if (data.error_type === 11) {
      automatedResponseType11(data);
    } else if (data.error_type === 10) {
      automatedResponseType10(data);
    } else if (data.error_type === 9) {
      automatedResponseType9(data);
    } else if (data.error_type === 8) {
      automatedResponseType8(data);
    } else if (data.error_type === 7) {
      automatedResponseType7(data);
    } else if (data.error_type === 6) {
      automatedResponseType6(data);
    } else if (data.error_type === 5) {
      automatedResponseType5(data);
    } else if (data.error_type === 4) {
      automatedResponseType4(data);
    } else if (data.error_type === 3) {
      automatedResponseType3(data);
    } else if (data.error_type === 2) {
      automatedResponseType2(data);
    } else if (data.error_type === 1) {
      automatedResponseType1(data);
    } else if (data.error_type === 0) {
      automatedResponse(data); // Type 0에 대한 기존 함수
    }
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

// 기존 코드 유지

// 성능 지표 막대 차트 설정
const ctxPerformanceBar = document.getElementById('performanceChart').getContext('2d');
const performanceChart = new Chart(ctxPerformanceBar, {
    type: 'bar',
    data: {
        labels: ['Precision', 'Recall', 'F1-Score'],
        datasets: [{
            label: 'Performance Metrics',
            data: [0, 0, 0],
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',  // Precision
                'rgba(75, 192, 192, 0.6)',  // Recall
                'rgba(255, 206, 86, 0.6)'   // F1-Score
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {  // Chart.js 3.x 이상에서는 'yAxes' 대신 'y'로 변경
                beginAtZero: true,
                max: 1,
                ticks: {
                    stepSize: 0.1,
                    callback: function(value) {
                        return (value * 100).toFixed(0) + '%';
                    }
                },
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Precision, Recall, F1-Score'
            }
        }
    }
});

// 혼동 매트릭스 파이 차트 설정
const ctxConfusionMatrix = document.getElementById('precisionRecallF1Chart').getContext('2d');
const confusionMatrixChart = new Chart(ctxConfusionMatrix, {
    type: 'pie',
    data: {
        labels: ['TP', 'FP', 'TN', 'FN'],
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',  // TP
                'rgba(255, 99, 132, 0.6)',  // FP
                'rgba(54, 162, 235, 0.6)',  // TN
                'rgba(255, 206, 86, 0.6)'   // FN
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Confusion Matrix'
            }
        }
    }
});


// Socket.IO 이벤트 리스너: 성능 지표 업데이트
socket.on('update_metrics', (metrics) => {
  // 업데이트된 수치 표시
  document.getElementById('precisionValue').innerText = metrics.precision;
  document.getElementById('recallValue').innerText = metrics.recall;
  document.getElementById('f1ScoreValue').innerText = metrics.f1_score;

  // 성능 지표 막대 차트 업데이트
  performanceChart.data.datasets[0].data = [metrics.precision, metrics.recall, metrics.f1_score];
  performanceChart.update();

  // 혼동 매트릭스 파이 차트 업데이트
  confusionMatrixChart.data.datasets[0].data = [metrics.TP, metrics.FP, metrics.TN, metrics.FN];
  confusionMatrixChart.update();
});


//===============자동 대응 함수===============
// 자동 대응 함수
function automatedResponse(data) {
  const terminal = document.getElementById('terminalOutput');

  if (data.error_type === 0) {
    // 상단 배너 표시
    showTopBanner();

    // 가상 명령어 실행 시뮬레이션
    const commands = [
      { command: 'echo "Detected Type 0 Error: Metadata inconsistency."', delay: 1000 },
      { command: 'echo "Initiating automated response..."', delay: 1000 },
      { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
      { command: 'echo "fsck output: Found corrupted blocks."', delay: 1000 },
      { command: 'echo "Attempting to recover corrupted blocks..."', delay: 1000 },
      { command: 'hdfs dfs -setrep -w 3 /path/to/corrupted/block', delay: 2000 },
      { command: 'echo "Blocks recovered successfully."', delay: 1000 },
      { command: 'echo "Resynchronizing metadata between NameNode and DataNodes..."', delay: 1000 },
      { command: 'hadoop dfsadmin -safemode enter', delay: 1000 },
      { command: 'hadoop dfsadmin -safemode leave', delay: 1000 },
      { command: 'echo "Metadata resynchronization completed."', delay: 1000 },
      { command: 'echo "Automated response completed successfully."', delay: 1000 },
      { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
    ];

    let i = 0;
    const executeCommand = () => {
      if (i < commands.length) {
        terminal.textContent += `$ ${commands[i].command}\n`;
        setTimeout(() => {
          // 명령어 출력 (실제 실행 결과를 시뮬레이션)
          terminal.textContent += `${simulateCommandOutput(commands[i].command)}\n`;
          terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
          i++;
          executeCommand();
        }, commands[i].delay);
      }
    };
    executeCommand();
  }
}

// 명령어 출력 결과를 시뮬레이션하는 함수
function simulateCommandOutput(command) {
  // 간단한 매핑으로 명령어에 따른 출력 결과를 정의
  const outputs = {
    'echo "Detected Type 0 Error: Metadata inconsistency."': 'Detected Type 0 Error: Metadata inconsistency.',
    'echo "Initiating automated response..."': 'Initiating automated response...',
    'hdfs fsck / -files -blocks -locations': 'Connecting to namenode via http://localhost:50070\nFSCK started by admin\nStatus: CORRUPT\n Total size:    1000 B\n Total dirs:    10\n Total files:   50\n Total blocks (validated): 60 (avg. block size 16 B)\n  ********************************\n  CORRUPT FILES:\n  /path/to/corrupted/block\n  ********************************',
    'echo "fsck output: Found corrupted blocks."': 'fsck output: Found corrupted blocks.',
    'echo "Attempting to recover corrupted blocks..."': 'Attempting to recover corrupted blocks...',
    'hdfs dfs -setrep -w 3 /path/to/corrupted/block': 'Replication of /path/to/corrupted/block set to 3',
    'echo "Blocks recovered successfully."': 'Blocks recovered successfully.',
    'echo "Resynchronizing metadata between NameNode and DataNodes..."': 'Resynchronizing metadata between NameNode and DataNodes...',
    'hadoop dfsadmin -safemode enter': 'Safe mode is ON',
    'hadoop dfsadmin -safemode leave': 'Safe mode is OFF',
    'echo "Metadata resynchronization completed."': 'Metadata resynchronization completed.',
    'echo "Automated response completed successfully."': 'Automated response completed successfully.',
    [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
  };
  return outputs[command] || '';
}

// 자동 대응 함수
function automatedResponseType1(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 1) {
      // 상단 배너 표시
      showTopBannerType1();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 1 Error: Unstable block reception."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 1..."', delay: 1000 },
        { command: 'hdfs dfsadmin -report', delay: 2000 },
        { command: 'echo "Identified unstable DataNodes."', delay: 1000 },
        { command: 'echo "Restarting affected DataNodes..."', delay: 1000 },
        { command: 'for node in $(cat affected_nodes.txt); do ssh $node "sudo service datanode restart"; done', delay: 2000 },
        { command: 'echo "DataNodes restarted successfully."', delay: 1000 },
        { command: 'echo "Verifying block consistency..."', delay: 1000 },
        { command: 'hdfs fsck / -blocks -locations', delay: 2000 },
        { command: 'echo "Block consistency verified."', delay: 1000 },
        { command: 'echo "Automated response for Type 1 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType1(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수
  function simulateCommandOutputType1(command) {
    const outputs = {
      'echo "Detected Type 1 Error: Unstable block reception."': 'Detected Type 1 Error: Unstable block reception.',
      'echo "Initiating automated response for Type 1..."': 'Initiating automated response for Type 1...',
      'hdfs dfsadmin -report': 'Live datanodes (4):\nName: 192.168.1.2:50010\nName: 192.168.1.3:50010\nName: 192.168.1.4:50010\nName: 192.168.1.5:50010',
      'echo "Identified unstable DataNodes."': 'Identified unstable DataNodes.',
      'echo "Restarting affected DataNodes..."': 'Restarting affected DataNodes...',
      'for node in $(cat affected_nodes.txt); do ssh $node "sudo service datanode restart"; done': 'DataNode on 192.168.1.3 restarted.\nDataNode on 192.168.1.4 restarted.',
      'echo "DataNodes restarted successfully."': 'DataNodes restarted successfully.',
      'echo "Verifying block consistency..."': 'Verifying block consistency...',
      'hdfs fsck / -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    2000 B\n Total dirs:    20\n Total files:   100\n Total blocks (validated): 120',
      'echo "Block consistency verified."': 'Block consistency verified.',
      'echo "Automated response for Type 1 completed successfully."': 'Automated response for Type 1 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
// 자동 대응 함수 (Type 3)
function automatedResponseType3(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 3) {
      // 상단 배너 표시
      showTopBannerType3();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 3 Error: Block halted without further processing."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 3..."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs dfs -checksum /path/to/block', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Updating metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata updated successfully."', delay: 1000 },
        { command: 'echo "Initiating block replication..."', delay: 1000 },
        { command: 'hdfs dfs -setrep -w 3 /path/to/block', delay: 2000 },
        { command: 'echo "Block replication completed."', delay: 1000 },
        { command: 'echo "Automated response for Type 3 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType3(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 3)
  function simulateCommandOutputType3(command) {
    const outputs = {
      'echo "Detected Type 3 Error: Block halted without further processing."': 'Detected Type 3 Error: Block halted without further processing.',
      'echo "Initiating automated response for Type 3..."': 'Initiating automated response for Type 3...',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs dfs -checksum /path/to/block': 'MD5-of-0MD5-of-512CRC32C:abcd1234efgh5678ijkl9012mnop3456',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Updating metadata..."': 'Updating metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata updated successfully."': 'Metadata updated successfully.',
      'echo "Initiating block replication..."': 'Initiating block replication...',
      'hdfs dfs -setrep -w 3 /path/to/block': 'Replication of /path/to/block set to 3',
      'echo "Block replication completed."': 'Block replication completed.',
      'echo "Automated response for Type 3 completed successfully."': 'Automated response for Type 3 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
// 자동 대응 함수 (Type 4)
function automatedResponseType4(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 4) {
      // 상단 배너 표시
      showTopBannerType4();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 4 Error: Repeated block reception and status updates."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 4..."', delay: 1000 },
        { command: 'echo "Analyzing network latency and packet loss..."', delay: 1000 },
        { command: 'ping -c 4 datanode1', delay: 2000 },
        { command: 'echo "Network analysis complete."', delay: 1000 },
        { command: 'echo "Checking for duplicate blocks..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Duplicate blocks found."', delay: 1000 },
        { command: 'echo "Removing duplicate blocks..."', delay: 1000 },
        { command: 'hdfs dfs -rm /path/to/duplicate/block', delay: 2000 },
        { command: 'echo "Duplicate blocks removed."', delay: 1000 },
        { command: 'echo "Refreshing metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata refreshed successfully."', delay: 1000 },
        { command: 'echo "Automated response for Type 4 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType4(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 4)
  function simulateCommandOutputType4(command) {
    const outputs = {
      'echo "Detected Type 4 Error: Repeated block reception and status updates."': 'Detected Type 4 Error: Repeated block reception and status updates.',
      'echo "Initiating automated response for Type 4..."': 'Initiating automated response for Type 4...',
      'echo "Analyzing network latency and packet loss..."': 'Analyzing network latency and packet loss...',
      'ping -c 4 datanode1': 'PING datanode1 (192.168.1.10): 56 data bytes\n64 bytes from 192.168.1.10: icmp_seq=0 ttl=64 time=0.123 ms\n64 bytes from 192.168.1.10: icmp_seq=1 ttl=64 time=0.110 ms\n64 bytes from 192.168.1.10: icmp_seq=2 ttl=64 time=0.115 ms\n64 bytes from 192.168.1.10: icmp_seq=3 ttl=64 time=0.112 ms',
      'echo "Network analysis complete."': 'Network analysis complete.',
      'echo "Checking for duplicate blocks..."': 'Checking for duplicate blocks...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: CORRUPT\n Total size:    3000 B\n Total dirs:    30\n Total files:   150\n Total blocks (validated): 180\n  ********************************\n  CORRUPT FILES:\n  /path/to/duplicate/block\n  ********************************',
      'echo "Duplicate blocks found."': 'Duplicate blocks found.',
      'echo "Removing duplicate blocks..."': 'Removing duplicate blocks...',
      'hdfs dfs -rm /path/to/duplicate/block': 'Deleted /path/to/duplicate/block',
      'echo "Duplicate blocks removed."': 'Duplicate blocks removed.',
      'echo "Refreshing metadata..."': 'Refreshing metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata refreshed successfully."': 'Metadata refreshed successfully.',
      'echo "Automated response for Type 4 completed successfully."': 'Automated response for Type 4 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }

// 자동 대응 함수 (Type 5)
function automatedResponseType5(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 5) {
      // 상단 배너 표시
      showTopBannerType5();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 5 Error: Repeated block reception and replication failures."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 5..."', delay: 1000 },
        { command: 'echo "Checking replication status..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -racks', delay: 2000 },
        { command: 'echo "Replication anomalies detected."', delay: 1000 },
        { command: 'echo "Adjusting replication factor..."', delay: 1000 },
        { command: 'hdfs dfs -setrep -w 3 /path/to/problematic/block', delay: 2000 },
        { command: 'echo "Replication factor adjusted."', delay: 1000 },
        { command: 'echo "Refreshing DataNode statuses..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode statuses refreshed."', delay: 1000 },
        { command: 'echo "Verifying metadata consistency..."', delay: 1000 },
        { command: 'hdfs dfsadmin -metasave metadata.log', delay: 2000 },
        { command: 'echo "Metadata consistency verified."', delay: 1000 },
        { command: 'echo "Automated response for Type 5 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType5(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 5)
  function simulateCommandOutputType5(command) {
    const outputs = {
      'echo "Detected Type 5 Error: Repeated block reception and replication failures."': 'Detected Type 5 Error: Repeated block reception and replication failures.',
      'echo "Initiating automated response for Type 5..."': 'Initiating automated response for Type 5...',
      'echo "Checking replication status..."': 'Checking replication status...',
      'hdfs fsck / -files -blocks -racks': 'FSCK started by admin\nStatus: CORRUPT\n Total size:    4000 B\n Total dirs:    40\n Total files:   200\n Total blocks (validated): 240\n  ********************************\n  CORRUPT FILES:\n  /path/to/problematic/block\n  ********************************',
      'echo "Replication anomalies detected."': 'Replication anomalies detected.',
      'echo "Adjusting replication factor..."': 'Adjusting replication factor...',
      'hdfs dfs -setrep -w 3 /path/to/problematic/block': 'Replication of /path/to/problematic/block set to 3',
      'echo "Replication factor adjusted."': 'Replication factor adjusted.',
      'echo "Refreshing DataNode statuses..."': 'Refreshing DataNode statuses...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode statuses refreshed."': 'DataNode statuses refreshed.',
      'echo "Verifying metadata consistency..."': 'Verifying metadata consistency...',
      'hdfs dfsadmin -metasave metadata.log': 'Metadata saved in metadata.log',
      'echo "Metadata consistency verified."': 'Metadata consistency verified.',
      'echo "Automated response for Type 5 completed successfully."': 'Automated response for Type 5 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
// 자동 대응 함수 (Type 7)
function automatedResponseType7(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 7) {
      // 상단 배너 표시
      showTopBannerType7();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 7 Error: Inconsistent block state due to empty packet reception."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 7..."', delay: 1000 },
        { command: 'echo "Analyzing network connectivity..."', delay: 1000 },
        { command: 'ping -c 4 datanode1', delay: 2000 },
        { command: 'echo "Network connectivity analysis complete."', delay: 1000 },
        { command: 'echo "Restarting PacketResponder..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "PacketResponder restarted."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs dfs -checksum /path/to/block', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata refreshed successfully."', delay: 1000 },
        { command: 'echo "Automated response for Type 7 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType7(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 7)
  function simulateCommandOutputType7(command) {
    const outputs = {
      'echo "Detected Type 7 Error: Inconsistent block state due to empty packet reception."': 'Detected Type 7 Error: Inconsistent block state due to empty packet reception.',
      'echo "Initiating automated response for Type 7..."': 'Initiating automated response for Type 7...',
      'echo "Analyzing network connectivity..."': 'Analyzing network connectivity...',
      'ping -c 4 datanode1': 'PING datanode1 (192.168.1.10): 56 data bytes\n64 bytes from 192.168.1.10: icmp_seq=0 ttl=64 time=0.123 ms\n64 bytes from 192.168.1.10: icmp_seq=1 ttl=64 time=0.110 ms\n64 bytes from 192.168.1.10: icmp_seq=2 ttl=64 time=0.115 ms\n64 bytes from 192.168.1.10: icmp_seq=3 ttl=64 time=0.112 ms',
      'echo "Network connectivity analysis complete."': 'Network connectivity analysis complete.',
      'echo "Restarting PacketResponder..."': 'Restarting PacketResponder...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "PacketResponder restarted."': 'PacketResponder restarted.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs dfs -checksum /path/to/block': 'MD5-of-0MD5-of-512CRC32C:abcd1234efgh5678ijkl9012mnop3456',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing metadata..."': 'Refreshing metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata refreshed successfully."': 'Metadata refreshed successfully.',
      'echo "Automated response for Type 7 completed successfully."': 'Automated response for Type 7 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
  // 자동 대응 함수 (Type 8)
function automatedResponseType8(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 8) {
      // 상단 배너 표시
      showTopBannerType8();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 8 Error: Repeated block reception and replication issues."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 8..."', delay: 1000 },
        { command: 'echo "Checking DataNode statuses..."', delay: 1000 },
        { command: 'hdfs dfsadmin -report', delay: 2000 },
        { command: 'echo "Identifying problematic DataNodes..."', delay: 1000 },
        { command: 'echo "Adjusting replication factor..."', delay: 1000 },
        { command: 'hdfs dfs -setrep -w 3 /path/to/affected/block', delay: 2000 },
        { command: 'echo "Replication factor adjusted."', delay: 1000 },
        { command: 'echo "Restarting replication process..."', delay: 1000 },
        { command: 'hadoop dfsadmin -triggerBlockReport', delay: 2000 },
        { command: 'echo "Replication process restarted."', delay: 1000 },
        { command: 'echo "Refreshing metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata refreshed successfully."', delay: 1000 },
        { command: 'echo "Automated response for Type 8 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType8(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 8)
  function simulateCommandOutputType8(command) {
    const outputs = {
      'echo "Detected Type 8 Error: Repeated block reception and replication issues."': 'Detected Type 8 Error: Repeated block reception and replication issues.',
      'echo "Initiating automated response for Type 8..."': 'Initiating automated response for Type 8...',
      'echo "Checking DataNode statuses..."': 'Checking DataNode statuses...',
      'hdfs dfsadmin -report': 'Live datanodes (4):\nName: 192.168.1.2:50010\nName: 192.168.1.3:50010\nName: 192.168.1.4:50010\nName: 192.168.1.5:50010',
      'echo "Identifying problematic DataNodes..."': 'Identifying problematic DataNodes...',
      'echo "Adjusting replication factor..."': 'Adjusting replication factor...',
      'hdfs dfs -setrep -w 3 /path/to/affected/block': 'Replication of /path/to/affected/block set to 3',
      'echo "Replication factor adjusted."': 'Replication factor adjusted.',
      'echo "Restarting replication process..."': 'Restarting replication process...',
      'hadoop dfsadmin -triggerBlockReport': 'Triggering block reports on DataNodes...',
      'echo "Replication process restarted."': 'Replication process restarted.',
      'echo "Refreshing metadata..."': 'Refreshing metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata refreshed successfully."': 'Metadata refreshed successfully.',
      'echo "Automated response for Type 8 completed successfully."': 'Automated response for Type 8 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
// 자동 대응 함수 (Type 9)
function automatedResponseType9(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 9) {
      // 상단 배너 표시
      showTopBannerType9();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 9 Error: Persistent exceptions during block reception and retries."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 9..."', delay: 1000 },
        { command: 'echo "Analyzing exception logs..."', delay: 1000 },
        { command: 'grep "Exception" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Identifying root cause of exceptions..."', delay: 1000 },
        { command: 'echo "Restarting DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata refreshed successfully."', delay: 1000 },
        { command: 'echo "Automated response for Type 9 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType9(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 9)
  function simulateCommandOutputType9(command) {
    const outputs = {
      'echo "Detected Type 9 Error: Persistent exceptions during block reception and retries."': 'Detected Type 9 Error: Persistent exceptions during block reception and retries.',
      'echo "Initiating automated response for Type 9..."': 'Initiating automated response for Type 9...',
      'echo "Analyzing exception logs..."': 'Analyzing exception logs...',
      'grep "Exception" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'Exception in receiveBlock for block blk_123456789\nIOException in BlockReceiver.run\nPacketResponder exception',
      'echo "Identifying root cause of exceptions..."': 'Identifying root cause of exceptions...',
      'echo "Restarting DataNode services..."': 'Restarting DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    5000 B\n Total dirs:    50\n Total files:   250\n Total blocks (validated): 300',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing metadata..."': 'Refreshing metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata refreshed successfully."': 'Metadata refreshed successfully.',
      'echo "Automated response for Type 9 completed successfully."': 'Automated response for Type 9 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
// 자동 대응 함수 (Type 10)
function automatedResponseType10(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 10) {
      // 상단 배너 표시
      showTopBannerType10();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 10 Error: Repeated block state updates without successful completion."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 10..."', delay: 1000 },
        { command: 'echo "Analyzing network status..."', delay: 1000 },
        { command: 'ping -c 4 datanode1', delay: 2000 },
        { command: 'echo "Network status analysis complete."', delay: 1000 },
        { command: 'echo "Checking DataNode health..."', delay: 1000 },
        { command: 'hdfs dfsadmin -report', delay: 2000 },
        { command: 'echo "DataNode health check complete."', delay: 1000 },
        { command: 'echo "Restarting PacketResponder services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "PacketResponder services restarted."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata refreshed successfully."', delay: 1000 },
        { command: 'echo "Automated response for Type 10 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType10(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 10)
  function simulateCommandOutputType10(command) {
    const outputs = {
      'echo "Detected Type 10 Error: Repeated block state updates without successful completion."': 'Detected Type 10 Error: Repeated block state updates without successful completion.',
      'echo "Initiating automated response for Type 10..."': 'Initiating automated response for Type 10...',
      'echo "Analyzing network status..."': 'Analyzing network status...',
      'ping -c 4 datanode1': 'PING datanode1 (192.168.1.10): 56 data bytes\n64 bytes from 192.168.1.10: icmp_seq=0 ttl=64 time=0.123 ms\n64 bytes from 192.168.1.10: icmp_seq=1 ttl=64 time=0.110 ms\n64 bytes from 192.168.1.10: icmp_seq=2 ttl=64 time=0.115 ms\n64 bytes from 192.168.1.10: icmp_seq=3 ttl=64 time=0.112 ms',
      'echo "Network status analysis complete."': 'Network status analysis complete.',
      'echo "Checking DataNode health..."': 'Checking DataNode health...',
      'hdfs dfsadmin -report': 'Live datanodes (4):\nName: 192.168.1.2:50010\nName: 192.168.1.3:50010\nName: 192.168.1.4:50010\nName: 192.168.1.5:50010',
      'echo "DataNode health check complete."': 'DataNode health check complete.',
      'echo "Restarting PacketResponder services..."': 'Restarting PacketResponder services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "PacketResponder services restarted."': 'PacketResponder services restarted.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    6000 B\n Total dirs:    60\n Total files:   300\n Total blocks (validated): 360',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing metadata..."': 'Refreshing metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata refreshed successfully."': 'Metadata refreshed successfully.',
      'echo "Automated response for Type 10 completed successfully."': 'Automated response for Type 10 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 11)
function automatedResponseType11(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 11) {
      // 상단 배너 표시
      showTopBannerType11();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 11 Error: Unstable block reception due to various exceptions."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 11..."', delay: 1000 },
        { command: 'echo "Analyzing exception logs..."', delay: 1000 },
        { command: 'grep "Exception" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Identifying root cause of exceptions..."', delay: 1000 },
        { command: 'echo "Restarting DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata refreshed successfully."', delay: 1000 },
        { command: 'echo "Automated response for Type 11 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType11(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 11)
  function simulateCommandOutputType11(command) {
    const outputs = {
      'echo "Detected Type 11 Error: Unstable block reception due to various exceptions."': 'Detected Type 11 Error: Unstable block reception due to various exceptions.',
      'echo "Initiating automated response for Type 11..."': 'Initiating automated response for Type 11...',
      'echo "Analyzing exception logs..."': 'Analyzing exception logs...',
      'grep "Exception" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'Exception in receiveBlock for block blk_123456789\nIOException in BlockReceiver.run\nPacketResponder exception\nDataXceiver: FORCE CLOSING the connection',
      'echo "Identifying root cause of exceptions..."': 'Identifying root cause of exceptions...',
      'echo "Restarting DataNode services..."': 'Restarting DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    7000 B\n Total dirs:    70\n Total files:   350\n Total blocks (validated): 420',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing metadata..."': 'Refreshing metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata refreshed successfully."': 'Metadata refreshed successfully.',
      'echo "Automated response for Type 11 completed successfully."': 'Automated response for Type 11 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
  // 자동 대응 함수 (Type 12)
function automatedResponseType12(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 12) {
      // 상단 배너 표시
      showTopBannerType12();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 12 Error: Continuous block state updates without stabilization."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 12..."', delay: 1000 },
        { command: 'echo "Analyzing block metadata..."', delay: 1000 },
        { command: 'hdfs dfs -stat /path/to/affected/block', delay: 2000 },
        { command: 'echo "Block metadata analysis complete."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 12 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType12(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 12)
  function simulateCommandOutputType12(command) {
    const outputs = {
      'echo "Detected Type 12 Error: Continuous block state updates without stabilization."': 'Detected Type 12 Error: Continuous block state updates without stabilization.',
      'echo "Initiating automated response for Type 12..."': 'Initiating automated response for Type 12...',
      'echo "Analyzing block metadata..."': 'Analyzing block metadata...',
      'hdfs dfs -stat /path/to/affected/block': 'Block size: 1048576\nReplication: 3\nBlock ID: blk_1234567890',
      'echo "Block metadata analysis complete."': 'Block metadata analysis complete.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 12 completed successfully."': 'Automated response for Type 12 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
  // 자동 대응 함수 (Type 13)
function automatedResponseType13(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 13) {
      // 상단 배너 표시
      showTopBannerType13();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 13 Error: Multiple exceptions during block reception and transmission."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 13..."', delay: 1000 },
        { command: 'echo "Analyzing exception logs..."', delay: 1000 },
        { command: 'grep "Exception" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Identifying root cause of exceptions..."', delay: 1000 },
        { command: 'echo "Restarting DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Verifying block file integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block file integrity verified."', delay: 1000 },
        { command: 'echo "Adjusting block file offsets..."', delay: 1000 },
        { command: 'hdfs dfs -setrep -w 3 /path/to/affected/block', delay: 2000 },
        { command: 'echo "Block file offsets adjusted."', delay: 1000 },
        { command: 'echo "Refreshing metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata refreshed successfully."', delay: 1000 },
        { command: 'echo "Automated response for Type 13 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType13(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 13)
  function simulateCommandOutputType13(command) {
    const outputs = {
      'echo "Detected Type 13 Error: Multiple exceptions during block reception and transmission."': 'Detected Type 13 Error: Multiple exceptions during block reception and transmission.',
      'echo "Initiating automated response for Type 13..."': 'Initiating automated response for Type 13...',
      'echo "Analyzing exception logs..."': 'Analyzing exception logs...',
      'grep "Exception" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'Exception in receiveBlock for block blk_1234567890\nIOException in BlockReceiver.run\nPacketResponder exception\nDataXceiver: FORCE CLOSING the connection',
      'echo "Identifying root cause of exceptions..."': 'Identifying root cause of exceptions...',
      'echo "Restarting DataNode services..."': 'Restarting DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Verifying block file integrity..."': 'Verifying block file integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    9000 B\n Total dirs:    90\n Total files:   450\n Total blocks (validated): 540',
      'echo "Block file integrity verified."': 'Block file integrity verified.',
      'echo "Adjusting block file offsets..."': 'Adjusting block file offsets...',
      'hdfs dfs -setrep -w 3 /path/to/affected/block': 'Replication of /path/to/affected/block set to 3',
      'echo "Block file offsets adjusted."': 'Block file offsets adjusted.',
      'echo "Refreshing metadata..."': 'Refreshing metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata refreshed successfully."': 'Metadata refreshed successfully.',
      'echo "Automated response for Type 13 completed successfully."': 'Automated response for Type 13 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }

  // 자동 대응 함수 (Type 16)
function automatedResponseType16(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 16) {
      // 상단 배너 표시
      showTopBannerType16();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 16 Error: Unstable block reception due to repeated exceptions."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 16..."', delay: 1000 },
        { command: 'echo "Analyzing exception logs..."', delay: 1000 },
        { command: 'grep "Exception" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Identifying root cause of exceptions..."', delay: 1000 },
        { command: 'echo "Restarting DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Checking network connectivity..."', delay: 1000 },
        { command: 'ping -c 4 namenode', delay: 2000 },
        { command: 'echo "Network connectivity verified."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing metadata..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "Metadata refreshed successfully."', delay: 1000 },
        { command: 'echo "Automated response for Type 16 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType16(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 16)
  function simulateCommandOutputType16(command) {
    const outputs = {
      'echo "Detected Type 16 Error: Unstable block reception due to repeated exceptions."': 'Detected Type 16 Error: Unstable block reception due to repeated exceptions.',
      'echo "Initiating automated response for Type 16..."': 'Initiating automated response for Type 16...',
      'echo "Analyzing exception logs..."': 'Analyzing exception logs...',
      'grep "Exception" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'Exception in receiveBlock for block blk_1234567890\nIOException in BlockReceiver.run\nPacketResponder exception\nDataXceiver: FORCE CLOSING the connection',
      'echo "Identifying root cause of exceptions..."': 'Identifying root cause of exceptions...',
      'echo "Restarting DataNode services..."': 'Restarting DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Checking network connectivity..."': 'Checking network connectivity...',
      'ping -c 4 namenode': 'PING namenode (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.123 ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.110 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.115 ms\n64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=0.112 ms',
      'echo "Network connectivity verified."': 'Network connectivity verified.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    10000 B\n Total dirs:    100\n Total files:   500\n Total blocks (validated): 600',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing metadata..."': 'Refreshing metadata...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "Metadata refreshed successfully."': 'Metadata refreshed successfully.',
      'echo "Automated response for Type 16 completed successfully."': 'Automated response for Type 16 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
// 자동 대응 함수 (Type 17)
function automatedResponseType17(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 17) {
      // 상단 배너 표시
      showTopBannerType17();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 17 Error: Block inconsistency due to repeated transmission failures and duplicate storage."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 17..."', delay: 1000 },
        { command: 'echo "Analyzing block metadata..."', delay: 1000 },
        { command: 'hdfs dfs -stat /path/to/affected/block', delay: 2000 },
        { command: 'echo "Identifying duplicate blocks..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations -racks | grep "duplicate"', delay: 2000 },
        { command: 'echo "Removing duplicate blocks..."', delay: 1000 },
        { command: 'hdfs fsck / -delete -files -blocks -locations -racks', delay: 2000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 17 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType17(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 17)
  function simulateCommandOutputType17(command) {
    const outputs = {
      'echo "Detected Type 17 Error: Block inconsistency due to repeated transmission failures and duplicate storage."': 'Detected Type 17 Error: Block inconsistency due to repeated transmission failures and duplicate storage.',
      'echo "Initiating automated response for Type 17..."': 'Initiating automated response for Type 17...',
      'echo "Analyzing block metadata..."': 'Analyzing block metadata...',
      'hdfs dfs -stat /path/to/affected/block': 'Block size: 1048576\nReplication: 3\nBlock ID: blk_1234567890',
      'echo "Identifying duplicate blocks..."': 'Identifying duplicate blocks...',
      'hdfs fsck / -files -blocks -locations -racks | grep "duplicate"': 'Duplicate block found: blk_1234567890',
      'echo "Removing duplicate blocks..."': 'Removing duplicate blocks...',
      'hdfs fsck / -delete -files -blocks -locations -racks': 'Deleted duplicate block: blk_1234567890',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 17 completed successfully."': 'Automated response for Type 17 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 18)
function automatedResponseType18(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 18) {
      // 상단 배너 표시
      showTopBannerType18();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 18 Error: Unstable state due to repeated reception and replication attempts."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 18..."', delay: 1000 },
        { command: 'echo "Analyzing block metadata..."', delay: 1000 },
        { command: 'hdfs dfs -stat /path/to/affected/block', delay: 2000 },
        { command: 'echo "Identifying replication issues..."', delay: 1000 },
        { command: 'hdfs dfsadmin -report', delay: 2000 },
        { command: 'echo "Restarting DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 18 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType18(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 18)
  function simulateCommandOutputType18(command) {
    const outputs = {
      'echo "Detected Type 18 Error: Unstable state due to repeated reception and replication attempts."': 'Detected Type 18 Error: Unstable state due to repeated reception and replication attempts.',
      'echo "Initiating automated response for Type 18..."': 'Initiating automated response for Type 18...',
      'echo "Analyzing block metadata..."': 'Analyzing block metadata...',
      'hdfs dfs -stat /path/to/affected/block': 'Block size: 1048576\nReplication: 3\nBlock ID: blk_1234567890',
      'echo "Identifying replication issues..."': 'Identifying replication issues...',
      'hdfs dfsadmin -report': 'Live datanodes (4):\nName: 192.168.1.2:50010\nName: 192.168.1.3:50010\nName: 192.168.1.4:50010\nName: 192.168.1.5:50010',
      'echo "Restarting DataNode services..."': 'Restarting DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 18 completed successfully."': 'Automated response for Type 18 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 19)
function automatedResponseType19(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 19) {
      // 상단 배너 표시
      showTopBannerType19();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 19 Error: Unstable state due to repeated issues during block reception and response termination."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 19..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Identifying root cause of repeated terminations..."', delay: 1000 },
        { command: 'echo "Restarting DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 19 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType19(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 19)
  function simulateCommandOutputType19(command) {
    const outputs = {
      'echo "Detected Type 19 Error: Unstable state due to repeated issues during block reception and response termination."': 'Detected Type 19 Error: Unstable state due to repeated issues during block reception and response termination.',
      'echo "Initiating automated response for Type 19..."': 'Initiating automated response for Type 19...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Identifying root cause of repeated terminations..."': 'Identifying root cause of repeated terminations...',
      'echo "Restarting DataNode services..."': 'Restarting DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 19 completed successfully."': 'Automated response for Type 19 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
  // 자동 대응 함수 (Type 20)
function automatedResponseType20(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 20) {
      // 상단 배너 표시
      showTopBannerType20();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 20 Error: Unstable state due to repeated response interruptions and replication requests."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 20..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Identifying root cause of repeated terminations..."', delay: 1000 },
        { command: 'echo "Analyzing replication requests..."', delay: 1000 },
        { command: 'hdfs dfsadmin -report', delay: 2000 },
        { command: 'echo "Restarting DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 20 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType20(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 20)
  function simulateCommandOutputType20(command) {
    const outputs = {
      'echo "Detected Type 20 Error: Unstable state due to repeated response interruptions and replication requests."': 'Detected Type 20 Error: Unstable state due to repeated response interruptions and replication requests.',
      'echo "Initiating automated response for Type 20..."': 'Initiating automated response for Type 20...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Identifying root cause of repeated terminations..."': 'Identifying root cause of repeated terminations...',
      'echo "Analyzing replication requests..."': 'Analyzing replication requests...',
      'hdfs dfsadmin -report': 'Live datanodes (4):\nName: 192.168.1.2:50010\nName: 192.168.1.3:50010\nName: 192.168.1.4:50010\nName: 192.168.1.5:50010',
      'echo "Restarting DataNode services..."': 'Restarting DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 20 completed successfully."': 'Automated response for Type 20 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
// 자동 대응 함수 (Type 21)
function automatedResponseType21(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 21) {
      // 상단 배너 표시
      showTopBannerType21();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 21 Error: Unstable state due to repeated issues in block reception and serving."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 21..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Analyzing block serving requests..."', delay: 1000 },
        { command: 'grep "Served block" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Identifying root cause of repeated terminations..."', delay: 1000 },
        { command: 'echo "Restarting DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 21 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType21(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 21)
  function simulateCommandOutputType21(command) {
    const outputs = {
      'echo "Detected Type 21 Error: Unstable state due to repeated issues in block reception and serving."': 'Detected Type 21 Error: Unstable state due to repeated issues in block reception and serving.',
      'echo "Initiating automated response for Type 21..."': 'Initiating automated response for Type 21...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Analyzing block serving requests..."': 'Analyzing block serving requests...',
      'grep "Served block" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'Served block blk_1234567890 to /192.168.1.100\nServed block blk_1234567890 to /192.168.1.101',
      'echo "Identifying root cause of repeated terminations..."': 'Identifying root cause of repeated terminations...',
      'echo "Restarting DataNode services..."': 'Restarting DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 21 completed successfully."': 'Automated response for Type 21 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 22)
function automatedResponseType22(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 22) {
      // 상단 배너 표시
      showTopBannerType22();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 22 Error: System deems blocks unstable due to repeated reception and replication failures."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 22..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Analyzing replication requests..."', delay: 1000 },
        { command: 'hdfs dfsadmin -report', delay: 2000 },
        { command: 'echo "Identifying problematic DataNodes..."', delay: 1000 },
        { command: 'hdfs fsck / -blocks -locations | grep "Under replicated"', delay: 2000 },
        { command: 'echo "Restarting affected DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Triggering block replication..."', delay: 1000 },
        { command: 'hdfs dfs -setrep -w 3 /path/to/affected/block', delay: 2000 },
        { command: 'echo "Block replication triggered."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 22 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType22(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 22)
  function simulateCommandOutputType22(command) {
    const outputs = {
      'echo "Detected Type 22 Error: System deems blocks unstable due to repeated reception and replication failures."': 'Detected Type 22 Error: System deems blocks unstable due to repeated reception and replication failures.',
      'echo "Initiating automated response for Type 22..."': 'Initiating automated response for Type 22...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Analyzing replication requests..."': 'Analyzing replication requests...',
      'hdfs dfsadmin -report': 'Live datanodes (4):\nName: 192.168.1.2:50010\nName: 192.168.1.3:50010\nName: 192.168.1.4:50010\nName: 192.168.1.5:50010',
      'echo "Identifying problematic DataNodes..."': 'Identifying problematic DataNodes...',
      'hdfs fsck / -blocks -locations | grep "Under replicated"': 'Under replicated blk_1234567890\nUnder replicated blk_0987654321',
      'echo "Restarting affected DataNode services..."': 'Restarting affected DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Triggering block replication..."': 'Triggering block replication...',
      'hdfs dfs -setrep -w 3 /path/to/affected/block': 'Replication factor for /path/to/affected/block set to 3.',
      'echo "Block replication triggered."': 'Block replication triggered.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 22 completed successfully."': 'Automated response for Type 22 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 23)
function automatedResponseType23(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 23) {
      // 상단 배너 표시
      showTopBannerType23();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 23 Error: Blocks not stably stored due to repeated reception interruptions and reallocations."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 23..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Analyzing block allocation logs..."', delay: 1000 },
        { command: 'grep "allocateBlock" /var/log/hadoop-hdfs/hadoop-hdfs-namenode.log', delay: 2000 },
        { command: 'echo "Identifying problematic DataNodes and Clients..."', delay: 1000 },
        { command: 'hdfs fsck / -blocks -locations | grep "Corrupt"', delay: 2000 },
        { command: 'echo "Restarting affected DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "Notifying clients to retry..."', delay: 1000 },
        { command: 'Send notification to clients via messaging system', delay: 2000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 23 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType23(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 23)
  function simulateCommandOutputType23(command) {
    const outputs = {
      'echo "Detected Type 23 Error: Blocks not stably stored due to repeated reception interruptions and reallocations."': 'Detected Type 23 Error: Blocks not stably stored due to repeated reception interruptions and reallocations.',
      'echo "Initiating automated response for Type 23..."': 'Initiating automated response for Type 23...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Analyzing block allocation logs..."': 'Analyzing block allocation logs...',
      'grep "allocateBlock" /var/log/hadoop-hdfs/hadoop-hdfs-namenode.log': 'allocateBlock: allocated blk_1234567890\nallocateBlock: allocated blk_0987654321',
      'echo "Identifying problematic DataNodes and Clients..."': 'Identifying problematic DataNodes and Clients...',
      'hdfs fsck / -blocks -locations | grep "Corrupt"': 'Corrupt blk_1234567890\nCorrupt blk_0987654321',
      'echo "Restarting affected DataNode services..."': 'Restarting affected DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "Notifying clients to retry..."': 'Notifying clients to retry...',
      'Send notification to clients via messaging system': 'Clients notified successfully.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 23 completed successfully."': 'Automated response for Type 23 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 24)
function automatedResponseType24(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 24) {
      // 상단 배너 표시
      showTopBannerType24();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 24 Error: Blocks not stored correctly due to reception interruptions and repeated replication requests."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 24..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Analyzing replication requests..."', delay: 1000 },
        { command: 'hdfs dfsadmin -report', delay: 2000 },
        { command: 'echo "Identifying problematic DataNodes..."', delay: 1000 },
        { command: 'hdfs fsck / -blocks -locations | grep "Under replicated"', delay: 2000 },
        { command: 'echo "Restarting affected DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Triggering block replication..."', delay: 1000 },
        { command: 'hdfs dfs -setrep -w 3 /path/to/affected/block', delay: 2000 },
        { command: 'echo "Block replication triggered."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 24 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType24(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 24)
  function simulateCommandOutputType24(command) {
    const outputs = {
      'echo "Detected Type 24 Error: Blocks not stored correctly due to reception interruptions and repeated replication requests."': 'Detected Type 24 Error: Blocks not stored correctly due to reception interruptions and repeated replication requests.',
      'echo "Initiating automated response for Type 24..."': 'Initiating automated response for Type 24...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Analyzing replication requests..."': 'Analyzing replication requests...',
      'hdfs dfsadmin -report': 'Live datanodes (4):\nName: 192.168.1.2:50010\nName: 192.168.1.3:50010\nName: 192.168.1.4:50010\nName: 192.168.1.5:50010',
      'echo "Identifying problematic DataNodes..."': 'Identifying problematic DataNodes...',
      'hdfs fsck / -blocks -locations | grep "Under replicated"': 'Under replicated blk_1234567890\nUnder replicated blk_0987654321',
      'echo "Restarting affected DataNode services..."': 'Restarting affected DataNode services...',
      'ssh datanode1 "sudo service hadoop-hdfs-datanode restart"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Triggering block replication..."': 'Triggering block replication...',
      'hdfs dfs -setrep -w 3 /path/to/affected/block': 'Replication factor for /path/to/affected/block set to 3.',
      'echo "Block replication triggered."': 'Block replication triggered.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size:    8000 B\n Total dirs:    80\n Total files:   400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 24 completed successfully."': 'Automated response for Type 24 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 25)
function automatedResponseType25(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 25) {
      // 상단 배너 표시
      showTopBannerType25();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 25 Error: Blocks not stably stored due to reception interruptions and repeated state updates."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 25..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Identifying repeated state updates..."', delay: 1000 },
        { command: 'grep "blockMap updated" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Checking network status..."', delay: 1000 },
        { command: 'ping -c 4 namenode', delay: 2000 },
        { command: 'echo "Restarting affected DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 25 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType25(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 25)
  function simulateCommandOutputType25(command) {
    const outputs = {
      'echo "Detected Type 25 Error: Blocks not stably stored due to reception interruptions and repeated state updates."': 'Detected Type 25 Error: Blocks not stably stored due to reception interruptions and repeated state updates.',
      'echo "Initiating automated response for Type 25..."': 'Initiating automated response for Type 25...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Identifying repeated state updates..."': 'Identifying repeated state updates...',
      'grep "blockMap updated" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'blockMap updated: blk_1234567890\nblockMap updated: blk_0987654321',
      'echo "Checking network status..."': 'Checking network status...',
      'ping -c 4 namenode': 'PING namenode (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.123 ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.112 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.110 ms\n64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=0.115 ms',
      'echo "Restarting affected DataNode services..."': 'Restarting affected DataNode services...',
      'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size: 8000 B\n Total dirs: 80\n Total files: 400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 25 completed successfully."': 'Automated response for Type 25 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  

// 자동 대응 함수 (Type 27)
function automatedResponseType27(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 27) {
      // 상단 배너 표시
      showTopBannerType27();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 27 Error: Blocks not stably stored due to various exceptions and repeated state updates during reception."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 27..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Analyzing exception events..."', delay: 1000 },
        { command: 'grep -E "Exception writing block|receiveBlock exception|IOException in BlockReceiver" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Checking DataNode hardware status..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo smartctl -H /dev/sda"', delay: 2000 },
        { command: 'echo "Checking network connectivity..."', delay: 1000 },
        { command: 'ping -c 4 namenode', delay: 2000 },
        { command: 'echo "Restarting affected DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"', delay: 2000 },
        { command: 'echo "Updating DataNode software..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo yum update hadoop-hdfs-datanode -y"', delay: 2000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 27 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType27(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 27)
  function simulateCommandOutputType27(command) {
    const outputs = {
      'echo "Detected Type 27 Error: Blocks not stably stored due to various exceptions and repeated state updates during reception."': 'Detected Type 27 Error: Blocks not stably stored due to various exceptions and repeated state updates during reception.',
      'echo "Initiating automated response for Type 27..."': 'Initiating automated response for Type 27...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Analyzing exception events..."': 'Analyzing exception events...',
      'grep -E "Exception writing block|receiveBlock exception|IOException in BlockReceiver" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'Exception writing block to mirror\nreceiveBlock exception\nIOException in BlockReceiver',
      'echo "Checking DataNode hardware status..."': 'Checking DataNode hardware status...',
      'ssh datanode1 "sudo smartctl -H /dev/sda"': '/dev/sda: SMART Health Status: OK',
      'echo "Checking network connectivity..."': 'Checking network connectivity...',
      'ping -c 4 namenode': 'PING namenode (192.168.1.1): 56 data bytes\n64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=0.123 ms\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.112 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.110 ms\n64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=0.115 ms',
      'echo "Restarting affected DataNode services..."': 'Restarting affected DataNode services...',
      'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"': 'DataNode service restarted on datanode1.',
      'echo "Updating DataNode software..."': 'Updating DataNode software...',
      'ssh datanode1 "sudo yum update hadoop-hdfs-datanode -y"': 'Packages updated successfully.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size: 8000 B\n Total dirs: 80\n Total files: 400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 27 completed successfully."': 'Automated response for Type 27 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 28)
function automatedResponseType28(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 28) {
      // 상단 배너 표시
      showTopBannerType28();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 28 Error: Blocks not stably stored due to repeated state updates and block reopens."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 28..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Checking for block reopen events..."', delay: 1000 },
        { command: 'grep "Reopening block" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Inspecting block file handles..."', delay: 1000 },
        { command: 'lsof | grep blk_1234567890', delay: 2000 },
        { command: 'echo "Restarting affected DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 28 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType28(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 28)
  function simulateCommandOutputType28(command) {
    const outputs = {
      'echo "Detected Type 28 Error: Blocks not stably stored due to repeated state updates and block reopens."': 'Detected Type 28 Error: Blocks not stably stored due to repeated state updates and block reopens.',
      'echo "Initiating automated response for Type 28..."': 'Initiating automated response for Type 28...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_1234567890 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Checking for block reopen events..."': 'Checking for block reopen events...',
      'grep "Reopening block" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'Reopening block blk_1234567890\nReopening block blk_0987654321',
      'echo "Inspecting block file handles..."': 'Inspecting block file handles...',
      'lsof | grep blk_1234567890': 'java    12345 hdfs  123u REG 8,1 0 1234567 /data/hdfs/blk_1234567890',
      'echo "Restarting affected DataNode services..."': 'Restarting affected DataNode services...',
      'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size: 8000 B\n Total dirs: 80\n Total files: 400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 28 completed successfully."': 'Automated response for Type 28 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }  
// 자동 대응 함수 (Type 30)
function automatedResponseType30(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 30) {
      // 상단 배너 표시
      showTopBannerType30();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 30 Error: Blocks not stably stored due to repeated reception interruptions and state update failures."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 30..."', delay: 1000 },
        { command: 'echo "Analyzing PacketResponder logs..."', delay: 1000 },
        { command: 'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Checking for repeated state update failures..."', delay: 1000 },
        { command: 'grep "blockMap updated" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log', delay: 2000 },
        { command: 'echo "Restarting affected DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Synchronizing metadata between NameNode and DataNode..."', delay: 1000 },
        { command: 'hdfs dfsadmin -safemode enter', delay: 2000 },
        { command: 'hdfs dfsadmin -saveNamespace', delay: 2000 },
        { command: 'hdfs dfsadmin -safemode leave', delay: 2000 },
        { command: 'echo "Metadata synchronization complete."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck / -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Refreshing DataNode registrations..."', delay: 1000 },
        { command: 'hdfs dfsadmin -refreshNodes', delay: 2000 },
        { command: 'echo "DataNode registrations refreshed."', delay: 1000 },
        { command: 'echo "Automated response for Type 30 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType30(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 30)
  function simulateCommandOutputType30(command) {
    const outputs = {
      'echo "Detected Type 30 Error: Blocks not stably stored due to repeated reception interruptions and state update failures."': 'Detected Type 30 Error: Blocks not stably stored due to repeated reception interruptions and state update failures.',
      'echo "Initiating automated response for Type 30..."': 'Initiating automated response for Type 30...',
      'echo "Analyzing PacketResponder logs..."': 'Analyzing PacketResponder logs...',
      'grep "PacketResponder" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'PacketResponder - for block blk_8122219743087224472 terminating\nPacketResponder exception\nPacketResponder encountered an error',
      'echo "Checking for repeated state update failures..."': 'Checking for repeated state update failures...',
      'grep "blockMap updated" /var/log/hadoop-hdfs/hadoop-hdfs-datanode.log': 'blockMap updated: blk_8122219743087224472\nblockMap update failed for blk_8122219743087224472',
      'echo "Restarting affected DataNode services..."': 'Restarting affected DataNode services...',
      'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Synchronizing metadata between NameNode and DataNode..."': 'Synchronizing metadata between NameNode and DataNode...',
      'hdfs dfsadmin -safemode enter': 'Safe mode is ON',
      'hdfs dfsadmin -saveNamespace': 'Save namespace successful.',
      'hdfs dfsadmin -safemode leave': 'Safe mode is OFF',
      'echo "Metadata synchronization complete."': 'Metadata synchronization complete.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck / -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size: 8000 B\n Total dirs: 80\n Total files: 400\n Total blocks (validated): 480',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Refreshing DataNode registrations..."': 'Refreshing DataNode registrations...',
      'hdfs dfsadmin -refreshNodes': 'Refresh nodes successful.',
      'echo "DataNode registrations refreshed."': 'DataNode registrations refreshed.',
      'echo "Automated response for Type 30 completed successfully."': 'Automated response for Type 30 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
  // 자동 대응 함수 (Type 31)
function automatedResponseType31(data) {
    const terminal = document.getElementById('terminalOutput');
  
    if (data.error_type === 31) {
      // 상단 배너 표시
      showTopBannerType31();
  
      // 가상 명령어 실행 시뮬레이션
      const commands = [
        { command: 'echo "Detected Type 31 Error: Write exception occurred during block reception, block not stored properly."', delay: 1000 },
        { command: 'echo "Initiating automated response for Type 31..."', delay: 1000 },
        { command: 'echo "Checking disk space on DataNodes..."', delay: 1000 },
        { command: 'ssh datanode1 "df -h | grep /data"', delay: 2000 },
        { command: 'echo "Checking disk health on DataNodes..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo smartctl -H /dev/sda"', delay: 2000 },
        { command: 'echo "Verifying file system integrity..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo fsck -y /dev/sda1"', delay: 2000 },
        { command: 'echo "Checking DataNode directory permissions..."', delay: 1000 },
        { command: 'ssh datanode1 "ls -ld /data/hadoop/hdfs/datanode"', delay: 2000 },
        { command: 'echo "Restarting affected DataNode services..."', delay: 1000 },
        { command: 'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"', delay: 2000 },
        { command: 'echo "DataNode services restarted."', delay: 1000 },
        { command: 'echo "Reattempting block reception..."', delay: 1000 },
        { command: 'hadoop fs -put /path/to/block /destination/path', delay: 2000 },
        { command: 'echo "Block reception reattempt completed."', delay: 1000 },
        { command: 'echo "Verifying block integrity..."', delay: 1000 },
        { command: 'hdfs fsck /destination/path -files -blocks -locations', delay: 2000 },
        { command: 'echo "Block integrity verified."', delay: 1000 },
        { command: 'echo "Automated response for Type 31 completed successfully."', delay: 1000 },
        { command: `echo "Completion Time: ${new Date().toLocaleString()}"`, delay: 1000 },
      ];
  
      let i = 0;
      const executeCommand = () => {
        if (i < commands.length) {
          terminal.textContent += `$ ${commands[i].command}\n`;
          setTimeout(() => {
            // 명령어 출력 (실제 실행 결과를 시뮬레이션)
            terminal.textContent += `${simulateCommandOutputType31(commands[i].command)}\n`;
            terminal.scrollTop = terminal.scrollHeight; // 스크롤을 가장 아래로
            i++;
            executeCommand();
          }, commands[i].delay);
        }
      };
      executeCommand();
    }
  }
  
  // 명령어 출력 결과를 시뮬레이션하는 함수 (Type 31)
  function simulateCommandOutputType31(command) {
    const outputs = {
      'echo "Detected Type 31 Error: Write exception occurred during block reception, block not stored properly."': 'Detected Type 31 Error: Write exception occurred during block reception, block not stored properly.',
      'echo "Initiating automated response for Type 31..."': 'Initiating automated response for Type 31...',
      'echo "Checking disk space on DataNodes..."': 'Checking disk space on DataNodes...',
      'ssh datanode1 "df -h | grep /data"': '/dev/sda1        100G   80G   20G  80% /data',
      'echo "Checking disk health on DataNodes..."': 'Checking disk health on DataNodes...',
      'ssh datanode1 "sudo smartctl -H /dev/sda"': '/dev/sda: SMART Health Status: OK',
      'echo "Verifying file system integrity..."': 'Verifying file system integrity...',
      'ssh datanode1 "sudo fsck -y /dev/sda1"': 'Filesystem checked, no errors found.',
      'echo "Checking DataNode directory permissions..."': 'Checking DataNode directory permissions...',
      'ssh datanode1 "ls -ld /data/hadoop/hdfs/datanode"': 'drwxr-xr-x 3 hdfs hadoop 4096 Sep 30 12:00 /data/hadoop/hdfs/datanode',
      'echo "Restarting affected DataNode services..."': 'Restarting affected DataNode services...',
      'ssh datanode1 "sudo systemctl restart hadoop-hdfs-datanode"': 'DataNode service restarted on datanode1.',
      'echo "DataNode services restarted."': 'DataNode services restarted.',
      'echo "Reattempting block reception..."': 'Reattempting block reception...',
      'hadoop fs -put /path/to/block /destination/path': 'Block successfully written to /destination/path',
      'echo "Block reception reattempt completed."': 'Block reception reattempt completed.',
      'echo "Verifying block integrity..."': 'Verifying block integrity...',
      'hdfs fsck /destination/path -files -blocks -locations': 'FSCK started by admin\nStatus: HEALTHY\n Total size: 1000 B\n Total dirs: 1\n Total files: 1\n Total blocks (validated): 1',
      'echo "Block integrity verified."': 'Block integrity verified.',
      'echo "Automated response for Type 31 completed successfully."': 'Automated response for Type 31 completed successfully.',
      [`echo "Completion Time: ${new Date().toLocaleString()}"`]: `Completion Time: ${new Date().toLocaleString()}`,
    };
    return outputs[command] || '';
  }
//===============배너 표시 함수===============
  // 배너 표시 함수
function showTopBanner() {
    const banner = document.getElementById('topBanner');
    banner.style.display = 'block';
  }
  
  // 상단 배너 표시 함수
  function showTopBannerType1() {
    const banner = document.getElementById('topBannerType1');
    banner.style.display = 'block';
  }
  // 상단 배너 표시 함수 (Type 3)
function showTopBannerType3() {
    const banner = document.getElementById('topBannerType3');
    banner.style.display = 'block';
  }

  // 상단 배너 표시 함수 (Type 4)
function showTopBannerType4() {
    const banner = document.getElementById('topBannerType4');
    banner.style.display = 'block';
  }

// 상단 배너 표시 함수 (Type 5)
function showTopBannerType5() {
    const banner = document.getElementById('topBannerType5');
    banner.style.display = 'block';
  }
// 상단 배너 표시 함수 (Type 7)
function showTopBannerType7() {
    const banner = document.getElementById('topBannerType7');
    banner.style.display = 'block';
  }
  // 상단 배너 표시 함수 (Type 8)
function showTopBannerType8() {
    const banner = document.getElementById('topBannerType8');
    banner.style.display = 'block';
  }
  // 상단 배너 표시 함수 (Type 9)
function showTopBannerType9() {
    const banner = document.getElementById('topBannerType9');
    banner.style.display = 'block';
  }
// 상단 배너 표시 함수 (Type 10)
function showTopBannerType10() {
    const banner = document.getElementById('topBannerType10');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 11)
function showTopBannerType11() {
    const banner = document.getElementById('topBannerType11');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 12)
function showTopBannerType12() {
    const banner = document.getElementById('topBannerType12');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 13)
function showTopBannerType13() {
    const banner = document.getElementById('topBannerType13');
    banner.style.display = 'block';
  }  
  // 상단 배너 표시 함수 (Type 16)
function showTopBannerType16() {
    const banner = document.getElementById('topBannerType16');
    banner.style.display = 'block';
  }
// 상단 배너 표시 함수 (Type 17)
function showTopBannerType17() {
    const banner = document.getElementById('topBannerType17');
    banner.style.display = 'block';
  }  
 // 상단 배너 표시 함수 (Type 18)
function showTopBannerType18() {
    const banner = document.getElementById('topBannerType18');
    banner.style.display = 'block';
  } 
// 상단 배너 표시 함수 (Type 19)
function showTopBannerType19() {
    const banner = document.getElementById('topBannerType19');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 20)
function showTopBannerType20() {
    const banner = document.getElementById('topBannerType20');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 21)
function showTopBannerType21() {
    const banner = document.getElementById('topBannerType21');
    banner.style.display = 'block';
  }  

// 상단 배너 표시 함수 (Type 22)
function showTopBannerType22() {
    const banner = document.getElementById('topBannerType22');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 23)
function showTopBannerType23() {
    const banner = document.getElementById('topBannerType23');
    banner.style.display = 'block';
  }
// 상단 배너 표시 함수 (Type 24)
function showTopBannerType24() {
    const banner = document.getElementById('topBannerType24');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 25)
function showTopBannerType25() {
    const banner = document.getElementById('topBannerType25');
    banner.style.display = 'block';
  }

// 상단 배너 표시 함수 (Type 27)
function showTopBannerType27() {
    const banner = document.getElementById('topBannerType27');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 28)
function showTopBannerType28() {
    const banner = document.getElementById('topBannerType28');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 30)
function showTopBannerType30() {
    const banner = document.getElementById('topBannerType30');
    banner.style.display = 'block';
  }  
// 상단 배너 표시 함수 (Type 31)
function showTopBannerType31() {
    const banner = document.getElementById('topBannerType31');
    banner.style.display = 'block';
  }  
//===============배너 닫기 함수===============
// 배너 닫기 함수
function closeBanner() {
        const banner = document.getElementById('topBanner');
        banner.style.display = 'none';
}
// 배너 닫기 함수
function closeBannerType1() {
    const banner = document.getElementById('topBannerType1');
    banner.style.display = 'none';
}
  // 배너 닫기 함수 (Type 3)
function closeBannerType3() {
    const banner = document.getElementById('topBannerType3');
    banner.style.display = 'none';
  }

  // 배너 닫기 함수 (Type 4)
function closeBannerType4() {
    const banner = document.getElementById('topBannerType4');
    banner.style.display = 'none';
  }

// 배너 닫기 함수 (Type 5)
function closeBannerType5() {
    const banner = document.getElementById('topBannerType5');
    banner.style.display = 'none';
  }
// 배너 닫기 함수 (Type 7)
function closeBannerType7() {
    const banner = document.getElementById('topBannerType7');
    banner.style.display = 'none';
  }
  // 배너 닫기 함수 (Type 8)
function closeBannerType8() {
    const banner = document.getElementById('topBannerType8');
    banner.style.display = 'none';
  }
// 배너 닫기 함수 (Type 9)
function closeBannerType9() {
    const banner = document.getElementById('topBannerType9');
    banner.style.display = 'none';
  }
 // 배너 닫기 함수 (Type 10)
function closeBannerType10() {
    const banner = document.getElementById('topBannerType10');
    banner.style.display = 'none';
  } 
// 배너 닫기 함수 (Type 11)
function closeBannerType11() {
    const banner = document.getElementById('topBannerType11');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 12)
function closeBannerType12() {
    const banner = document.getElementById('topBannerType12');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 13)
function closeBannerType13() {
    const banner = document.getElementById('topBannerType13');
    banner.style.display = 'none';
  }  
  // 배너 닫기 함수 (Type 16)
function closeBannerType16() {
    const banner = document.getElementById('topBannerType16');
    banner.style.display = 'none';
  }
// 배너 닫기 함수 (Type 17)
function closeBannerType17() {
    const banner = document.getElementById('topBannerType17');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 18)
function closeBannerType18() {
    const banner = document.getElementById('topBannerType18');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 19)
function closeBannerType19() {
    const banner = document.getElementById('topBannerType19');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 20)
function closeBannerType20() {
    const banner = document.getElementById('topBannerType20');
    banner.style.display = 'none';
  } 
// 배너 닫기 함수 (Type 21)
function closeBannerType21() {
    const banner = document.getElementById('topBannerType21');
    banner.style.display = 'none';
  }   
// 배너 닫기 함수 (Type 22)
function closeBannerType22() {
    const banner = document.getElementById('topBannerType22');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 23)
function closeBannerType23() {
    const banner = document.getElementById('topBannerType23');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 24)
function closeBannerType24() {
    const banner = document.getElementById('topBannerType24');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 25)
function closeBannerType25() {
    const banner = document.getElementById('topBannerType25');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 27)
function closeBannerType27() {
    const banner = document.getElementById('topBannerType27');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 28)
function closeBannerType28() {
    const banner = document.getElementById('topBannerType28');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 30)
function closeBannerType30() {
    const banner = document.getElementById('topBannerType30');
    banner.style.display = 'none';
  }  
// 배너 닫기 함수 (Type 31)
function closeBannerType31() {
    const banner = document.getElementById('topBannerType31');
    banner.style.display = 'none';
  }  
//===============보고서 표시 함수===============
  // 보고서 표시 함수
function showReport() {
    // 보고서 내용을 동적으로 생성
    const reportContent = document.getElementById('reportContent');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 0</p>
      <p><strong>Description:</strong> Metadata inconsistency detected.</p>
      <p><strong>Automated Response:</strong> Executed successfully.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
      <!-- 추가적인 정보나 로그를 여기에 포함할 수 있습니다 -->
    `;
    // 모달 창 표시
    $('#reportModal').modal('show');
  }
  // 보고서 표시 함수
  function showReportType1() {
    const reportContent = document.getElementById('reportContentType1');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 1</p>
      <p><strong>Description:</strong> Unstable block reception and re-registration detected.</p>
      <p><strong>Automated Response:</strong> Affected DataNodes restarted, block consistency verified.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType1').modal('show');
  }
// 보고서 표시 함수 (Type 3)
function showReportType3() {
    const reportContent = document.getElementById('reportContentType3');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 3</p>
      <p><strong>Description:</strong> Block halted without further processing after reception.</p>
      <p><strong>Automated Response:</strong> Block integrity verified, metadata updated, replication initiated.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType3').modal('show');
  }

  // 보고서 표시 함수 (Type 4)
function showReportType4() {
    const reportContent = document.getElementById('reportContentType4');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 4</p>
      <p><strong>Description:</strong> Repeated block reception and status updates causing data inconsistency.</p>
      <p><strong>Automated Response:</strong> Network analysis performed, duplicate blocks removed, metadata refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType4').modal('show');
  }

// 보고서 표시 함수 (Type 5)
function showReportType5() {
    const reportContent = document.getElementById('reportContentType5');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 5</p>
      <p><strong>Description:</strong> Repeated block reception and replication failures causing data inconsistency.</p>
      <p><strong>Automated Response:</strong> Replication factor adjusted, DataNode statuses refreshed, metadata consistency verified.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType5').modal('show');
  }
  // 보고서 표시 함수 (Type 7)
function showReportType7() {
    const reportContent = document.getElementById('reportContentType7');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 7</p>
      <p><strong>Description:</strong> Inconsistent block state due to empty packet reception and repeated status updates.</p>
      <p><strong>Automated Response:</strong> Network connectivity analyzed, PacketResponder restarted, block integrity verified, metadata refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType7').modal('show');
  }
  // 보고서 표시 함수 (Type 8)
function showReportType8() {
    const reportContent = document.getElementById('reportContentType8');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 8</p>
      <p><strong>Description:</strong> Repeated block reception and replication leading to unstable block state updates.</p>
      <p><strong>Automated Response:</strong> DataNode statuses checked, replication factor adjusted, replication process restarted, metadata refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType8').modal('show');
  }
 // 보고서 표시 함수 (Type 9)
function showReportType9() {
    const reportContent = document.getElementById('reportContentType9');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 9</p>
      <p><strong>Description:</strong> Persistent exceptions during block reception and retries causing data inconsistency.</p>
      <p><strong>Automated Response:</strong> Exception logs analyzed, DataNode services restarted, block integrity verified, metadata refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType9').modal('show');
  }
// 보고서 표시 함수 (Type 10)
function showReportType10() {
    const reportContent = document.getElementById('reportContentType10');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 10</p>
      <p><strong>Description:</strong> Repeated block state updates without successful completion.</p>
      <p><strong>Automated Response:</strong> Network status analyzed, DataNode health checked, PacketResponder services restarted, block integrity verified, metadata refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType10').modal('show');
  }   

// 보고서 표시 함수 (Type 11)
function showReportType11() {
    const reportContent = document.getElementById('reportContentType11');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 11</p>
      <p><strong>Description:</strong> Unstable block reception due to various exceptions and errors during block reception and response.</p>
      <p><strong>Automated Response:</strong> Exception logs analyzed, DataNode services restarted, block integrity verified, metadata refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType11').modal('show');
  }  

// 보고서 표시 함수 (Type 12)
function showReportType12() {
    const reportContent = document.getElementById('reportContentType12');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 12</p>
      <p><strong>Description:</strong> Continuous block state updates without stabilization, leading to abnormal system state.</p>
      <p><strong>Automated Response:</strong> Block metadata analyzed, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType12').modal('show');
  }  
// 보고서 표시 함수 (Type 13)
function showReportType13() {
    const reportContent = document.getElementById('reportContentType13');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 13</p>
      <p><strong>Description:</strong> Multiple exceptions during block reception and transmission, causing inability to terminate normally.</p>
      <p><strong>Automated Response:</strong> Exception logs analyzed, DataNode services restarted, block file integrity verified, block file offsets adjusted, metadata refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType13').modal('show');
  }  
// 보고서 표시 함수 (Type 16)
function showReportType16() {
    const reportContent = document.getElementById('reportContentType16');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 16</p>
      <p><strong>Description:</strong> Unstable block reception due to repeated exceptions and retries.</p>
      <p><strong>Automated Response:</strong> Exception logs analyzed, DataNode services restarted, network connectivity verified, block integrity verified, metadata refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType16').modal('show');
  }
  // 보고서 표시 함수 (Type 17)
function showReportType17() {
    const reportContent = document.getElementById('reportContentType17');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 17</p>
      <p><strong>Description:</strong> Block inconsistency due to repeated transmission failures and duplicate storage.</p>
      <p><strong>Automated Response:</strong> Block metadata analyzed, duplicate blocks identified and removed, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType17').modal('show');
  }

// 보고서 표시 함수 (Type 18)
function showReportType18() {
    const reportContent = document.getElementById('reportContentType18');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 18</p>
      <p><strong>Description:</strong> Unstable state due to repeated reception and replication attempts without successful transmission.</p>
      <p><strong>Automated Response:</strong> Block metadata analyzed, replication issues identified, DataNode services restarted, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType18').modal('show');
  }  
// 보고서 표시 함수 (Type 19)
function showReportType19() {
    const reportContent = document.getElementById('reportContentType19');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 19</p>
      <p><strong>Description:</strong> Unstable state due to repeated issues during block reception and response termination.</p>
      <p><strong>Automated Response:</strong> PacketResponder logs analyzed, DataNode services restarted, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType19').modal('show');
  }  
// 보고서 표시 함수 (Type 20)
function showReportType20() {
    const reportContent = document.getElementById('reportContentType20');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 20</p>
      <p><strong>Description:</strong> Unstable state due to repeated response interruptions and replication requests.</p>
      <p><strong>Automated Response:</strong> PacketResponder logs analyzed, replication issues identified, DataNode services restarted, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType20').modal('show');
  }  
// 보고서 표시 함수 (Type 21)
function showReportType21() {
    const reportContent = document.getElementById('reportContentType21');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 21</p>
      <p><strong>Description:</strong> Unstable state due to repeated issues in block reception and serving.</p>
      <p><strong>Automated Response:</strong> PacketResponder and block serving logs analyzed, DataNode services restarted, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType21').modal('show');
  }  
// 보고서 표시 함수 (Type 22)
function showReportType22() {
    const reportContent = document.getElementById('reportContentType22');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 22</p>
      <p><strong>Description:</strong> System deems blocks unstable due to repeated reception and replication failures.</p>
      <p><strong>Automated Response:</strong> PacketResponder logs analyzed, problematic DataNodes identified and restarted, metadata synchronized, block replication triggered, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType22').modal('show');
  }  

// 보고서 표시 함수 (Type 23)
function showReportType23() {
    const reportContent = document.getElementById('reportContentType23');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 23</p>
      <p><strong>Description:</strong> Blocks not stably stored due to repeated reception interruptions and reallocations.</p>
      <p><strong>Automated Response:</strong> PacketResponder and block allocation logs analyzed, problematic DataNodes and Clients identified, services restarted, clients notified, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType23').modal('show');
  }  

// 보고서 표시 함수 (Type 24)
function showReportType24() {
    const reportContent = document.getElementById('reportContentType24');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 24</p>
      <p><strong>Description:</strong> Blocks not stored correctly due to reception interruptions and repeated replication requests.</p>
      <p><strong>Automated Response:</strong> PacketResponder logs analyzed, problematic DataNodes identified and restarted, metadata synchronized, block replication triggered, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType24').modal('show');
  }  
// 보고서 표시 함수 (Type 25)
function showReportType25() {
    const reportContent = document.getElementById('reportContentType25');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 25</p>
      <p><strong>Description:</strong> Blocks not stably stored due to reception interruptions and repeated state updates.</p>
      <p><strong>Automated Response:</strong> PacketResponder logs analyzed, repeated state updates identified, network status checked, DataNode services restarted, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType25').modal('show');
  }  
// 보고서 표시 함수 (Type 27)
function showReportType27() {
    const reportContent = document.getElementById('reportContentType27');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 27</p>
      <p><strong>Description:</strong> Blocks not stably stored due to various exceptions and repeated state updates during reception.</p>
      <p><strong>Automated Response:</strong> PacketResponder and exception logs analyzed, DataNode hardware and network status checked, DataNode services restarted and updated, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType27').modal('show');
  }  
// 보고서 표시 함수 (Type 28)
function showReportType28() {
    const reportContent = document.getElementById('reportContentType28');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 28</p>
      <p><strong>Description:</strong> Blocks not stably stored due to repeated state updates and block reopens.</p>
      <p><strong>Automated Response:</strong> PacketResponder logs analyzed, block reopen events checked, file handles inspected, DataNode services restarted, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType28').modal('show');
  }  
// 보고서 표시 함수 (Type 30)
function showReportType30() {
    const reportContent = document.getElementById('reportContentType30');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 30</p>
      <p><strong>Description:</strong> Blocks not stably stored due to repeated reception interruptions and state update failures.</p>
      <p><strong>Automated Response:</strong> PacketResponder logs analyzed, state update failures checked, DataNode services restarted, metadata synchronized, block integrity verified, DataNode registrations refreshed.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType30').modal('show');
  }  
// 보고서 표시 함수 (Type 31)
function showReportType31() {
    const reportContent = document.getElementById('reportContentType31');
    reportContent.innerHTML = `
      <p><strong>Error Type:</strong> 31</p>
      <p><strong>Description:</strong> Write exception occurred during block reception, block not stored properly.</p>
      <p><strong>Automated Response:</strong> Checked disk space and health on DataNodes, verified file system integrity, checked directory permissions, restarted DataNode services, reattempted block reception, verified block integrity.</p>
      <p><strong>Completion Time:</strong> ${new Date().toLocaleString()}</p>
    `;
    $('#reportModalType31').modal('show');
  }  
//===============배너의 링크에 이벤트 리스너 추가===============
  // 배너의 링크에 이벤트 리스너 추가
document.getElementById('reportLink').addEventListener('click', function(event) {
    event.preventDefault();
    showReport();
  });

  // 배너의 링크에 이벤트 리스너 추가 (Type 1)
document.getElementById('reportLinkType1').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType1();
  });

// 배너의 링크에 이벤트 리스너 추가 (Type 3)
document.getElementById('reportLinkType3').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType3();
  });
// 배너의 링크에 이벤트 리스너 추가 (Type 4)
document.getElementById('reportLinkType4').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType4();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 5)
document.getElementById('reportLinkType5').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType5();
  });

// 배너의 링크에 이벤트 리스너 추가 (Type 7)
document.getElementById('reportLinkType7').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType7();
  });
  // 배너의 링크에 이벤트 리스너 추가 (Type 8)
document.getElementById('reportLinkType8').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType8();
  });
// 배너의 링크에 이벤트 리스너 추가 (Type 9)
document.getElementById('reportLinkType9').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType9();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 10)
document.getElementById('reportLinkType10').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType10();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 11)
document.getElementById('reportLinkType11').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType11();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 12)
document.getElementById('reportLinkType12').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType12();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 13)
document.getElementById('reportLinkType13').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType13();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 16)
document.getElementById('reportLinkType16').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType16();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 17)
document.getElementById('reportLinkType17').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType17();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 18)
document.getElementById('reportLinkType18').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType18();
  });  

// 배너의 링크에 이벤트 리스너 추가 (Type 19)
document.getElementById('reportLinkType19').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType19();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 20)
document.getElementById('reportLinkType20').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType20();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 21)
document.getElementById('reportLinkType21').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType21();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 22)
document.getElementById('reportLinkType22').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType22();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 23)
document.getElementById('reportLinkType23').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType23();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 24)
document.getElementById('reportLinkType24').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType24();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 25)
document.getElementById('reportLinkType25').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType25();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 27)
document.getElementById('reportLinkType27').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType27();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 28)
document.getElementById('reportLinkType28').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType28();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 30)
document.getElementById('reportLinkType30').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType30();
  });  
// 배너의 링크에 이벤트 리스너 추가 (Type 31)
document.getElementById('reportLinkType31').addEventListener('click', function(event) {
    event.preventDefault();
    showReportType31();
  });  
  //===============모달 창 닫기 함수===============
// 모달 창 닫기 함수
function closeReportModal() {
        $('#reportModal').modal('hide');
      }
// 모달 창 닫기 함수 (Type 1)
function closeReportModalType1() {
    $('#reportModalType1').modal('hide');
  }

// 모달 창 닫기 함수 (Type 3)
function closeReportModalType3() {
  $('#reportModalType3').modal('hide');
}  
// 모달 창 닫기 함수 (Type 4)
function closeReportModalType4() {
    $('#reportModalType4').modal('hide');
  }
// 모달 창 닫기 함수 (Type 5)
function closeReportModalType5() {
  $('#reportModalType5').modal('hide');
}
// 모달 창 닫기 함수 (Type 7)
function closeReportModalType7() {
    $('#reportModalType7').modal('hide');
  }
// 모달 창 닫기 함수 (Type 8)
function closeReportModalType8() {
    $('#reportModalType8').modal('hide');
  }
// 모달 창 닫기 함수 (Type 9)
function closeReportModalType9() {
    $('#reportModalType9').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 10)
function closeReportModalType10() {
    $('#reportModalType10').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 11)
function closeReportModalType11() {
    $('#reportModalType11').modal('hide');
  }
// 모달 창 닫기 함수 (Type 12)
function closeReportModalType12() {
    $('#reportModalType12').modal('hide');
  }
// 모달 창 닫기 함수 (Type 13)
function closeReportModalType13() {
    $('#reportModalType13').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 16)
function closeReportModalType16() {
    $('#reportModalType16').modal('hide');
  }  

// 모달 창 닫기 함수 (Type 17)
function closeReportModalType17() {
    $('#reportModalType17').modal('hide');
  }

// 모달 창 닫기 함수 (Type 18)
function closeReportModalType18() {
    $('#reportModalType18').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 19)
function closeReportModalType19() {
    $('#reportModalType19').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 20)
function closeReportModalType20() {
    $('#reportModalType20').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 21)
function closeReportModalType21() {
    $('#reportModalType21').modal('hide');
  }
  // 모달 창 닫기 함수 (Type 22)
function closeReportModalType22() {
    $('#reportModalType22').modal('hide');
  }
// 모달 창 닫기 함수 (Type 23)
function closeReportModalType23() {
    $('#reportModalType23').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 24)
function closeReportModalType24() {
    $('#reportModalType24').modal('hide');
  }  

// 모달 창 닫기 함수 (Type 25)
function closeReportModalType25() {
    $('#reportModalType25').modal('hide');
  }  

// 모달 창 닫기 함수 (Type 27)
function closeReportModalType27() {
    $('#reportModalType27').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 28)
function closeReportModalType28() {
    $('#reportModalType28').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 30)
function closeReportModalType30() {
    $('#reportModalType30').modal('hide');
  }  
// 모달 창 닫기 함수 (Type 31)
function closeReportModalType31() {
    $('#reportModalType31').modal('hide');
  }  