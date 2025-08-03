const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'orderdb'
});

db.connect();

app.post('/orders', (req, res) => {
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

app.get('/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    results.forEach(order => {
      order.cart_items = JSON.parse(order.cart_items);
    });
    res.json(results);
  });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Order Service');
});

app.listen(5000, () => console.log('Order Service running on port 5000'));
