'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Coupons', [{
      code: 'please enter discount!!',
      text: '不打折唷QQ',
      discount: 100,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      code: 'qwertyuiop',
      text: '打九折',
      discount: 90,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      code: 'asdfghjkl',
      text: '打八折',
      discount: 80,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      code: 'zxcvbnm,./',
      text: '打七折',
      discount: 70,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      code: 'qaz12wsx',
      text: '打九五折',
      discount: 95,
      created_at: new Date(),
      updated_at: new Date()
    }, {
      code: '3edc4rfv5tgb',
      text: '打八五折',
      discount: 85,
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Coupons', {})
  }
}
