const express = require('express')
const router = express.Router()
const supabase = require('../supabaseClient')

router.get('/:restaurant_id', async (req, res) => {
  const { restaurant_id } = req.params
  const { data, error } = await supabase.from('products').select('*, categories(name)').eq('restaurant_id', restaurant_id).eq('is_available', true)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { restaurant_id, category_id, name, description, image_url, base_price } = req.body
  const { data, error } = await supabase.from('products').insert([{ restaurant_id, category_id, name, description, image_url, base_price }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
})

router.patch('/:id/availability', async (req, res) => {
  const { id } = req.params
  const { is_available } = req.body
  const { data, error } = await supabase.from('products').update({ is_available }).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
})

module.exports = router
