function generarReporte() {
    const fechaInicio = new Date(document.getElementById("fechaInicio").value);
    const fechaFin = new Date(document.getElementById("fechaFin").value);
    const ubicacion = document.getElementById("ubicacion").value;
    const tbody = document.querySelector("#tablaReporte tbody");

    if (!fechaInicio || !fechaFin || fechaFin < fechaInicio) {
        alert("Selecciona un rango de fechas válido.");
        return;
    }

    tbody.innerHTML = ""; // Limpiar tabla

    const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
    const current = new Date(fechaInicio);

    for (let i = 0; i < dias; i++) {
        const fechaStr = current.toISOString().split("T")[0];
        const row = `
            <tr>
                <td>${fechaStr}</td>
                <td>${ubicacion}</td>
                <td>${(Math.random() * 100).toFixed(2)}</td>
                <td>${(Math.random() * 100).toFixed(2)}</td>
                <td>${(Math.random() * 50).toFixed(2)}</td>
                <td>${(Math.random() * 60).toFixed(2)}</td>
            </tr>`;
        tbody.innerHTML += row;
        current.setDate(current.getDate() + 1);
    }
}

function descargarExcel() {
    const tabla = document.getElementById("tablaReporte");
    const wb = XLSX.utils.table_to_book(tabla, { sheet: "Reporte Calidad del Aire" });
    XLSX.writeFile(wb, "reporte_calidad_aire.xlsx");
}
