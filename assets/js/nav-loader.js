// assets/js/nav-loader.js (VERSIÓN FINAL CON AUTH)
document.addEventListener("DOMContentLoaded", function() {
    const navLoaderScript = document.querySelector('script[src*="nav-loader.js"]');
    if (!navLoaderScript) return console.error("Script nav-loader.js no encontrado.");
    
    const pathToRoot = navLoaderScript.dataset.pathToRoot || './';

    // Carga el HTML del menú y los modales
    fetch(pathToRoot + 'nav.html')
        .then(response => {
            if (!response.ok) throw new Error('Error de red al cargar nav.html');
            return response.text();
        })
        .then(data => {
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            if (navbarPlaceholder) {
                // Inyecta todo el HTML (nav + modals)
                navbarPlaceholder.innerHTML = data;
                
                // Llama a las funciones de inicialización en orden
                updateNavLinks(pathToRoot);
                initializeAuth(); // <-- NUEVA FUNCIÓN DE AUTH
                setActiveLink();
                activateTabFromHash();
            }
        })
        .catch(error => console.error('Error al cargar la barra de navegación:', error));
});


// --- FUNCIONES DE NAVEGACIÓN (SIN CAMBIOS) ---
function updateNavLinks(pathToRoot) {
    const links = document.querySelectorAll('#navbar-placeholder a');
    links.forEach(link => {
        const rootPath = link.dataset.linkRoot;
        const relativePath = link.getAttribute('href');
        if (rootPath) link.href = pathToRoot + rootPath;
        else if (relativePath && relativePath !== '#') {
            const [path, hash] = relativePath.split('#');
            link.href = pathToRoot + path + (hash ? '#' + hash : '');
        }
    });
}

function setActiveLink() {
    const currentPath = window.location.pathname, currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('#navbar-placeholder a.nav-link, #navbar-placeholder a.dropdown-item');
    let bestMatch = null;
    navLinks.forEach(link => {
        if (link.classList.contains('dropdown-toggle')) return;
        const linkUrl = new URL(link.href), linkPath = linkUrl.pathname, linkHash = linkUrl.hash;
        if (currentPath.endsWith(linkPath) && currentHash === linkHash) bestMatch = link;
    });
    if (!bestMatch && (currentPath.endsWith('index.html') || currentPath.endsWith('/')) && !currentHash) {
        bestMatch = document.querySelector('a[data-link-root="index.html"]');
    }
    if (bestMatch) {
        bestMatch.classList.add('active');
        const parentDropdown = bestMatch.closest('.dropdown');
        if (parentDropdown) parentDropdown.querySelector('.dropdown-toggle').classList.add('active');
        const hu = bestMatch.dataset.hu;
        if (hu) document.title = `${bestMatch.childNodes[0].nodeValue.trim()} (HU-${hu})`;
    }
}

function activateTabFromHash() {
    const hash = window.location.hash;
    if (hash) {
        const tabButton = document.querySelector(`button[data-bs-target="${hash}"]`);
        if (tabButton && typeof bootstrap !== 'undefined') new bootstrap.Tab(tabButton).show();
    }
}

// --- NUEVAS FUNCIONES DE AUTENTICACIÓN ---
function initializeAuth() {
    // Referencias a elementos del DOM de autenticación
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Asignar eventos a los formularios y botón de logout
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Comprobar el estado de la sesión al cargar la página
    checkLoginState();
}

function checkLoginState() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (user) {
        updateUIAfterLogin(user);
    } else {
        updateUIAfterLogout();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    // Como es un prototipo, creamos un usuario con el email y un nombre genérico
    const user = { name: 'Usuario Demo', email: email };
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    updateUIAfterLogin(user);
    // Ocultar el modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    // Creamos el usuario con los datos del formulario
    const user = { name: name, email: email };
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    updateUIAfterLogin(user);
    // Ocultar el modal
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    registerModal.hide();
}

function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem('currentUser');
    updateUIAfterLogout();
}

function updateUIAfterLogin(user) {
    document.getElementById('user-menu-logged-out').style.display = 'none';
    document.getElementById('user-menu-logged-in').style.display = 'flex';
    document.getElementById('username-display').textContent = user.name;
}

function updateUIAfterLogout() {
    document.getElementById('user-menu-logged-out').style.display = 'flex';
    document.getElementById('user-menu-logged-in').style.display = 'none';
}