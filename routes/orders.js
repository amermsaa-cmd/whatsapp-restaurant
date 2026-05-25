require('dotenv').config();
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/', async (req, res) => {
  const { restaurant_id, status } = req.query;
  let query = supabase.from('orders').select('*, customers(name, phone), order_items(*, products(name))').order('created_at', { ascending: false });
  if (restaurant_id) query = query.eq('restaurant_id', restaurant_id);
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('orders').select('*, customers(name, phone, address), order_items(*, products(name, base_price), order_item_extras(*, extras(name)))').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'الطلب غير موجود' });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { restaurant_id, customer_id, items, delivery_fee, payment_method, notes } = req.body;
  const order_number = 'ORD-' + Date.now();
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.unit_price * item.quantity;
    if (item.extras) for (const extra of item.extras) subtotal += extra.price * item.quantity;
  }
  const total = subtotal + (delivery_fee || 0);
  const { data: order, error: orderError } = await supabase.from('orders').insert([{ restaurant_id, customer_id, order_number, subtotal, delivery_fee: delivery_fee || 0, total, payment_method: payment_method || 'cash', notes }]).select().single();
  if (orderError) return res.status(500).json({ error: orderError.message });
  for (const item of items) {
    const { data: orderItem, error: itemError } = await supabase.from('order_items').insert([{ order_id: order.id, product_id: item.product_id, quantity: item.quantity, unit_price: item.unit_price, notes: item.notes }]).select().single();
    if (itemError) return res.status(500).json({ error: itemError.message });
    if (item.extras && item.extras.length > 0) {
      await supabase.from('order_item_extras').insert(item.extras.map(e => ({ order_item_id: orderItem.id, extra_id: e.extra_id, price: e.price })));
    }
  }
  res.status(201).json({ message: 'تم إنشاء الطلب', order_number, order_id: order.id });
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
const valid = ['waiting','preparing','delivering','delivered','cancelled'];  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'تم تحديث الحالة', order: data });
});

module.exports = router;