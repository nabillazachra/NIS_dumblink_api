"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Links extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Links.belongsTo(models.Brands, {
        as: "brand",
        foreignKey: "brandId",
      });
    }
  }
  Links.init(
    {
      title: DataTypes.STRING,
      url: DataTypes.STRING,
      logo: DataTypes.STRING,
      brandId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Links",
    }
  );
  return Links;
};
