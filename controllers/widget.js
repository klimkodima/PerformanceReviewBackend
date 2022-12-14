const router = require('express').Router()
const { Op } = require('sequelize')
const { User, Activity, Team } = require('../models')
const { getTotalTime, getLabels } = require('../util/helper')

const WIDGETS = {
  availableWidgets: [
    'ContentAuditor',
    'ActivitiesPercentage',
    'CriteriaWidget',
    'PerformanceStatistics',
    'TeamComparison',
    'AuditorsStatistic',
    'TeamActivitiesPercentage'
  ],
  settingsPermission: 'WRITE'
}

router.get('/', async (req, res) => {
  res.json(WIDGETS)
})

router.get('/ContentAuditor', async (req, res) => {
  try {

    const user = await User.findByPk(req.query.auditorsIds, {
      attributes: {
        exclude: ['id', 'username', 'email', 'createdAt', 'updatedAt', 'password',
          'enabled', 'roleName', 'teamId', 'thirdParty', 'jiraAccountId', 'pending']
      }
    })
    if (user) {
      const auditor = {
        fullName: user.fullName,
        level: user.level,
        experienceInMonths: new Date().getMonth() - new Date(user.worksFrom).getMonth() +
          (12 * (new Date().getFullYear() - new Date(user.worksFrom).getFullYear())),
        teamName: user.teamName,
        teamLeadName: user.teamLeadName,
        photo: user.avatarUrl
      }
      res.json(auditor)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    throw Error('ValidationError' + error)
  }
})

router.get('/ActivitiesPercentage', async (req, res) => {
  try {
    const activitiesPercentages = await Activity.findAll(
      {
        attributes: ['name', 'timeSpend',],
        where: {
          [Op.and]:
            [
              { userId: req.query.auditorsIds },
              {
                date: {
                  [Op.lte]: new Date(req.query.to),
                  [Op.gte]: new Date(req.query.from)
                }
              }
            ]
        }
      }
    )
    const totalTimeSpend = getTotalTime(activitiesPercentages)
    const labels = getLabels(activitiesPercentages, totalTimeSpend, 'AUDITOR')
    res.json({ labels: labels, totalTimeSpend: totalTimeSpend })
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.get('/TeamActivitiesPercentage', async (req, res) => {
  try {
    const activities = await Activity.findAll(
      {
        attributes: [
          'name',
          'timeSpend'
        ],
        include: {
          model: Team,
          attributes: ['teamName'],
        },
        where: {
          date: {
            [Op.lte]: new Date(req.query.to),
            [Op.gte]: new Date(req.query.from)
          }
        }
      }
    )

    const teams = await Team.findAll(
      {
        attributes: [
          'teamName',
        ]
      }
    )

    const data = teams.map(team => {
      const teamActivities = activities.filter(act => act.team.teamName === team.teamName)
      const totalTimeSpend = getTotalTime(teamActivities)
      const labels = getLabels(teamActivities, totalTimeSpend, 'TEAM')
      return { teamName: team.teamName, labels: labels }
    })

    res.json(data)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = router