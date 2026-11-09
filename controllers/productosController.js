
const db = require("../config/db");

// GET: consultar productos
exports.obtenerProductos = (req, res) => {
    db.query("SELECT * FROM productos", (error, resultados) => {
        if (error) {
            return res.status(500).json({
                error: "Error al consultar productos"
            });
        }

        res.json(resultados);
    });
};

// POST: agregar producto
exports.crearProducto = (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || precio == null || stock == null ||
        !Number.isFinite(Number(precio)) || Number(precio) < 0 ||
        !Number.isInteger(Number(stock)) || Number(stock) < 0) {
        return res.status(400).json({
            mensaje: "Datos del producto inválidos"
        });
    }

    const sql = `
        INSERT INTO productos (nombre, descripcion, precio, stock)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nombre, descripcion || "", precio, stock],
        (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    mensaje: "Error al agregar producto"
                });
            }

            res.status(201).json({
                mensaje: "Producto agregado correctamente",
                id: resultado.insertId
            });
        }
    );
};

// PUT: actualizar producto
exports.actualizarProducto = (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    const { id } = req.params;

    if (!nombre || precio == null || stock == null ||
        !Number.isFinite(Number(precio)) || Number(precio) < 0 ||
        !Number.isInteger(Number(stock)) || Number(stock) < 0) {
        return res.status(400).json({
            mensaje: "Datos del producto inválidos"
        });
    }

    const sql = `
        UPDATE productos
        SET nombre=?, descripcion=?, precio=?, stock=?
        WHERE id=?
    `;

    db.query(
        sql,
        [nombre, descripcion || "", precio, stock, id],
        (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    mensaje: "Error al actualizar producto"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "Producto no encontrado"
                });
            }

            res.json({
                mensaje: "Producto actualizado correctamente"
            });
        }
    );
};

// DELETE: eliminar producto
exports.eliminarProducto = (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM productos WHERE id=?",
        [id],
        (error, resultado) => {
            if (error) {
                return res.status(500).json({
                    mensaje: "Error al eliminar producto"
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "Producto no encontrado"
                });
            }

            res.json({
                mensaje: "Producto eliminado correctamente"
            });
        }
    );
};
