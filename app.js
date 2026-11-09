
require("dotenv").config();

const express = require("express");
const productosRoutes = require("./routes/productosRoutes");

const app = express();
const PORT = 3000;

// Permitir recibir datos JSON
app.use(express.json());

// Mantener disponibles los archivos HTML originales
app.use(express.static(__dirname));

// Ruta principal de la API
app.get("/api", (req, res) => {
    res.json({
        mensaje: "Backend ElectroStore funcionando"
    });
});

// Rutas CRUD de productos
app.use("/api/productos", productosRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
