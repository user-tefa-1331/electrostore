
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const obtenerProductos = () => api.get('/productos')

export const crearProducto = (producto) =>
  api.post('/productos', producto)

export const actualizarProducto = (id, producto) =>
  api.put(`/productos/${id}`, producto)

export const eliminarProducto = (id) =>
  api.delete(`/productos/${id}`)

export default api
