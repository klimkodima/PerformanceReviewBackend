const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Activity extends Model { }

Activity.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeSpend: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'activities',
})

module.exports = Activity