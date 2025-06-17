/* sprints\sprint7\hu11\hu11.js */
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const scenariosSelectionList = document.getElementById('scenarios-selection-list');
    const predictionModelSelect = document.getElementById('prediction-model');
    const generateBtn = document.getElementById('generate-prediction-btn');
    const resultsArea = document.getElementById('results-area');
    const chartCanvas = document.getElementById('prediction-chart');
    const realTimeControlsContainer = document.getElementById('real-time-controls');

    // Estado de la aplicación
    let scenarios = JSON.parse(localStorage.getItem('airQualityScenarios')) || [];
    let predictionChart = null;
    let currentlyDisplayedScenarios = [];
    const chartColors = ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'];

    // Función para cargar los escenarios como checkboxes
    const loadScenariosForSelection = () => {
        scenariosSelectionList.innerHTML = '';
        if (scenarios.length === 0) {
            scenariosSelectionList.innerHTML = '<p class="text-muted">No hay escenarios guardados. <a href="../hu10/hu10.html">Crea uno primero</a>.</p>';
            generateBtn.disabled = true;
        } else {
            scenarios.forEach(scenario => {
                const checkboxHtml = `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${scenario.id}" id="check-${scenario.id}">
                        <label class="form-check-label" for="check-${scenario.id}">${scenario.name}</label>
                    </div>
                `;
                scenariosSelectionList.innerHTML += checkboxHtml;
            });
            generateBtn.disabled = false;
        }
    };

    // Función para simular el cálculo de la predicción
    const calculatePrediction = (scenario, model) => {
        const basePM25 = (scenario.cars * 0.4) + (scenario.industry * 0.8) - (scenario.greenAreas * 0.3);
        const baseNO2 = (scenario.cars * 0.6) + (scenario.industry * 0.5) - (scenario.greenAreas * 0.1);
        const baseO3 = (scenario.cars * 0.2) + (scenario.industry * 0.3) - (scenario.greenAreas * 0.5);

        let multiplier = 1.0;
        if (model === 'optimistic') multiplier = 0.75;
        if (model === 'pessimistic') multiplier = 1.25;

        // Asegurarse de que los valores no sean negativos
        return {
            pm25: Math.max(0, basePM25 * multiplier).toFixed(2),
            no2: Math.max(0, baseNO2 * multiplier).toFixed(2),
            o3: Math.max(0, baseO3 * multiplier).toFixed(2)
        };
    };

    // Función para renderizar el gráfico
    const renderChart = (scenariosToDisplay) => {
        if (predictionChart) {
            predictionChart.destroy();
        }

        const datasets = scenariosToDisplay.map((scenario, index) => {
            const prediction = calculatePrediction(scenario, predictionModelSelect.value);
            return {
                label: scenario.name,
                data: [prediction.pm25, prediction.no2, prediction.o3],
                backgroundColor: chartColors[index % chartColors.length],
                borderColor: chartColors[index % chartColors.length].replace('0.6', '1'),
                borderWidth: 1
            };
        });

        const ctx = chartCanvas.getContext('2d');
        predictionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['PM2.5 (µg/m³)', 'NO₂ (µg/m³)', 'O₃ (µg/m³)'],
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Predicción de Calidad del Aire - Modelo: ${predictionModelSelect.options[predictionModelSelect.selectedIndex].text}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nivel de Contaminante'
                        }
                    }
                }
            }
        });
    };

    // Función para renderizar los controles de ajuste en tiempo real
    const renderRealTimeControls = (scenariosToDisplay) => {
        realTimeControlsContainer.innerHTML = '';
        scenariosToDisplay.forEach((scenario, index) => {
            const controlGroup = `
                <div class="scenario-control-group" style="border-left: 5px solid ${chartColors[index % chartColors.length]};">
                    <h6 class="mb-3">${scenario.name}</h6>
                    <div class="mb-2">
                        <label for="cars-${scenario.id}" class="form-label">Vehículos: <span id="cars-val-${scenario.id}">${scenario.cars}</span>%</label>
                        <input type="range" class="form-range" id="cars-${scenario.id}" data-id="${scenario.id}" data-param="cars" min="0" max="100" value="${scenario.cars}">
                    </div>
                    <div class="mb-2">
                        <label for="industry-${scenario.id}" class="form-label">Industria: <span id="industry-val-${scenario.id}">${scenario.industry}</span>%</label>
                        <input type="range" class="form-range" id="industry-${scenario.id}" data-id="${scenario.id}" data-param="industry" min="0" max="100" value="${scenario.industry}">
                    </div>
                    <div>
                        <label for="green-${scenario.id}" class="form-label">Áreas Verdes: <span id="green-val-${scenario.id}">${scenario.greenAreas}</span>%</label>
                        <input type="range" class="form-range" id="green-${scenario.id}" data-id="${scenario.id}" data-param="greenAreas" min="0" max="100" value="${scenario.greenAreas}">
                    </div>
                </div>
            `;
            realTimeControlsContainer.innerHTML += controlGroup;
        });
    };
    
    // Función para actualizar el gráfico y los controles
    const updatePrediction = () => {
        renderChart(currentlyDisplayedScenarios);
    };

    // Event listener para el botón de generar predicción
    generateBtn.addEventListener('click', () => {
        const selectedIds = Array.from(scenariosSelectionList.querySelectorAll('input:checked')).map(cb => cb.value);

        if (selectedIds.length === 0) {
            alert('Por favor, selecciona al menos un escenario para comparar.');
            return;
        }

        currentlyDisplayedScenarios = scenarios.filter(s => selectedIds.includes(s.id.toString()));
        resultsArea.classList.remove('d-none');
        
        renderChart(currentlyDisplayedScenarios);
        renderRealTimeControls(currentlyDisplayedScenarios);
    });
    
    // Cambiar modelo de predicción también actualiza el gráfico si ya está visible
    predictionModelSelect.addEventListener('change', () => {
        if (!resultsArea.classList.contains('d-none')) {
            updatePrediction();
        }
    });

    // Event listener para los controles en tiempo real (delegación)
    realTimeControlsContainer.addEventListener('input', (e) => {
        if (e.target.type === 'range') {
            const scenarioId = e.target.dataset.id;
            const param = e.target.dataset.param;
            const value = parseInt(e.target.value);

            // Actualizar el valor en el span
            document.getElementById(`${param.slice(0, -1)}-val-${scenarioId}`).textContent = `${value}%`;

            // Actualizar el valor en nuestro array de escenarios en memoria
            const scenarioToUpdate = currentlyDisplayedScenarios.find(s => s.id == scenarioId);
            if (scenarioToUpdate) {
                scenarioToUpdate[param] = value;
            }
            
            // Re-renderizar el gráfico
            updatePrediction();
        }
    });

    // Carga inicial de escenarios
    loadScenariosForSelection();
});