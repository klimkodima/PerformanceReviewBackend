const User = require('./user')
const Team = require('./team')
const Session = require('./session')
const Activity = require('./activity')

User.hasMany(Session)
Session.belongsTo(User)
//Team.belongsTo(Activity)
//Activity.hasOne(Team, {
//  foreignKey: 'teamId'
//})
Team.hasMany(Activity);
Activity.belongsTo(Team);

module.exports = {
  User, Session, Team, Activity
}