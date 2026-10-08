let datosMenu = { menu: [] };

async function cargarMenu() {
    try {
        const respuesta = await fetch('menu-data.json');
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo");
        datosMenu = await respuesta.json();
        renderizarMenu();
    } catch (error) {
        console.warn("Usando datos por defecto:", error);
        datosMenu = {
            menu: [
                { id: 1, nombre: "Inicio", enlace: "/inicio", icono: "🏠", submenu: [] },
                { id: 2, nombre: "Contacto", enlace: "/contacto", icono: "✉️", submenu: [] }
            ]
        };
        renderizarMenu();
    }
}

function crearElemento(item) {
    const tieneSubmenu = item.submenu && item.submenu.length > 0;

    const li = document.createElement('li');
    li.className = 'menu-item';

    const enlace = document.createElement('a');
    enlace.className = 'menu-enlace';
    enlace.href = item.enlace;
    enlace.innerHTML = `${item.icono || ''} ${item.nombre}`;
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        manejarAccion(item);
    });

    li.appendChild(enlace);

    if (tieneSubmenu) {
        const ulSub = document.createElement('ul');
        ulSub.className = 'submenu';
        item.submenu.forEach(sub => ulSub.appendChild(crearElemento(sub)));
        li.appendChild(ulSub);
    }

    return li;
}

function renderizarMenu() {
    const contenedor = document.getElementById('contenedorMenu');
    contenedor.innerHTML = '';
    datosMenu.menu.forEach(item => contenedor.appendChild(crearElemento(item)));
}

function manejarAccion(item) {
    alert(`Seleccionaste: ${item.nombre}\nEnlace: ${item.enlace}`);
}

function idExiste(id) {
    return datosMenu.menu.some(item => item.id === id) ||
        datosMenu.menu.some(item => item.submenu?.some(sub => sub.id === id));
}

function enlaceValido(enlace) {
    return /^(\/[a-zA-Z0-9-_\/]*|https?:\/\/.+)$/.test(enlace);
}

function agregarOpcion(nombre, enlace, icono = '') {
    if (!enlaceValido(enlace)) {
        mostrarMensaje("El enlace no es válido. Usa /ruta o https://...", "error");
        return false;
    }

    let nuevoId = Date.now();
    while (idExiste(nuevoId)) nuevoId++;

    datosMenu.menu.push({
        id: nuevoId,
        nombre,
        enlace,
        icono,
        submenu: []
    });

    renderizarMenu();
    mostrarMensaje(`Opción "${nombre}" agregada con ID: ${nuevoId}`, "exito");
    return true;
}

function mostrarMensaje(texto, tipo) {
    const caja = document.getElementById('cajaMensaje');
    caja.textContent = texto;
    caja.className = `mensaje ${tipo}`;
    caja.style.display = 'block';
    setTimeout(() => caja.style.display = 'none', 4000);
}

document.getElementById('botonMenu').addEventListener('click', () => {
    document.getElementById('contenedorMenu').classList.toggle('activo');
});

document.getElementById('formAgregar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('campoNombre').value.trim();
    const enlace = document.getElementById('campoEnlace').value.trim();
    const icono = document.getElementById('campoIcono').value.trim();

    if (agregarOpcion(nombre, enlace, icono)) {
        e.target.reset();
    }
});

cargarMenu();