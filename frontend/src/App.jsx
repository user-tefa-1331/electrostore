
import { useState } from 'react'
import './App.css'
import Admin from './pages/Admin'


import Navbar from './components/Navbar'
import Home from './pages/Home'
import Productos from './pages/Productos'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  const [carrito, setCarrito] = useState([])

  function agregarAlCarrito(producto) {
    console.log('Producto agregado:', producto)

    setCarrito((actual) => {
      const id = Number(producto.id)
      const stock = Number(producto.stock)

      if (!Number.isFinite(id) || stock <= 0) {
        return actual
      }

      const existente = actual.find(
        (item) => Number(item.id) === id
      )

      if (existente) {
        if (existente.cantidad >= stock) {
          return actual
        }

        return actual.map((item) =>
          Number(item.id) === id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }

      return [
        ...actual,
        {
          ...producto,
          id,
          precio: Number(producto.precio),
          stock,
          cantidad: 1
        }
      ]
    })
  }

  function quitarDelCarrito(id) {
    setCarrito((actual) =>
      actual.filter((item) => item.id !== id)
    )
  }

  function vaciarCarrito() {
    setCarrito([])
  }

  const total = carrito.reduce(
    (suma, item) =>
      suma + Number(item.precio) * Number(item.cantidad),
    0
  )

  return (
    <>
      <Navbar />
      <Home />

      <Productos agregarAlCarrito={agregarAlCarrito} />

      <section className="seccion" id="carrito">
        <h2>🛒 Carrito de compras</h2>

        {carrito.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            {carrito.map((item) => (
              <div className="carrito-item" key={item.id}>
                <span>
                  {item.nombre} × {item.cantidad}
                </span>

                <span>
                  S/ {(item.precio * item.cantidad).toFixed(2)}
                </span>

                <button
                  onClick={() => quitarDelCarrito(item.id)}
                >
                  Quitar
                </button>
              </div>
            ))}

            <h3>Total: S/ {total.toFixed(2)}</h3>

            <button onClick={vaciarCarrito}>
              Vaciar carrito
            </button>
          </>
        )}
      </section>

      <About />
      <Contact />
      <Admin />

      <footer>
        <p>© 2026 ElectroStore</p>
      </footer>
    </>
  )
}

export default App
