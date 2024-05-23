import express from "express";
import sqlite3 from "sqlite3";
sqlite3.verbose();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

interface Marker {
  title: string;
  type: string;
  lat: number;
  lng: number;
  id: number;
}

const db = new sqlite3.Database("./database/database.db");
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS markers (id INTEGER PRIMARY KEY, title TEXT, type TEXT, lat REAL, lng REAL)",
  );
});

app.get("/testmarkers", (req, res) => {
  db.run(
    `INSERT INTO markers (title, type, lat, lng) VALUES ('Home', 'green', 50.44866553935577, 30.451962039067208), 
                                                        ('Home1', 'green', 30.451962039067208, 50.44866553935577)`,
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Error on server." });
      }
      res.json({ success: "Done." });
    },
  );
});

app.get("/markers", (req, res) => {
  db.all("SELECT * FROM markers", (err, rows: Marker[]) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Error on server." });
    }
    const formattedRows = rows.map((row) => {
      return {
        title: row.title,
        type: row.type,
        position: { lat: row.lat, lng: row.lng },
        id: row.id,
      };
    });
    res.json(formattedRows);
  });
});

app.get("/markers/:type", (req, res) => {
  const type = req.params.type;
  db.all(
    "SELECT * FROM markers WHERE type = ?",
    [type],
    function (err, rows: Marker[]) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Error on server." });
      }
      if (rows.length === 0) {
        return res.json([]);
      }
      const formattedRows = rows.map((row) => {
        return {
          title: row.title,
          type: row.type,
          position: { lat: row.lat, lng: row.lng },
          id: row.id,
        };
      });
      res.json(formattedRows);
    },
  );
});

app.post("/markers", (req, res) => {
  const { title, type, position } = req.body;

  db.run(
    "INSERT INTO markers (title, type, lat, lng) VALUES (?, ?, ?, ?)",
    [title, type, position.lat, position.lng],
    function (err) {
      // Using function to access `this` context
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ error: "Error adding markers to server." });
      }
      res.status(201).json({ id: this.lastID });
    },
  );
});

app.put("/markers/:id", (req, res) => {
  const markerId = req.params.id;
  const { title, type, position } = req.body;

  db.run(
    "UPDATE markers SET title = ?, type = ?, lat = ?, lng = ? WHERE id = ?",
    [title, type, position.lat, position.lng, markerId],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Error updating marker." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Marker not found." });
      }
      res.json({ message: "Marker updated successfully." });
    },
  );
});

app.delete("/markers/:id", (req, res) => {
  const markerId = req.params.id;

  db.run("DELETE FROM markers WHERE id = ?", [markerId], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Error deleting marker." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Marker not found." });
    }
    res.json({ message: "Marker deleted successfully." });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
