const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

// SQLite Database
const db = new sqlite3.Database("./app.db", (err) => {
  if (err) console.error("Error opening database:", err);
  else console.log("Connected to SQLite database");
});

// Create Table
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dni TEXT UNIQUE,
    name TEXT,
    surname TEXT,
    course TEXT,
    productos_restantes INTEGER DEFAULT 4
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    tipo TEXT,
    image TEXT
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_users INTEGER,
    fecha TEXT,
    hora TEXT,
    FOREIGN KEY (id_users) REFERENCES users(id)
  )`
);

db.run(
  `CREATE TABLE IF NOT EXISTS detalle_compras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_compra INTEGER,
    id_producto INTEGER,
    cantidad INTEGER,
    FOREIGN KEY (id_compra) REFERENCES compras(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
  )`
);

// CRUD Operations
// Get All Users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get All productos
app.get("/productos", (req, res) => {
  db.all("SELECT * FROM productos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get All compra
app.get("/compras", (req, res) => {
  db.all("SELECT * FROM compras", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get All detalle_compra
app.get("/detalle_compras", (req, res) => {
  db.all("SELECT * FROM detalle_compras", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get User by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Get producto  by ID
app.get("/productos/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM productos WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Get compras by ID 
app.get("/compras/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM compras WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Get User by Cedula
app.get("/users/cedula/:dni", (req, res) => {
  const { dni } = req.params;
  db.get("SELECT * FROM users WHERE dni = ?", [dni], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Create User
app.post("/users", (req, res) => {
  const { dni, name, surname, course } = req.body;
  db.run(
    `INSERT INTO users (dni, name, surname, course) VALUES (?, ?, ?, ?)`,
    [dni, name, surname, course],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, dni, name, surname, course });
    }
  );
});

// Create Producto
app.post("/productos", (req, res) => {
  const { name, tipo, image } = req.body;
  db.run(
    `INSERT INTO productos (name, tipo, image) VALUES (?, ?, ?)`,
    [name, tipo, image],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, tipo, image});
    }
  );
});

// Create comprar
app.post("/compras", (req, res) => {
  const { id_users } = req.body; 

  const fecha = new Date().toISOString().split('T')[0];
  const hora = new Date().toLocaleTimeString(); 

  db.run(
    `INSERT INTO compras (id_users, fecha, hora) VALUES (?, ?, ?)`,
    [id_users, fecha, hora],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, id_users, fecha, hora});
    }
  );
});

// Create detalles_comprar
app.post("/detalle_compras", (req, res) => {
  const { id_compra, id_producto, cantidad } = req.body; 

  db.run(
    `INSERT INTO detalle_compras (id_compra, id_producto, cantidad ) VALUES (?, ?, ?)`,
    [id_compra, id_producto,cantidad ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, id_compra, id_producto, cantidad });
    }
  );
});

// Update User
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { dni, name, surname, course, productos_restantes} = req.body;
  db.run(
    `UPDATE users SET dni = ?, name = ?, surname = ?, course = ?, productos_restantes = ? WHERE id = ?`,
    [dni, name, surname, course,productos_restantes,id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User updated successfully" });
    }
  );
});

// Delete User
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM users WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
});

// Update productos
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.run(
    `UPDATE productos SET name = ? WHERE id = ?`,
    [ name ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Producto updated successfully" });
    }
  );
});

// Delete productos
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM productos WHERE id = ?", id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
});

const resetContadorDiario = () => {
  db.run(`UPDATE users SET productos_restantes = 4`, (err) => {
    if (err) {
      console.error("Error al resetear el contador diario:", err.message);
    } else {
      console.log("Contador de productos reseteado para todos los estudiantes.");
    }
  });
};


// Endpoint para procesar la compra
app.post('/endpoint', (req, res) => {
  const { id_users, productos_a_comprar } = req.body;

  // Verificar si el usuario existe y obtener sus productos restantes
  db.get('SELECT productos_restantes FROM users WHERE id = ?', [id_users], (err, row) => {
    if (!row) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const productos_restantes = row.productos_restantes;

    // Verificar si el usuario puede comprar más productos
    if (productos_a_comprar > productos_restantes) {
      return res.status(500).json({ error: 'No se puede procesar su compra porque superó el límite de compras' });
    }

    // Actualizar la cantidad de productos restantes
    const nuevos_productos_restantes = productos_restantes - productos_a_comprar;

    db.run('UPDATE users SET productos_restantes = ? WHERE id = ?', [nuevos_productos_restantes, id_users], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar la base de datos' });
      }

      return res.status(200).json({ message: 'Compra procesada exitosamente', productos_restantes: nuevos_productos_restantes });
    });
  });
});


// Llamar a esta función al inicio del día (puedes usar un cron job)
resetContadorDiario();


// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
