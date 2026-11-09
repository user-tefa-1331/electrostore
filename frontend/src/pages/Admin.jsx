
import { useEffect, useState } from 'react'
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../services/api'

function Admin() {
  const [productos, setProductos] = useState([])
  const [editando, setEditando] = useState(null)
  const [error, setError] = useState('')

  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: ''
  })

  async function cargarProductos() {
    try {
      const respuesta = await obtenerProductos()
      setProductos(respuesta.data)
      setError('')
    } catch {
      setError('No se pudieron cargar los productos')
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  function cambiarCampo(e) {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    })
  }

  async function guardarProducto(e) {
    e.preventDefault()

    const datos = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock)
    }

    if (
      !datos.nombre.trim() ||
      !Number.isFinite(datos.precio) ||
      datos.precio < 0 ||
      !Number.isInteger(datos.stock) ||
      datos.stock < 0
    ) {
      setError('Verifica los datos del producto')
      return
    }

    try {
      if (editando !== null) {
        await actualizarProducto(editando, datos)
      } else {
        await crearProducto(datos)
      }

      setFormulario({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: ''
      })

      setEditando(null)
      await cargarProductos()
    } catch {
      setError('No se pudo guardar el producto')
    }
  }

  function editarProducto(producto) {
    setEditando(producto.id)
    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock
    })
  }

  async function borrarProducto(id) {
    if (!window.confirm('¿Eliminar este producto?')) return

    try {
      await eliminarProducto(id)
      await cargarProductos()
    } catch {
      setError('No se pudo eliminar el producto')
    }
  }

  return (
    <section className="seccion" id="admin">
      <h2>Administración de productos</h2>
      <p>Registrar, editar y eliminar productos</p>

      {error && <p role="alert">{error}</p>}

      <form className="admin-form" onSubmit={guardarProducto}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={cambiarCampo}
          required
        />

        <input
          name="descripcion"
          placeholder="Descripción"
          value={formulario.descripcion}
          onChange={cambiarCampo}
        />

        <input
          name="precio"
          type="number"
          min="0"
          step="0.01"
          placeholder="Precio"
          value={formulario.precio}
          onChange={cambiarCampo}
          required
        />

        <input
          name="stock"
          type="number"
          min="0"
          step="1"
          placeholder="Stock"
          value={formulario.stock}
          onChange={cambiarCampo}
          required
        />

        <button type="submit">
          {editando !== null ? 'Actualizar' : 'Agregar producto'}
        </button>
      </form>

      <div className="admin-lista">
        {productos.map((producto) => (
          <div className="admin-item" key={producto.id}>
            <span>
              {producto.nombre} — S/ {Number(producto.precio).toFixed(2)}
              {' '}— Stock: {producto.stock}
            </span>

            <button onClick={() => editarProducto(producto)}>
              Editar
            </button>

            <button onClick={() => borrarProducto(producto.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Admin
