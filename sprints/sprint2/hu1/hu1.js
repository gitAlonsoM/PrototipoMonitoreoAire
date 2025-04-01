/* sprints\sprint2\hu1\hu1.js */
/* hu1.js */
/* hu1.js */
/* hu1.js */

// Datos simulados para contaminantes
/* hu1.js */

// Lista de contaminantes
const contaminants = [
    { name: "PM2.5", unit: "µg/m³" },
    { name: "PM10",  unit: "µg/m³" },
    { name: "O₃",    unit: "ppb"   },
    { name: "NO₂",   unit: "ppb"   },
    { name: "SO₂",   unit: "ppb"   },
    { name: "CO",    unit: "ppm"   }
  ];
  
  // Función para generar valor aleatorio
  function randomValue(contaminant) {
    switch (contaminant.name) {
      case "PM2.5": return Math.floor(Math.random() * 50);
      case "PM10":  return Math.floor(Math.random() * 70);
      case "O₃":    return Math.floor(Math.random() * 40);
      case "NO₂":   return Math.floor(Math.random() * 30);
      case "SO₂":   return Math.floor(Math.random() * 20);
      case "CO":    return (Math.random() * 2).toFixed(2);
      default:      return 0;
    }
  }
  
  function updatePanel() {
    const hu1Panel = document.querySelector("#hu1-panel");
    if (!hu1Panel) return; // Evita errores si no existe el elemento
    let htmlContent = "";
    const currentTime = new Date().toLocaleTimeString();
  
    contaminants.forEach(cont => {
      const val = randomValue(cont);
      htmlContent += `<p>${cont.name}: ${val} ${cont.unit} (Últ. act. ${currentTime})</p>`;
    });
  
    hu1Panel.innerHTML = htmlContent;
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    // Carga inicial
    updatePanel();
  
    // Actualiza cada 2 segundos
    setInterval(updatePanel, 2000);
  
    // Filtros (placeholder)
    const filterForm = document.querySelector("#filter-form");
    if (filterForm) {
      filterForm.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Filtrando por ubicación... (Funcionalidad pendiente)");
      });
    }
  
    // Exportar a PDF (placeholder)
    const exportBtn = document.querySelector("#export-pdf");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        alert("Exportar a PDF (Funcionalidad pendiente)");
      });
    }
  });
  