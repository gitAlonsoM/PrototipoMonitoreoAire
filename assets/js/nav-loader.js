// assets/js/nav-loader.js (VERSIÓN DEFINITIVA)
document.addEventListener("DOMContentLoaded", function() {
    const navLoaderScript = document.querySelector('script[src*="nav-loader.js"]');
    if (!navLoaderScript) {
        console.error("No se pudo encontrar el script nav-loader.js para determinar la ruta raíz.");
        return;
    }
    const pathToRoot = navLoaderScript.dataset.pathToRoot || './';

    fetch(pathToRoot + 'nav.html')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.text();
        })
        .then(data => {
            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            if (navbarPlaceholder) {
                navbarPlaceholder.innerHTML = data;
                updateNavLinks(pathToRoot);
                setActiveLink();
                activateTabFromHash(); // Nueva función para activar pestañas
            }
        })
        .catch(error => console.error('Error al cargar la barra de navegación:', error));
});

function updateNavLinks(pathToRoot) {
    const links = document.querySelectorAll('#navbar-placeholder a');
    links.forEach(link => {
        const rootPath = link.dataset.linkRoot;
        const relativePath = link.getAttribute('href');

        if (rootPath) {
            link.href = pathToRoot + rootPath;
        } else if (relativePath && relativePath !== '#') {
            const [path, hash] = relativePath.split('#');
            let finalPath = pathToRoot + path;
            if (hash) {
                finalPath += '#' + hash;
            }
            link.href = finalPath;
        }
    });
}

function setActiveLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const navLinks = document.querySelectorAll('#navbar-placeholder a.nav-link, #navbar-placeholder a.dropdown-item');

    let bestMatch = null;

    navLinks.forEach(link => {
        // Ignoramos los toggles de dropdown
        if (link.classList.contains('dropdown-toggle')) return;

        const linkUrl = new URL(link.href);
        const linkPath = linkUrl.pathname;
        const linkHash = linkUrl.hash;

        // Comparamos si la ruta y el ancla coinciden
        if (currentPath.endsWith(linkPath) && currentHash === linkHash) {
            bestMatch = link;
        }
    });

    // Caso especial para la página raíz sin ancla
    if (!bestMatch && (currentPath.endsWith('index.html') || currentPath.endsWith('/')) && !currentHash) {
         bestMatch = document.querySelector('a[data-link-root="index.html"]');
    }
    
    if (bestMatch) {
        bestMatch.classList.add('active');
        const parentDropdown = bestMatch.closest('.dropdown');
        if (parentDropdown) {
            parentDropdown.querySelector('.dropdown-toggle').classList.add('active');
        }
        // Actualizar el título de la página
        const hu = bestMatch.dataset.hu;
        if (hu) {
            // Extraemos solo el texto del título, sin el span
            const titleText = bestMatch.childNodes[0].nodeValue.trim();
            document.title = `${titleText} (HU-${hu})`;
        }
    }
}

function activateTabFromHash() {
    const hash = window.location.hash; // e.g., "#hu3"
    if (hash) {
        // Buscamos un botón de tab que apunte a este hash
        const tabButton = document.querySelector(`button[data-bs-target="${hash}"]`);
        if (tabButton && typeof bootstrap !== 'undefined') {
            const tab = new bootstrap.Tab(tabButton);
            tab.show();
        }
    }
}