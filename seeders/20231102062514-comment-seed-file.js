'use strict'
const faker = require('faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 取出user table所有的id形成一個陣列[{id:1}, {id:2}...]
    const usersId = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const itemsId = await queryInterface.sequelize.query(
      'SELECT id FROM Items;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 100 }, () => ({
        text: faker.lorem.sentence(),
        user_id: usersId[Math.floor(Math.random() * usersId.length)].id,
        item_id: itemsId[Math.floor(Math.random() * itemsId.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', {})
  }
}
