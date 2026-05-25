process.env.SUPABASE_URL = 'https://vsehgcvvltqxjzigyxhp.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'sb_secret_mVhkJBKDfrqlb6Zutg7q4Q_sZYbNSSt';
process.env.PORT = '3000';

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); next(); });

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
