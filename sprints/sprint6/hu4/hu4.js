document.getElementById("projection-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const emisiones = parseFloat(document.getElementById("emisiones").value);
  const temperatura = parseFloat(document.getElementById("temperatura").value);
  const humedad = parseFloat(document.getElementById("humedad").value);
  const periodo = parseInt(document.getElementById("periodo").value);

  // Simulación de valores proyectados
  const labels = [];
  const data = [];
  for (let i = 0; i < periodo; i++) {
    labels.push(`Semana ${i + 1}`);
    const valor =
      emisiones * 0.6 +
      temperatura * 0.3 -
      humedad * 0.2 +
      Math.random() * 5;
    data.push(Math.round(valor * 100) / 100);
  }

  // Mostrar sección de resultados
  document.getElementById("projection-result").classList.remove("d-none");

  // Crear gráfico de líneas
  const ctx = document.getElementById("chartProjection").getContext("2d");
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }
  window.chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Índice proyectado de calidad del aire (AQI)",
          data: data,
          borderColor: "rgba(40, 116, 166, 1)",
          backgroundColor: "rgba(40, 116, 166, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#fff",
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#000",
            font: {
              size: 14,
              weight: "bold"
            }
          }
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "#e3f2fd",
          titleColor: "#0d47a1",
          bodyColor: "#0d47a1"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "AQI estimado",
            color: "#000",
            font: {
              size: 13
            }
          }
        },
        x: {
          title: {
            display: true,
            text: "Tiempo (semanas)",
            color: "#000",
            font: {
              size: 13
            }
          }
        }
      }
    }
  });

  // Mostrar explicación
  const explicacion = `
    <strong>Modelo utilizado:</strong> Simulación basada en regresión lineal simple.<br>
    <strong>Variables clave:</strong> emisiones, temperatura, humedad.<br>
    <strong>Margen de error estimado:</strong> ±10%.<br>
    <strong>Interpretación:</strong> Valores altos del índice indican peor calidad del aire.`;
  document.getElementById("explanation").innerHTML = explicacion;
});

// Botones de exportación
document.getElementById("btnExportPDF").addEventListener("click", () => {
  alert("Funcionalidad de exportación a PDF aún no implementada.");
});

document.getElementById("btnExportExcel").addEventListener("click", () => {
  alert("Funcionalidad de exportación a Excel aún no implementada.");
});
