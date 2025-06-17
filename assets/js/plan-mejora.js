// assets/js/plan-mejora.js
document.addEventListener('DOMContentLoaded', function () {
    // Asegurarse de que el código solo se ejecute si los elementos existen en la página
    const goalsForm = document.getElementById('goals-form');
    if (!goalsForm) return; // Si no estamos en index.html, no hacer nada.

    const resultsContainer = document.getElementById('plan-results-container');
    const welcomeMessage = document.getElementById('plan-welcome-message');
    const recommendationsList = document.getElementById('plan-recommendations-list');
    const chartCanvas = document.getElementById('plan-comparison-chart');
    let comparisonChart = null;

    // Datos simulados de la "Situación Actual" para cada ciudad
    const currentAirQuality = {
        'Santiago': { pm25: 28, no2: 25, o3: 45 },
        'Valparaíso': { pm25: 22, no2: 18, o3: 55 },
        'Concepción': { pm25: 19, no2: 15, o3: 40 }
    };

    goalsForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const location = document.getElementById('plan-location-select').value;
        const goalPM25 = parseFloat(document.getElementById('goal-pm25').value);
        const goalNO2 = parseFloat(document.getElementById('goal-no2').value);
        const goalO3 = parseFloat(document.getElementById('goal-o3').value);


        if (isNaN(goalPM25) || isNaN(goalNO2) || isNaN(goalO3)) {
            alert('Por favor, ingresa metas numéricas válidas para todos los contaminantes.');
            return;
        }

        const currentData = currentAirQuality[location];
        
        welcomeMessage.classList.add('d-none');
        resultsContainer.classList.remove('d-none');

        renderChart(currentData, { pm25: goalPM25, no2: goalNO2, o3: goalO3 });
        generateRecommendations(currentData, { pm25: goalPM25, no2: goalNO2, o3: goalO3 });
    });

    function renderChart(current, desired) {
        if (comparisonChart) {
            comparisonChart.destroy();
        }

        const ctx = chartCanvas.getContext('2d');
        comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['PM2.5 (µg/m³)', 'NO₂ (ppb)', 'O₃ (ppb)'],
                datasets: [
                    {
                        label: 'Situación Actual',
                        data: [current.pm25, current.no2, current.o3],
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Situación Deseada (Tu Meta)',
                        data: [desired.pm25, desired.no2, desired.o3],
                        backgroundColor: 'rgba(75, 192, 192, 0.7)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Comparación: Niveles Actuales vs. Metas', font: { size: 16 } },
                    legend: { position: 'top' }
                },
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Valor del Contaminante' } } }
            }
        });
    }
    
    function generateRecommendations(current, desired) {
        recommendationsList.innerHTML = '';
        const diffs = {
            pm25: current.pm25 - desired.pm25,
            no2: current.no2 - desired.no2,
            o3: current.o3 - desired.o3,
        };

        const createRecommendationItem = (text) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerHTML = text;
            recommendationsList.appendChild(li);
        };

        // Recomendación para PM2.5
        if (diffs.pm25 > 0) {
            createRecommendationItem(`Para <strong>PM2.5</strong>, necesitas una <strong>reducción de ${diffs.pm25.toFixed(1)} µg/m³</strong>. Considera simular una menor actividad industrial o de tráfico.`);
        } else {
            createRecommendationItem(`✅ ¡Felicidades! Tu meta de <strong>PM2.5</strong> ya se cumple o es mejor que la situación actual.`);
        }
        
        // Recomendación para NO₂
        if (diffs.no2 > 0) {
            createRecommendationItem(`Para <strong>NO₂</strong>, necesitas una <strong>reducción de ${diffs.no2.toFixed(1)} ppb</strong>. El tráfico vehicular es el principal contribuyente.`);
        } else {
            createRecommendationItem(`✅ ¡Felicidades! Tu meta de <strong>NO₂</strong> ya se cumple o es mejor que la situación actual.`);
        }

        // Recomendación para O₃
        if (diffs.o3 > 0) {
             createRecommendationItem(`Para <strong>Ozono (O₃)</strong>, necesitas una <strong>reducción de ${diffs.o3.toFixed(1)} ppb</strong>. Se forma por reacciones químicas con la luz solar; reducir NO₂ suele ayudar.`);
        } else {
             createRecommendationItem(`✅ ¡Felicidades! Tu meta de <strong>Ozono (O₃)</strong> ya se cumple o es mejor que la situación actual.`);
        }
    }
});