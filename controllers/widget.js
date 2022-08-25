const router = require('express').Router()
const { Op } = require("sequelize");
const { User, Activity } = require('../models')
const { SALTROUNDS } = require('../util/config')

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
};

const teamActivitiesPercentage =
  [
    {
      "teamName": "Charlie",
      "labels": [
        {
          "name": "Audits",
          "percentage": 39.8936170212766
        },
        {
          "name": "Meetings",
          "percentage": 24.73404255319149
        },
        {
          "name": "Others",
          "percentage": 16.75531914893617
        },
        {
          "name": "Support",
          "percentage": 18.617021276595743
        }
      ]
    },
    {
      "teamName": "X-Rays",
      "labels": [
        {
          "name": "Audits",
          "percentage": 39.8936170212766
        },
        {
          "name": "Meetings",
          "percentage": 24.73404255319149
        },
        {
          "name": "Others",
          "percentage": 16.75531914893617
        },
        {
          "name": "Support",
          "percentage": 18.617021276595743
        }
      ]
    },
    {
      "teamName": "Alpha",
      "labels": [
        {
          "name": "Audits",
          "percentage": 39.8936170212766
        },
        {
          "name": "Meetings",
          "percentage": 24.73404255319149
        },
        {
          "name": "Others",
          "percentage": 16.75531914893617
        },
        {
          "name": "Support",
          "percentage": 18.617021276595743
        }
      ]
    }
  ]

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

const activitiesPercentage = {
  totalTimeSpend: 225600,
  labels: [
    {
      name: 'Audits',
      totalTimeSpend: 90000,
      percentage: 39.8936170212766
    },
    {
      name: 'Meetings',
      totalTimeSpend: 55800,
      percentage: 24.73404255319149
    },
    {
      name: 'Others',
      totalTimeSpend: 37800,
      percentage: 16.75531914893617
    },
    {
      name: 'Support',
      totalTimeSpend: 42000,
      percentage: 18.617021276595743
    }
  ]
};

router.get('/ActivitiesPercentage', async (req, res) => {
  try {
    const activitiesPercentages = await Activity.findAll(
      {
        where: {
          [Op.and]:
            [{ userId: req.query.auditorsIds },
            {
              date: {
                [Op.lte]: new Date(req.query.to),
                [Op.gte]: new Date(req.query.from)
              }
            }]
        }
      }
    )
    const totalTimeSpend = 
    activitiesPercentages.reduce((acc, act) => acc + act.timeSpend, 0)

    console.log(activitiesPercentages)
    console.log(totalTimeSpend)
    const data = {...activitiesPercentage, totalTimeSpend: totalTimeSpend}
    res.json(data)
  } catch (error) {
    return res.status(400).json({ error })
  }
})


module.exports = router