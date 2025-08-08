const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'orderdb'
});

db.connect();

app.post('/order/orders', (req, res) => {
  const { cart_items, total_price } = req.body;
  db.query(
    'INSERT INTO orders (cart_items, total_price) VALUES (?, ?)',
    [JSON.stringify(cart_items), total_price],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Order added' });
    }
  );
});

app.get('/order/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/order/order/:id', (req, res) => {
  db.query(`SELECT * FROM orders WHERE id = ${req.params.id}`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/order/', (req, res) => {
    res.send('Welcome to the Order Service');
});

app.listen(5000, () => console.log('Order Service running on port 5000'));
