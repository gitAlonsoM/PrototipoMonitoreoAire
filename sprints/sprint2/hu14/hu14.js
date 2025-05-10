// Variables globales para el gráfico HU-3
let chartHU3;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Documento cargado correctamente.");

  // Inicializar gráfico HU-3 (Informe Comparativo)
  try {
    const ctxHU3 = document.getElementById('chartHU3').getContext('2d');
    const ctxHU15 = document.getElementById('chartHU15').getContext('2d');
    chartHU3 = new Chart(ctxHU3, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } }
      }
    });
    chartHU15 = new Chart(ctxHU15, {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } }
      }
    });
    console.log("Gráfico HU-3 inicializado.");
  } catch (error) {
    console.error("Error al inicializar chartHU3:", error);
  }

  // Valores por defecto HU-3
  document.getElementById('fechaInicioHU3').value = "2025-04-01";
  document.getElementById('fechaFinHU3').value = "2025-05-01";
  let opcionesHU3 = document.getElementById('contaminantesHU3').options;
  opcionesHU3[0].selected = true; // PM2.5
  opcionesHU3[2].selected = true; // NO₂
  document.getElementById('fechaInicioHU15').value = "2025-04-01";
  document.getElementById('fechaFinHU15').value = "2025-05-01";
  let opcionesHU15 = document.getElementById('contaminantesHU15').options;
  opcionesHU3[0].selected = true; // PM2.5
  opcionesHU3[2].selected = true; // NO₂

  // Valores por defecto para región y comuna
  const region = document.getElementById('regionSelect').value;
  const comuna = document.getElementById('comunaSelect').value;
  console.log("Región:", region, "Comuna:", comuna);

  // Actualizar gráfico HU-3 al cargar
  actualizarChartHU3();
  actualizarChartHU15();

  // Asignar listener al botón "Actualizar" de HU-3
  document.getElementById('updateHU3').addEventListener("click", actualizarChartHU3);
  document.getElementById('updateHU15').addEventListener("click", actualizarChartHU15);

  // Botones decorativos HU-3 (exportación)
  document.getElementById('exportPDF').addEventListener("click", () => {
    alert("Simulación: Exportar a PDF");
  });
  document.getElementById('exportExcel').addEventListener("click", () => {
    alert("Simulación: Exportar a Excel");
  });
  document.getElementById('downloadCSV').addEventListener("click", () => {
    alert("Simulación: Descargar CSV");
  });

  // Para HU-14, los controles están activos, pero al pulsar "Actualizar" se simula una acción decorativa
  document.getElementById('updateHU14').addEventListener("click", () => {
    alert("HU-14: Este gráfico es fijo (imagen), los controles son decorativos.");
  });
  // Botones decorativos HU-14
  document.getElementById('exportPDF_HU14').addEventListener("click", () => {
    alert("Simulación: Exportar a PDF (HU-14)");
  });
  document.getElementById('exportExcel_HU14').addEventListener("click", () => {
    alert("Simulación: Exportar a Excel (HU-14)");
  });
  document.getElementById('downloadCSV_HU14').addEventListener("click", () => {
    alert("Simulación: Descargar CSV (HU-14)");
  });
});

// Función para simular datos aleatorios para HU-3
function generarDatosSimulados(fechaInicio, fechaFin) {
  let datos = [];
  let fechas = [];
  let start = new Date(fechaInicio);
  let end = new Date(fechaFin);
  while (start <= end) {
    fechas.push(start.toISOString().split('T')[0]);
    datos.push((Math.random() * 150).toFixed(2));
    start.setDate(start.getDate() + 1);
  }
  console.log("Datos simulados:", { fechas, datos });
  return { fechas, datos };
}

// Función para actualizar el gráfico HU-3 y generar el panel de estadísticas
function actualizarChartHU3() {
  const fechaInicio = document.getElementById('fechaInicioHU3').value;
  const fechaFin = document.getElementById('fechaFinHU3').value;
  const select = document.getElementById('contaminantesHU3');
  const contaminantes = Array.from(select.selectedOptions).map(opt => opt.value);
  
  console.log("Actualizar HU-3:");
  console.log("  Fecha inicio:", fechaInicio);
  console.log("  Fecha fin:", fechaFin);
  console.log("  Contaminantes seleccionados:", contaminantes);
  
  if (!fechaInicio || !fechaFin || contaminantes.length === 0) {
    alert("Selecciona un rango de fechas y al menos un contaminante.");
    return;
  }
  
  // Generar datos simulados
  const { fechas, datos } = generarDatosSimulados(fechaInicio, fechaFin);
  
  // Crear datasets para cada contaminante
  const newDatasets = contaminantes.map((cont, idx) => {
    const offset = idx * 10;
    const contData = datos.map(val => (parseFloat(val) + offset).toFixed(2));
    return {
      label: cont.toUpperCase(),
      data: contData,
      borderColor: getColor(idx),
      backgroundColor: getColor(idx, 0.2),
      fill: true,
      tension: 0.3
    };
  });
  
  chartHU3.data.labels = fechas;
  chartHU3.data.datasets = newDatasets;
  chartHU3.update();
  console.log("Gráfico HU-3 actualizado:", chartHU3.data);
  
  // Generar panel de estadísticas dinámico
  generarPanelEstadisticas(contaminantes, datos);
}

// Función para generar el panel de estadísticas para HU-3
function generarPanelEstadisticas(contaminantes, datosBase) {
  const container = document.getElementById('statsContainer');
  container.innerHTML = ""; // Limpiar contenido anterior
  
  // Para cada contaminante, usamos datos base (sin offset) para calcular estadísticas
  contaminantes.forEach((cont, idx) => {
    // Si deseas que se consideren los offset (valores del dataset), puedes extraerlos de chartHU3.data.datasets[idx].data
    let dataset = chartHU3.data.datasets[idx].data.map(Number);
    let promedio = (dataset.reduce((a, b) => a + b, 0) / dataset.length).toFixed(2);
    let minimo = Math.min(...dataset).toFixed(2);
    let maximo = Math.max(...dataset).toFixed(2);
    
    // Crear tarjeta de estadísticas para este contaminante
    const card = document.createElement('div');
    card.className = "col-md-4 stat-card";
    card.innerHTML = `
      <div class="card text-center">
        <div class="card-body">
          <h5 class="card-title">${cont.toUpperCase()}</h5>
          <p class="card-text">Promedio: ${promedio}</p>
          <p class="card-text">Mínimo: ${minimo}</p>
          <p class="card-text">Máximo: ${maximo}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Función para generar colores para Chart.js
function getColor(index, alpha = 1) {
  const colorPalette = [
    [255, 99, 132],
    [75, 192, 192],
    [255, 205, 86],
    [54, 162, 235],
    [153, 102, 255],
    [201, 203, 207]
  ];
  const [r, g, b] = colorPalette[index % colorPalette.length];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
