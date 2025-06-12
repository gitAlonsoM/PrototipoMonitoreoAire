let chart;

function generarProyeccion() {
  const periodo = parseInt(document.getElementById("periodo").value);
  const zona = document.getElementById("zona").value;
  const politica = document.getElementById("politica").value;

  const labels = Array.from({ length: periodo }, (_, i) => `Año ${i + 1}`);
  const datos = labels.map((_, i) => simularDato(i + 1, politica));

  mostrarGrafico(labels, datos, zona);
  verificarDeterioro(datos);
}

function simularDato(anio, politica) {
  let base = 100 - anio * 5; // Mejora leve
  if (politica === "zonas_verdes") base -= anio * 3;
  if (politica === "transporte") base -= anio * 4;
  if (politica === "sin_politica") base += anio * 2;
  return Math.max(base, 10 + Math.random() * 10); // No menos de 10
}

function mostrarGrafico(labels, datos, zona) {
  const ctx = document.getElementById("graficoProyeccion").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Proyección AQI en zona: ${zona}`,
        data: datos,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Índice de Calidad del Aire (AQI)' } }
      }
    }
  });
}

function verificarDeterioro(datos) {
  const alertaDiv = document.getElementById("alertaProyeccion");
  alertaDiv.innerHTML = "";

  const valorFinal = datos[datos.length - 1];
  if (valorFinal > 100) {
    alertaDiv.innerHTML = `
      <div class="alert alert-danger">
        <strong>¡Alerta!</strong> La proyección indica un deterioro significativo en la calidad del aire (${valorFinal.toFixed(1)} AQI).
        Se recomienda revisar las políticas aplicadas.
      </div>
    `;
  }
}

function descargarExcel() {
  if (!chart) return alert("Primero genera una proyección.");
  const labels = chart.data.labels;
  const datos = chart.data.datasets[0].data;

  let contenido = "data:text/csv;charset=utf-8,Año,AQI\n";
  labels.forEach((año, i) => {
    contenido += `${año},${datos[i]}\n`;
  });

  const uri = encodeURI(contenido);
  const link = document.createElement("a");
  link.setAttribute("href", uri);
  link.setAttribute("download", "proyeccion_calidad_aire.csv");
  document.body.appendChild(link);
  link.click();
}
