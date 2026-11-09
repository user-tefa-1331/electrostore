
import { useEffect, useState } from 'react'
import { obtenerProductos } from '../services/api'

function Productos({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarProductos() {
      try {
const respuesta = await obtenerProductos()
setProductos(respuesta.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  function obtenerIcono(nombre) {
    const texto = nombre.toLowerCase()

    if (texto.includes('laptop')) return '💻'
    if (texto.includes('galaxy') || texto.includes('celular')) return '📱'
    if (texto.includes('tv') || texto.includes('televisor')) return '📺'
    if (texto.includes('lavadora')) return '🧺'

    return '📦'
  }

  return (
    <section id="productos" className="seccion">
      <h2>Nuestros productos</h2>

      {cargando && <p>Cargando productos...</p>}
      {error && <p>{error}</p>}

      <div className="productos-grid">
        {productos.map((producto) => (
          <article className="producto-card" key={producto.id}>
            <div className="producto-icono">
              {obtenerIcono(producto.nombre)}
            </div>

            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>

            <p className="producto-precio">
              S/ {Number(producto.precio).toFixed(2)}
            </p>

            <p>Stock: {producto.stock}</p>

            <button
              className="boton-agregar"
              disabled={producto.stock <= 0}
              onClick={() => agregarAlCarrito(producto)}
            >
              Agregar al carrito
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Productos
