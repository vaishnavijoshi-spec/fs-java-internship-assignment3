const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mern_auth_db"
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, hashed],
    (err) => {
      if (err) return res.send(err);
      res.send("User Registered");
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (result.length === 0) return res.send("User not found");

    const valid = await bcrypt.compare(password, result[0].password);
    if (!valid) return res.send("Wrong password");

    res.send("Login success");
  });
});

app.post("/items", (req, res) => {
  const { title } = req.body;

  db.query("INSERT INTO items (title) VALUES (?)", [title], (err) => {
    if (err) return res.send(err);
    res.send("Item added");
  });
});

app.get("/items", (req, res) => {
  db.query("SELECT * FROM items", (err, data) => {
    if (err) return res.send(err);
    res.json(data);
  });
});

app.delete("/items/:id", (req, res) => {
  db.query("DELETE FROM items WHERE id=?", [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send("Deleted");
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));