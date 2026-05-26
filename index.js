const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); next(); });

const processedMessages = new Map();
app.use((req, res, next) => {
  if (req.method === 'POST' && req.body) {
    const key = JSON.stringify(req.body);
    const now = Date.now();
    if (processedMessages.has(key) && now - processedMessages.get(key) < 5000) {
      return res.status(200).json({ message: 'duplicate' });
    }
    processedMessages.set(key, now);
    setTimeout(() => processedMessages.delete(key), 10000);
  }
  next();
});

app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/conversations', require('./routes/conversations'));

app.get('/', (req, res) => {
    res.json({ message: 'WhatsApp Restaurant API شغال' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('السيرفر شغال على البورت ' + PORT);
});
