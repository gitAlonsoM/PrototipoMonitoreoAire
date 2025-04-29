// Contaminantes simulados
const contaminants = [
    { name: "PM2.5", unit: "µg/m³", threshold: 40 },
    { name: "PM10", unit: "µg/m³", threshold: 60 },
    { name: "O₃", unit: "ppb", threshold: 30 },
    { name: "NO₂", unit: "ppb", threshold: 25 },
    { name: "SO₂", unit: "ppb", threshold: 15 },
    { name: "CO", unit: "ppm", threshold: 1.5 }
  ];
  
  // Recomendaciones por contaminante
  const recomendaciones = {
    "PM2.5": "Limitar actividades al aire libre y emitir comunicados de advertencia.",
    "PM10": "Reforzar patrullajes de control de polvo y quema ilegal.",
    "O₃": "Evitar uso de vehículos contaminantes en horarios de alta radiación.",
    "NO₂": "Restringir emisiones industriales temporalmente.",
    "SO₂": "Monitorear zonas cercanas a fuentes industriales.",
    "CO": "Ventilar espacios cerrados y monitorear zonas con alto tráfico vehicular."
  };
  
  // Función para generar valor aleatorio
  function generarValor(contaminante) {
    switch (contaminante.name) {
      case "PM2.5": return Math.floor(Math.random() * 70);
      case "PM10": return Math.floor(Math.random() * 100);
      case "O₃": return Math.floor(Math.random() * 50);
      case "NO₂": return Math.floor(Math.random() * 40);
      case "SO₂": return Math.floor(Math.random() * 30);
      case "CO": return (Math.random() * 3).toFixed(2);
      default: return 0;
    }
  }
  
  // Función para actualizar los indicadores
  function actualizarIndicadores() {
    const indicadores = document.getElementById('indicadores');
    const alertasContainer = document.getElementById('alertas');
  
    indicadores.innerHTML = "";
    alertasContainer.innerHTML = "";
  
    contaminants.forEach(cont => {
      const valor = generarValor(cont);
      const esCritico = parseFloat(valor) >= cont.threshold;
  
      // Crear tarjeta de contaminante
      const card = document.createElement('div');
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card ${esCritico ? 'border-danger' : ''}">
          <div class="card-body">
            <h5 class="card-title">${cont.name}</h5>
            <p class="card-text">Valor actual: <strong>${valor} ${cont.unit}</strong></p>
            <p class="card-text">Umbral crítico: ${cont.threshold} ${cont.unit}</p>
          </div>
        </div>
      `;
      indicadores.appendChild(card);
  
      // Si pasa el umbral, lanzar alerta
      if (esCritico) {
        const alerta = document.createElement('div');
        alerta.className = "alert alert-danger";
        alerta.innerHTML = `
          <h5>🚨 Alerta Crítica</h5>
          <p><strong>${cont.name}</strong> ha alcanzado un nivel crítico de <strong>${valor} ${cont.unit}</strong>.</p>
          <p><em>Recomendación: ${recomendaciones[cont.name]}</em></p>
          <p><small>Notificación enviada a las autoridades por correo y SMS.</small></p>
        `;
        alertasContainer.appendChild(alerta);
  
        // Simular envío a autoridades
        console.warn(`📧 Correo enviado para ${cont.name}`);
        console.warn(`📱 SMS enviado para ${cont.name}`);
      }
    });
  }
  
  // Actualizar cada 5 segundos
  document.addEventListener('DOMContentLoaded', function() {
    actualizarIndicadores();
    setInterval(actualizarIndicadores, 5000);
  });
  