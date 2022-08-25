const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Team extends Model { }

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  teamLeaderName: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'team',
})

module.exports = Team