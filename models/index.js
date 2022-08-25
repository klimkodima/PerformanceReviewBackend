const User = require('./user')
const Team = require('./team')
const Session = require('./session')
const Activity = require('./activity')

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  User, Session, Team, Activity
}