const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
router.get('/phone/:phone', async (req, res) => {
  const { phone } = req.params;
  const { data, error } = await supabase.from('customers').select('*').eq('phone', phone).single();
  if (error) return res.status(404).json({ error: 'العميل غير موجود' });
  res.json(data);
});
router.post('/', async (req, res) => {
  console.log('Body received:', req.body);
  const { phone, name, address, notes } = req.body;
  const { data, error } = await supabase.from('customers').insert([{ phone, name, address, notes }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, notes } = req.body;
  const { data, error } = await supabase.from('customers').update({ name, address, notes }).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});
module.exports = router;
