
require("dotenv").config();

const mysql = require("mysql2");

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

module.exports = db;
