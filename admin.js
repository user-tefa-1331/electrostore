
const formulario = document.getElementById("formProducto");
const lista = document.getElementById("listaProductos");
const cancelar = document.getElementById("cancelar");
let productos = [];

async function cargarProductos() {
    try {
        const respuesta = await fetch("/api/productos");
        if (!respuesta.ok) throw new Error("Error al consultar");

        productos = await respuesta.json();
        lista.replaceChildren();

        productos.forEach(producto => {
            const fila = document.createElement("tr");

            [producto.id, producto.nombre,
             `S/ ${Number(producto.precio).toFixed(2)}`,
             producto.stock].forEach(valor => {
                const celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            const acciones = document.createElement("td");
            const editar = document.createElement("button");
            editar.textContent = "Editar";
            editar.onclick = () => editarProducto(producto.id);

            const eliminar = document.createElement("button");
            eliminar.textContent = "Eliminar";
            eliminar.className = "eliminar";
            eliminar.onclick = () => eliminarProducto(producto.id);

            acciones.append(editar, " ", eliminar);
            fila.appendChild(acciones);
            lista.appendChild(fila);
        });
    } catch (error) {
        alert("No se pudieron cargar los productos");
    }
}

function limpiarFormulario() {
    formulario.reset();
    document.getElementById("productoId").value = "";
    document.getElementById("guardar").textContent = "Guardar producto";
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    document.getElementById("productoId").value = producto.id;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion || "";
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("guardar").textContent = "Actualizar producto";
    window.scrollTo(0, 0);
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const id = document.getElementById("productoId").value;
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: Number(document.getElementById("precio").value),
        stock: Number(document.getElementById("stock").value)
    };

    const respuesta = await fetch(
        id ? `/api/productos/${id}` : "/api/productos",
        {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        }
    );

    if (!respuesta.ok) {
        alert("No se pudo guardar el producto");
        return;
    }

    alert(id ? "Producto actualizado" : "Producto agregado");
    limpiarFormulario();
    cargarProductos();
});

async function eliminarProducto(id) {
    if (!confirm("¿Deseas eliminar este producto?")) return;

    const respuesta = await fetch(`/api/productos/${id}`, {
        method: "DELETE"
    });

    if (!respuesta.ok) {
        alert("No se pudo eliminar el producto");
        return;
    }

    alert("Producto eliminado");
    cargarProductos();
}

cancelar.addEventListener("click", limpiarFormulario);
cargarProductos();
