require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306)
});

db.connect((error) => {
    if (error) {
        console.error("Error al conectar MySQL:", error.message);
        return;
    }

    console.log("MySQL conectado correctamente");
});

app.get("/api", (req, res) => {
    res.json({
        mensaje: "Backend ElectroStore funcionando"
    });
});

// Consultar productos
app.get("/api/productos", (req, res) => {
    db.query("SELECT * FROM productos", (error, resultados) => {
        if (error) {
            return res.status(500).json({
                error: "Error al consultar productos"
            });
        }

        res.json(resultados);
    });
});
// CREATE: agregar producto
app.post("/api/productos", (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || precio == null || stock == null ||
        !Number.isFinite(Number(precio)) || Number(precio) < 0 ||
        !Number.isInteger(Number(stock)) || Number(stock) < 0) {
        return res.status(400).json({
            mensaje: "Datos del producto inválidos"
        });
    }

    const sql = "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)";

    db.query(sql, [nombre, descripcion || "", precio, stock], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al agregar producto" });
        }

        res.status(201).json({
            mensaje: "Producto agregado correctamente",
            id: resultado.insertId
        });
    });
});

// UPDATE: actualizar producto
app.put("/api/productos/:id", (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    const { id } = req.params;

    if (!nombre || precio == null || stock == null ||
        !Number.isFinite(Number(precio)) || Number(precio) < 0 ||
        !Number.isInteger(Number(stock)) || Number(stock) < 0) {
        return res.status(400).json({ mensaje: "Datos del producto inválidos" });
    }

    const sql = "UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=? WHERE id=?";

    db.query(sql, [nombre, descripcion || "", precio, stock, id], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al actualizar producto" });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({ mensaje: "Producto actualizado correctamente" });
    });
});

// DELETE: eliminar producto
app.delete("/api/productos/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM productos WHERE id=?", [id], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: "Error al eliminar producto" });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json({ mensaje: "Producto eliminado correctamente" });
    });
});
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});