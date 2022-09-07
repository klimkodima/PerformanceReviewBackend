const router = require('express').Router()
const { Team } = require('../models')

router.get('/', async (req, res) => {
  const teams = await Team.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] }
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

router.delete('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id)
    if (team) {
      await team.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    return res.status(404).json({ error })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id)
    if (team) {
      team. teamName = req.body. teamName
      team.teamLeaderName = req.body.teamLeaderName
      await team.save()
      res.status(200).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = router