const express = require('express')
const router = express.Router()
const supabase = require('../supabaseClient')

router.get('/:restaurant_id', async (req, res) => {
  const { restaurant_id } = req.params
  const { data, error } = await supabase.from('categories').select('*').eq('restaurant_id', restaurant_id).eq('is_active', true).order('sort_order')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { restaurant_id, name, sort_order } = req.body
  const { data, error } = await supabase.from('categories').insert([{ restaurant_id, name, sort_order }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
})

module.exports = router
