document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("location-form");
    const geoBtn = document.getElementById("geoBtn");
    const airInfo = document.getElementById("air-info");
    const locationName = document.getElementById("location-name");
    const pollutantList = document.getElementById("pollutant-list");
    const aqiValue = document.getElementById("aqi-value");
    const recommendation = document.getElementById("recommendation");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const locationInput = document.getElementById("zipcode").value.trim();
      if (locationInput !== "") {
        fetchAirData(locationInput);
      }
    });
  
    geoBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          fetchAirData(null, latitude, longitude);
        });
      } else {
        alert("La geolocalización no está soportada por tu navegador.");
      }
    });
  
    function fetchAirData(location, lat = null, lon = null) {
      // Simulación de datos
      const mockData = {
        location: location || `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
        aqi: Math.floor(Math.random() * 400), // AQI entre 0 y 400
        pollutants: {
          PM25: (Math.random() * 150).toFixed(1),
          PM10: (Math.random() * 150).toFixed(1),
          O3: (Math.random() * 100).toFixed(1),
          NO2: (Math.random() * 80).toFixed(1),
          CO: (Math.random() * 10).toFixed(1)
        }
      };
  
      renderAirInfo(mockData);
    }
  
    function renderAirInfo(data) {
      locationName.textContent = data.location;
      aqiValue.textContent = data.aqi;
  
      // Mostrar lista de contaminantes
      pollutantList.innerHTML = "";
      for (const [key, value] of Object.entries(data.pollutants)) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${key}:</strong> ${value}`;
        pollutantList.appendChild(li);
      }
  
      // Recomendación y color según AQI
      const aqi = data.aqi;
      let msg = "";
      let color = "";
  
      if (aqi <= 50) {
        msg = "El aire es bueno. Puedes realizar actividades al aire libre con normalidad.";
        color = "#00e400";
      } else if (aqi <= 100) {
        msg = "Calidad del aire moderada. Personas sensibles deben tener precaución.";
        color = "#ffff00";
      } else if (aqi <= 150) {
        msg = "No saludable para grupos sensibles. Limita la exposición prolongada al aire libre.";
        color = "#ff7e00";
      } else if (aqi <= 200) {
        msg = "No saludable. Considera reducir actividades físicas al aire libre.";
        color = "#ff0000";
      } else if (aqi <= 300) {
        msg = "Muy no saludable. Evita salir si es posible.";
        color = "#8f3f97";
      } else {
        msg = "Peligroso. Permanece en interiores y sigue recomendaciones oficiales.";
        color = "#7e0023";
      }
  
      recommendation.textContent = msg;
      recommendation.classList.remove("alert-success", "alert-warning", "alert-danger");
      recommendation.style.backgroundColor = color;
      recommendation.style.color = aqi > 200 ? "white" : "black";
  
      airInfo.classList.remove("d-none");
    }
  });
  