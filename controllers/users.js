const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Team, Session } = require('../models')
const { SALTROUNDS } = require('../util/config')
const sendEmail = require('../util/sendEmail')
const { tokenExtractor } = require('../util/middleware')
const { format } = require('date-fns')
const generator = require('generate-password');

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id)
  if (!req.user) throw Error('malformatted id')
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    if (!req.body.password || req.body.password.length < 8) {
      return res.status(400).send({ error: 'Password validation failed: password: Path `password` (`as`) is shorter than the minimum allowed length (8).' })
    }
    req.body.password = await bcrypt.hash(req.body.password, SALTROUNDS)
    if(!req.body.worksFrom)req.body.worksFrom = format(new Date(), 'yyyy-MM-dd')
    
    if (req.body.teamName) {
      const team = await Team.findOne({
        where: {
          teamName: req.body.teamName
        }
      })
      req.body.teamId = team.id
    }
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.get('/current', tokenExtractor, async (req, res) => {
  try {
    const id = req.decodedToken.id
    const session = await Session.findOne({
      where: {
        userId: req.decodedToken.id
      }
    })
    const user = await User.findByPk(session.userId, {
      attributes: {
        exclude: ['avatarUrl', 'createdAt', 'updatedAt', 'password',
          'thirdParty', 'worksFrom', 'email', 'jiraAccountId', 'pending']
      }
    })
    if (user) {
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    throw Error('ValidationError' + error)
  }
})

router.patch('/activate/:id', userFinder, async (req, res) => {
  if (req.user) {
    req.user.thirdParty = req.query.thirdParty
    req.user.roleName = req.query.role
    req.user.pending = false
    req.user.enabled = true
    const user = await req.user.save()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

router.patch('/disable/:id', userFinder, async (req, res) => {
  if (req.user) {
    req.user.enabled = false
    const user = await req.user.save()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

router.patch('/resetpassword/:id', userFinder, async (req, res) => {
  try {
    if (req.user) {
      const password = generator.generate({
        length: 8,
        numbers: true,
        symbols: true
      });
      req.user.password = await bcrypt.hash(password, SALTROUNDS)
      const user = await req.user.save()
      sendEmail(req.user.email, password)
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.patch('/updateavatar/:id', userFinder, async (req, res) => {
  if (req.user) {
    req.user.avatarUrl = `http://localhost:3001/api/v2/image/${req.user.username}`
    const user = await req.user.save()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

router.put('/:id', userFinder, async (req, res) => {
  if (req.user) {
    req.user.fullName = req.body.fullName
    req.user.roleName = req.body.roleName
    req.user.enabled = req.body.enabled
    const user = await req.user.save()
    res.status(200).end()
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', userFinder, async (req, res) => {
  if (req.user) {
    await req.user.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

module.exports = router