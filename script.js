let carrito = [];

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    mostrarCarrito();
}

function mostrarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const total = document.getElementById("total");

    lista.innerHTML = "";
    let suma = 0;

    carrito.forEach((producto, indice) => {
        suma += producto.precio;

        lista.innerHTML += `
            <li>
                ${producto.nombre} - S/ ${producto.precio.toFixed(2)}
                <button onclick="eliminarProducto(${indice})">Eliminar</button>
            </li>
        `;
    });

    total.textContent = suma.toFixed(2);
}

function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}