const router = require('express').Router()
const { Op } = require("sequelize")
const { User, Activity } = require('../models')

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

router.get('/ActivitiesPercentage', async (req, res) => {
  try {
    const activitiesPercentages = await Activity.findAll(
      {
        attributes: ['name', 'timeSpend'],
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
    const labels = activitiesPercentages.reduce((acc, act) => {
      const dubl = acc.find(v => v.name === act.name)
      if (!dubl) {
        acc.push({
          name: act.name,
          totalTimeSpend: act.timeSpend,
          percentage: act.timeSpend / totalTimeSpend * 100
        });
      } else {
        dubl.totalTimeSpend = act.timeSpend + dubl.totalTimeSpend
        dubl.percentage = dubl.totalTimeSpend / totalTimeSpend * 100
      }
      return acc;
    }, [])

    res.json({ labels: labels, totalTimeSpend: totalTimeSpend })
  } catch (error) {
    return res.status(400).json({ error })
  }
})


module.exports = router