const express = require('express')
const router = express.Router()
const supabase = require('../supabaseClient')

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('restaurants').select('*').eq('is_active', true)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/', async (req, res) => {
  const { name, phone, address } = req.body
  const { data, error } = await supabase.from('restaurants').insert([{ name, phone, address }]).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
})

module.exports = router
