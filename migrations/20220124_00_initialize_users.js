const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('users', {
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
            full_name: {
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
            role_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            team_id: {
                type: DataTypes.INTEGER,
            },
            team_name: {
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
            jira_account_id: {
                type: DataTypes.STRING,
            },
            avatar_url: {
                type: DataTypes.STRING,
            },
            works_from: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            third_party: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('users')
    },
}