'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Item.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        onDelete: 'SET NULL'
      })
      Item.hasMany(models.Comment, { foreignKey: 'itemId' })
      Item.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'itemId',
        as: 'FavoritedUsers'
      })
      // Item.belongsToMany(models.User, {
      //   through: models.Cart,
      //   foreignKey: 'itemId',
      //   as: 'CartUsers'
      // })
      Item.hasMany(models.Cart, { foreignKey: 'itemId' })
    }
  }
  Item.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'Items',
    underscored: true
  })
  return Item
}
