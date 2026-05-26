const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/phone/:phone', async (req, res) => {
  const { phone } = req.params;
  const { data: customer } = await supabase.from('customers').select('id').eq('phone', phone).single();
  if (!customer) return res.json([]);
  const { data, error } = await supabase.from('conversations')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: true })
    .limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:customer_id', async (req, res) => {
  const { customer_id } = req.params;
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase.from('conversations')
    .select('*')
    .eq('customer_id', customer_id)
    .gte('created_at', oneHourAgo)
    .order('created_at', { ascending: true })
    .limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { customer_id, sender, message, message_type } = req.body;
  const { data, error } = await supabase.from('conversations').insert([{ customer_id, sender, message, message_type: message_type || 'text' }]).select();
  if (error) return res.s
