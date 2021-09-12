'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Users', 'phone')
    await queryInterface.removeConstraint('Users', 'email')
    await queryInterface.removeConstraint('Users', 'telegramId')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Users', {
      type: 'UNIQUE',
      fields: ['phone', 'email', 'telegramId']
    })
  }
}
