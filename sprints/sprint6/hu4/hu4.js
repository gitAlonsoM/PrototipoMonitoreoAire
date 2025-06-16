// sprints/sprint6/hu4/hu4.js
// hu4.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("projection-form");
  const chartCanvas = document.getElementById("projection-chart").getContext("2d");
  const explanation = document.getElementById("projection-explanation");
  let chartInstance;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Valores de entrada simulados
    const emissions = parseFloat(document.getElementById("emissions").value);
    const temperature = parseFloat(document.getElementById("temperature").value);
    const humidity = parseFloat(document.getElementById("humidity").value);
    const model = document.getElementById("model").value;
    const period = document.getElementById("period").value;

    // Generar datos ficticios para la proyección
    const labels = generateDateLabels(period);
    const data = labels.map((_, i) =>
      simulateAQI(emissions, temperature, humidity, i)
    );

    // Mostrar proyección con Chart.js
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Proyección AQI",
          data: data,
          borderColor: "#0d6efd",
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'AQI' }
          },
          x: {
            title: { display: true, text: 'Fecha' }
          }
        }
      }
    });

    // Explicación simulada
    explanation.classList.remove("d-none");
    explanation.innerHTML = `
      <strong>Modelo:</strong> ${model}<br>
      <strong>Variables clave:</strong> Emisiones = ${emissions}, Temp = ${temperature}°C, Humedad = ${humidity}%<br>
      <strong>Margen de error estimado:</strong> ±12 AQI
    `;
  });

  function generateDateLabels(period) {
    const labels = [];
    const today = new Date();
    const steps = period === "1w" ? 7 : period === "1y" ? 12 : 36;

    for (let i = 0; i < steps; i++) {
      const future = new Date(today);
      if (period === "1w") future.setDate(today.getDate() + i);
      else future.setMonth(today.getMonth() + i);
      labels.push(future.toISOString().slice(0, 10));
    }

    return labels;
  }

  function simulateAQI(emissions, temp, hum, index) {
    const base = 50 + emissions * 3 + temp * 0.5 - hum * 0.2;
    const variation = Math.sin(index / 2) * 10;
    return Math.round(base + variation);
  }
});
