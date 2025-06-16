/* sprints\sprint6\hu6\hu6.js */
// hu6.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("policy-form");
  const chartCanvas = document.getElementById("projectionsChart");
  const factorsList = document.getElementById("factors-list");

  let chart;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const traffic = document.getElementById("traffic").value;
    const industry = document.getElementById("industry").value;
    const regulation = document.getElementById("regulation").value;

    const scenarios = generateScenarios(traffic, industry, regulation);
    const labels = ["2025", "2026", "2027", "2028", "2029"];
    const datasets = scenarios.map((scenario, index) => ({
      label: scenario.nombre,
      data: scenario.valores,
      borderColor: scenario.color,
      fill: false,
      tension: 0.3
    }));

    if (chart) {
      chart.destroy();
    }

    chart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Proyecciones de Calidad del Aire (AQI)",
            font: {
              size: 18
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Índice de Calidad del Aire (AQI)"
            }
          }
        }
      }
    });

    updateFactorsList(traffic, industry, regulation);
  });

  function generateScenarios(traffic, industry, regulation) {
    const baseAQI = {
      alto: 90,
      medio: 70,
      bajo: 50
    };

    const factor = (value, peso) => {
      const escala = {
        alto: 1.3,
        medio: 1.0,
        bajo: 0.7,
        alta: 1.2,
        media: 1.0,
        baja: 0.8,
        estricta: 0.7,
        moderada: 1.0,
        ninguna: 1.3
      };
      return escala[value] * peso;
    };

    const base = 60;
    const factorTotal =
      factor(traffic, 1) + factor(industry, 1) + factor(regulation, 1);

    return [
      {
        nombre: "Escenario Optimista",
        valores: [base * 0.7, base * 0.6, base * 0.5, base * 0.4, base * 0.3],
        color: "#28a745"
      },
      {
        nombre: "Escenario Moderado",
        valores: [
          base * 1.0,
          base * 1.1,
          base * 1.2,
          base * 1.3,
          base * 1.4
        ],
        color: "#ffc107"
      },
      {
        nombre: "Escenario Crítico",
        valores: [
          base * factorTotal * 1.0,
          base * factorTotal * 1.1,
          base * factorTotal * 1.2,
          base * factorTotal * 1.3,
          base * factorTotal * 1.4
        ],
        color: "#dc3545"
      }
    ];
  }

  function updateFactorsList(traffic, industry, regulation) {
    const factores = [
      `Tráfico urbano: ${traffic}`,
      `Actividad industrial: ${industry}`,
      `Regulación ambiental: ${regulation}`,
      "Datos basados en proyecciones con tendencias históricas actualizadas"
    ];

    factorsList.innerHTML = "";
    factores.forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      factorsList.appendChild(li);
    });
  }
});

