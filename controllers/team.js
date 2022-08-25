const router = require('express').Router()
const { Team } = require('../models')

router.get('/', async (req, res) => {
  const teams = await Team.findAll({
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
  })
  res.json(teams)
})

router.post('/', async (req, res) => {
  try {
    const team = await Team.create(req.body)
    res.json(team)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = router