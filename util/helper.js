const getTotalTime = (teamActivities) => teamActivities.reduce((acc, act) => acc + act.timeSpend, 0)

const getLabels = (activities, totalTimeSpend) => activities.reduce((acc, act) => {
  const dubl = acc.find(v => v.name === act.name)
  if (!dubl) {
    acc.push({
      name: act.name,
      totalTimeSpend: act.timeSpend,
      percentage: act.timeSpend / totalTimeSpend * 100
    })
  } else {
    dubl.totalTimeSpend = act.timeSpend + dubl.totalTimeSpend
    dubl.percentage = dubl.totalTimeSpend / totalTimeSpend * 100
  }
  return acc
}, [])

module.exports = {
  getTotalTime, getLabels
}