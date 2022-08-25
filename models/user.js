const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    },
    allowNull: false
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teamId: {
    type: DataTypes.INTEGER,
  },
  teamName: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.STRING,
  },
  pending: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  jiraAccountId: {
    type: DataTypes.STRING,
  },
  avatarUrl: {
    type: DataTypes.STRING,
  },
  worksFrom: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thirdParty: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user',
})

module.exports = User