document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('threshold-form');
    const notifToggle = document.getElementById('notifToggle');
    const status = document.getElementById('notification-status');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const pollutant = document.getElementById('pollutant').value;
      const threshold = document.getElementById('threshold').value;
  
      if (threshold && threshold > 0) {
        alert(`Umbral guardado para ${pollutant}: ${threshold}`);
        form.reset();
      } else {
        alert('Por favor, ingresa un valor válido para el umbral.');
      }
    });
  
    notifToggle.addEventListener('change', () => {
      if (notifToggle.checked) {
        status.textContent = "Las notificaciones están activas. Recibirás alertas cuando se superen tus umbrales configurados.";
        status.classList.remove("alert-warning");
        status.classList.add("alert-info");
      } else {
        status.textContent = "Las notificaciones están desactivadas. No recibirás alertas.";
        status.classList.remove("alert-info");
        status.classList.add("alert-warning");
      }
    });
  });
  