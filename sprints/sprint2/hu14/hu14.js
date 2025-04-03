const ctx = document.getElementById('graficoCalidadAire').getContext('2d');

let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Niveles de Contaminación',
            data: [],
            borderColor: 'red',
            borderWidth: 2
        }]
    }
});

// Simulando datos aleatorios
function obtenerDatosSimulados(fechaInicio, fechaFin, contaminante) {
    let datos = [];
    let fechas = [];
    let fechaActual = new Date(fechaInicio);
    let fechaLimite = new Date(fechaFin);

    while (fechaActual <= fechaLimite) {
        fechas.push(fechaActual.toISOString().split('T')[0]);
        datos.push(Math.random() * 100);
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return { fechas, datos };
}

function actualizarGrafico() {
    let fechaInicio = document.getElementById('fechaInicio').value;
    let fechaFin = document.getElementById('fechaFin').value;
    let contaminante = document.getElementById('contaminante').value;

    if (!fechaInicio || !fechaFin) {
        alert("Selecciona un rango de fechas válido.");
        return;
    }

    let { fechas, datos } = obtenerDatosSimulados(fechaInicio, fechaFin, contaminante);

    chart.data.labels = fechas;
    chart.data.datasets[0].data = datos;
    chart.data.datasets[0].label = `Niveles de ${contaminante.toUpperCase()}`;
    chart.update();
}

function descargarCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Fecha,Nivel de Contaminación\n";
    
    chart.data.labels.forEach((fecha, index) => {
        csvContent += `${fecha},${chart.data.datasets[0].data[index]}\n`;
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historial_calidad_aire.csv");
    document.body.appendChild(link);
    link.click();
}
