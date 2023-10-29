'use strict'
const faker = require('faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Items',
      Array.from({ length: 50 }, () => ({
        name: faker.name.findName(),
        price: Math.floor(Math.random() * 1000) + 10,
        description: faker.lorem.text(),
        image: `https://loremflickr.com/320/240/cat/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date(),
        category_id: categories[Math.floor(Math.random() * categories.length)].id
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', {})
  }
}
