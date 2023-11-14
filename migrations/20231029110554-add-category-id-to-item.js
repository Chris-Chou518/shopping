'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Items', 'category_id', {
      type: Sequelize.INTEGER,
      // allowNull: false,
      onDelete: 'SET NULL',
      references: {
        model: 'Categories',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Items', 'category_id')
  }
}
