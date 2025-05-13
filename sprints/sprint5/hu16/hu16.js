/* sprints\sprint5\hu16\hu16.js */

// sprints/sprint5/hu16/hu16.js
document.addEventListener("DOMContentLoaded", () => {
  // Función genérica para manejar "Me gusta"
  document.body.addEventListener("click", e => {
    if (e.target.closest(".like-btn")) {
      const btn = e.target.closest(".like-btn");
      const count = btn.querySelector("span");
      count.textContent = parseInt(count.textContent) + 1;
    }
  });

  // Publicar nueva sugerencia
  document.getElementById("form-sugerencia").addEventListener("submit", e => {
    e.preventDefault();
    const text = document.getElementById("input-sugerencia").value.trim();
    if (!text) return;
    addCard("feed-sugerencias", "success", text);
    document.getElementById("input-sugerencia").value = "";
  });

  // Publicar nuevo reporte
  document.getElementById("form-reporte").addEventListener("submit", e => {
    e.preventDefault();
    const cat = document.getElementById("categoria-reporte").value;
    const text = document.getElementById("input-reporte").value.trim();
    if (!cat || !text) return;
    addCard("feed-reportes", "warning", text, cat);
    document.getElementById("categoria-reporte").selectedIndex = 0;
    document.getElementById("input-reporte").value = "";
  });

  // Publicar nueva entrada de comunidad
  document.getElementById("form-comunidad").addEventListener("submit", e => {
    e.preventDefault();
    const text = document.getElementById("input-comunidad").value.trim();
    if (!text) return;
    addCard("feed-comunidad", "info", text);
    document.getElementById("input-comunidad").value = "";
  });

  // Función para añadir una tarjeta al feed correspondiente
  function addCard(feedId, type, text, category) {
    const feed = document.getElementById(feedId);
    const card = document.createElement("div");
    card.className = `card mb-3 border-${type}`;
    if (feedId === "feed-comunidad") card.classList.add("bg-light");
    let inner = `<div class="card-body">
      <h6 class="card-subtitle mb-1 text-muted">Tú – ${new Date().toLocaleDateString("es-CL")}</h6>`;
    if (category) {
      inner += `<span class="badge bg-${type} mb-2">${category}</span>`;
    }
    inner += `<p>${text}</p>
      <button class="btn btn-outline-primary btn-sm like-btn">👍 <span>0</span></button>
    </div>`;
    card.innerHTML = inner;
    feed.prepend(card);
  }
});
