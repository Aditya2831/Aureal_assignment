const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./animals.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the animals database.');
});

//table creation
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        habitat TEXT NOT NULL
    )`);
});


app.get('/animals', (req, res) => {
    db.all("SELECT * FROM animals", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(200).json(rows);
    });
});


app.post('/animals', (req, res) => {
    const { name, habitat } = req.body;
    const sql = `INSERT INTO animals (name, habitat) VALUES (?, ?)`;
    db.run(sql, [name, habitat], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.status(201).json({ id: this.lastID, name, habitat });
    });
});


app.put('/animals/:id', (req, res) => {
    const { id } = req.params;
    const { name, habitat } = req.body;
    const sql = `UPDATE animals SET name = ?, habitat = ? WHERE id = ?`;

    db.run(sql, [name, habitat, id], function(err) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).send({ error: 'Animal not found' });
        } else {
            res.status(200).send({ message: 'Animal updated successfully', id: id });
        }
    });
});


app.delete('/animals/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM animals WHERE id = ?`;

    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).send({ error: 'Animal not found' });
        } else {
            res.status(200).send({ message: 'Animal deleted successfully' });
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle closing
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Closed the database connection.');
        process.exit(0);
    });
});
