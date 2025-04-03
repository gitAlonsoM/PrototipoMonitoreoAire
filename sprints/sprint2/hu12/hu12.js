// hu12.js
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("risk-test");
    const result = document.getElementById("test-result");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const location = document.getElementById("location").value.trim();
      const healthCondition = document.getElementById("health").value;
  
      if (location === "") {
        result.textContent = "Por favor, ingrese su ubicación.";
        result.style.color = "red";
        return;
      }
  
      let riskMessage = "Nivel de riesgo: Bajo. ";
      if (healthCondition === "Asma" || healthCondition === "Enfermedad pulmonar crónica") {
        riskMessage = "Nivel de riesgo: Alto. Evite la exposición prolongada al aire contaminado.";
      }
  
      result.textContent = `Ubicación: ${location}. ${riskMessage}`;
      result.style.color = healthCondition === "none" ? "green" : "red";
    });
  });
  