"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brands extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Brands.belongsTo(models.users, {
        as: "users",
        foreignKey: "userId",
      });
      Brands.hasMany(models.Links, {
        as: "link",
        foreignKey: {
          name: "brandId",
        },
      });
    }
  }
  Brands.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      uniqueLink: DataTypes.STRING,
      viewCount: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Brands",
    }
  );
  return Brands;
};
