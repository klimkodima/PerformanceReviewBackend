const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { User, Activity } = require('../models')

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.decodedToken.id)
  if (!req.user) throw Error('malformatted id')
  next()
}

router.post('/', tokenExtractor, userFinder, async (req, res) => {
  if (req.user) {
    const newActivity = {
      name: req.body.name,
      timeSpend: req.body.timeSpend*3600,
      comments: req.body.comments,
      date: new Date(req.body.date),
      userId: req.user.id,
      teamId: req.user.teamId
    }
    await Activity.create(newActivity)
    res.status(200).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router