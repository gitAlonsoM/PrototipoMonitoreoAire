// sprints/sprint5/hu9/hu9.js
document.addEventListener('DOMContentLoaded', () => {
  const regiones = {
    "Región de Coquimbo (IV)": ["La Serena", "Coquimbo", "Ovalle", "Andacollo"],
    "Región de Valparaíso (V)": ["Valparaíso", "Viña del Mar", "San Antonio", "Quillota"],
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida"]
  };

  const regionA = document.getElementById('regionA');
  const regionB = document.getElementById('regionB');
  const ciudadA = document.getElementById('ciudadA');
  const ciudadB = document.getElementById('ciudadB');
  const btnComparar = document.getElementById('btnComparar');
  const loading = document.getElementById('loading');
  const resultados = document.getElementById('resultados');
  let chart;

  // Rellenar selects de región
  Object.keys(regiones).forEach(r => {
    [regionA, regionB].forEach(sel => {
      const opt = document.createElement('option');
      opt.value = r; opt.textContent = r;
      sel.appendChild(opt);
    });
  });

  // Función para rellenar ciudades según región
  function llenarCiudades(regSelect, citySelect) {
    citySelect.innerHTML = '<option value="">Selecciona ciudad</option>';
    const list = regiones[regSelect.value] || [];
    list.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      citySelect.appendChild(opt);
    });
  }

  regionA.addEventListener('change', () => llenarCiudades(regionA, ciudadA));
  regionB.addEventListener('change', () => llenarCiudades(regionB, ciudadB));

  btnComparar.addEventListener('click', () => {
    if (!ciudadA.value || !ciudadB.value) {
      return alert('Debes seleccionar ambas ciudades.');
    }
    resultados.style.display = 'none';
    loading.style.display = 'block';

    // Simula carga de datos
    setTimeout(() => {
      loading.style.display = 'none';
      mostrarResultados(ciudadA.value, ciudadB.value);
    }, 1200);
  });

  function mostrarResultados(ciudad1, ciudad2) {
    resultados.style.display = 'block';
    const contaminantes = ['PM2.5','PM10','NO₂','O₃','SO₂','CO'];
    const dataA = contaminantes.map(() => +(Math.random()*100).toFixed(1));
    const dataB = contaminantes.map(() => +(Math.random()*100).toFixed(1));

    // Gráfico
    const ctx = document.getElementById('chartComparativo').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: contaminantes,
        datasets: [
          { label: ciudad1, data: dataA, backgroundColor: 'rgba(54,162,235,0.6)' },
          { label: ciudad2, data: dataB, backgroundColor: 'rgba(255,99,132,0.6)' }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false }
      }
    });

    // Análisis de diferencias
    const ul = document.getElementById('analisisList');
    ul.innerHTML = '';
    contaminantes.forEach((cont, i) => {
      const diff = +(dataA[i] - dataB[i]).toFixed(1);
      let mayor, menor;
      if (diff > 0) {
        mayor = ciudad1;
        menor = ciudad2;
      } else {
        mayor = ciudad2;
        menor = ciudad1;
      }
      const li = document.createElement('li');
      li.textContent = `${cont}: ${mayor} tiene ${Math.abs(diff)} µg/m³ más que ${menor}`;
      ul.appendChild(li);
    });
  }

  // Exportar PDF
  document.getElementById('btnPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text('Comparación Calidad del Aire', 10, 10);
    pdf.text(`Ciudades: ${ciudadA.value} vs ${ciudadB.value}`, 10, 20);
    pdf.addImage(chart.toBase64Image(), 'PNG', 10, 30, 190, 80);
    pdf.save(`Comparacion_${ciudadA.value}_vs_${ciudadB.value}.pdf`);
  });
});
