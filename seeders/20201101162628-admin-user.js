'use strict'

const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      name: 'Admin',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('1234'),
      country: 'EG',
      city: 'الاسكندرية',
      speciality: 'admin',
      telegramId: 123456,
      ipAddress: '123414',
      phone: '123141414',
      status: 'active',
      verifiedAt: new Date(),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
