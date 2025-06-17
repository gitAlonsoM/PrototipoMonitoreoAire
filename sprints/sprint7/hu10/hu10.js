/* sprints\sprint7\hu10\hu10.js */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const form = document.getElementById('scenario-form');
    const formTitle = document.getElementById('form-title');
    const scenarioIdInput = document.getElementById('scenario-id');
    const scenarioNameInput = document.getElementById('scenario-name');
    const carsSlider = document.getElementById('cars-slider');
    const industrySlider = document.getElementById('industry-slider');
    const greenAreasSlider = document.getElementById('green-areas-slider');
    const carsValueSpan = document.getElementById('cars-value');
    const industryValueSpan = document.getElementById('industry-value');
    const greenAreasValueSpan = document.getElementById('green-areas-value');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
    const scenariosList = document.getElementById('scenarios-list');
    const noScenariosMessage = document.getElementById('no-scenarios-message');

    // Estado de la aplicación
    let scenarios = JSON.parse(localStorage.getItem('airQualityScenarios')) || [];

    // Función para renderizar los escenarios guardados
    const renderScenarios = () => {
        scenariosList.innerHTML = ''; // Limpiar la lista actual
        if (scenarios.length === 0) {
            noScenariosMessage.style.display = 'block';
        } else {
            noScenariosMessage.style.display = 'none';
            scenarios.forEach(scenario => {
                const scenarioCard = `
                    <div class="col-md-6">
                        <div class="card scenario-card shadow-sm">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <h5 class="card-title mb-3">${scenario.name}</h5>
                                    <div>
                                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${scenario.id}" title="Editar">
                                            <i class="fas fa-pencil-alt"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${scenario.id}" title="Eliminar">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="row text-center">
                                    <div class="col-4">
                                        <i class="fas fa-car icon"></i>
                                        <p class="mb-0 mt-2">Vehículos</p>
                                        <p class="value">${scenario.cars}%</p>
                                    </div>
                                    <div class="col-4">
                                        <i class="fas fa-industry icon"></i>
                                        <p class="mb-0 mt-2">Industria</p>
                                        <p class="value">${scenario.industry}%</p>
                                    </div>
                                    <div class="col-4">
                                        <i class="fas fa-leaf icon"></i>
                                        <p class="mb-0 mt-2">Áreas Verdes</p>
                                        <p class="value">${scenario.greenAreas}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                scenariosList.innerHTML += scenarioCard;
            });
        }
    };

    // Función para guardar escenarios en localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem('airQualityScenarios', JSON.stringify(scenarios));
    };

    // Función para limpiar el formulario y resetear al modo "Crear"
    const resetForm = () => {
        form.reset();
        scenarioIdInput.value = '';
        formTitle.textContent = 'Crear Nuevo Escenario';
        saveButton.innerHTML = '<i class="fas fa-save me-2"></i>Guardar Escenario';
        cancelButton.style.display = 'none';
        updateSliderValues();
    };

    // Actualizar los valores de los spans junto a los sliders
    const updateSliderValues = () => {
        carsValueSpan.textContent = `${carsSlider.value}%`;
        industryValueSpan.textContent = `${industrySlider.value}%`;
        greenAreasValueSpan.textContent = `${greenAreasSlider.value}%`;
    };

    // Event listeners para los sliders
    [carsSlider, industrySlider, greenAreasSlider].forEach(slider => {
        slider.addEventListener('input', updateSliderValues);
    });

    // Event listener para el envío del formulario (crear o actualizar)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = scenarioIdInput.value;
        const newScenario = {
            name: scenarioNameInput.value,
            cars: parseInt(carsSlider.value),
            industry: parseInt(industrySlider.value),
            greenAreas: parseInt(greenAreasSlider.value)
        };

        if (id) { // Actualizar escenario existente
            scenarios = scenarios.map(s => s.id == id ? { ...s, ...newScenario } : s);
        } else { // Crear nuevo escenario
            newScenario.id = Date.now();
            scenarios.push(newScenario);
        }

        saveToLocalStorage();
        renderScenarios();
        resetForm();
    });

    // Event listener para los botones de editar y eliminar (delegación de eventos)
    scenariosList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            if (confirm('¿Estás seguro de que quieres eliminar este escenario?')) {
                scenarios = scenarios.filter(s => s.id != id);
                saveToLocalStorage();
                renderScenarios();
            }
        }

        if (target.classList.contains('edit-btn')) {
            const scenarioToEdit = scenarios.find(s => s.id == id);
            if (scenarioToEdit) {
                formTitle.textContent = 'Editar Escenario';
                scenarioIdInput.value = scenarioToEdit.id;
                scenarioNameInput.value = scenarioToEdit.name;
                carsSlider.value = scenarioToEdit.cars;
                industrySlider.value = scenarioToEdit.industry;
                greenAreasSlider.value = scenarioToEdit.greenAreas;
                
                updateSliderValues();
                
                saveButton.innerHTML = '<i class="fas fa-check me-2"></i>Actualizar Escenario';
                cancelButton.style.display = 'block';
                window.scrollTo(0, 0); // Llevar al usuario al formulario
            }
        }
    });

    // Event listener para el botón de cancelar edición
    cancelButton.addEventListener('click', resetForm);

    // Renderizado inicial al cargar la página
    renderScenarios();
});