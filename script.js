

let carrito = [];

// Cargar productos desde MySQL
async function cargarProductos() {
    try {
        const respuesta = await fetch("/api/productos");

        if (!respuesta.ok) {
            throw new Error("Error al consultar productos");
        }

        const productos = await respuesta.json();
        const catalogo = document.getElementById("catalogo-productos");

        if (!catalogo) {
            console.error("No se encontró el catálogo");
            return;
        }

        catalogo.innerHTML = "";

        // Íconos de los productos
        const iconos = {
            "Laptop Lenovo": "💻",
            "Samsung Galaxy": "📱",
            "Smart TV LG": "📺",
            "Lavadora Samsung": "🧺"
        };

        productos.forEach(producto => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "producto";

            // Ícono
            const icono = document.createElement("div");
            icono.className = "producto-icono";
            icono.textContent = iconos[producto.nombre] || "🛍️";

            // Nombre
            const nombre = document.createElement("h3");
            nombre.textContent = producto.nombre;

            // Descripción
            const descripcion = document.createElement("p");
            descripcion.textContent = producto.descripcion || "";

            // Precio
            const precio = document.createElement("p");
            precio.className = "precio";
            precio.textContent =
                `S/ ${Number(producto.precio).toFixed(2)}`;

            // Stock
            const stock = document.createElement("p");
            stock.textContent = `Stock: ${producto.stock}`;

            // Botón del carrito
            const boton = document.createElement("button");
            boton.textContent = "Agregar al carrito";
            boton.disabled = Number(producto.stock) <= 0;

            boton.addEventListener("click", () => {
                agregarAlCarrito(
                    producto.nombre,
                    Number(producto.precio)
                );
            });

            tarjeta.append(
                icono,
                nombre,
                descripcion,
                precio,
                stock,
                boton
            );

            catalogo.appendChild(tarjeta);
        });

    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los productos");
    }
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    mostrarCarrito();
}

// Mostrar carrito
function mostrarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const total = document.getElementById("total");

    if (!lista || !total) return;

    lista.innerHTML = "";
    let suma = 0;

    carrito.forEach((producto, indice) => {
        suma += producto.precio;

        const elemento = document.createElement("li");
        elemento.textContent =
            `${producto.nombre} - S/ ${producto.precio.toFixed(2)} `;

        const boton = document.createElement("button");
        boton.textContent = "Eliminar";

        boton.addEventListener("click", () => {
            eliminarProducto(indice);
        });

        elemento.appendChild(boton);
        lista.appendChild(elemento);
    });

    total.textContent = suma.toFixed(2);
}

// Eliminar producto del carrito
function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    mostrarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}

// Cargar productos al abrir la tienda
document.addEventListener("DOMContentLoaded", cargarProductos);
