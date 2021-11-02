const { Brands, users, Links } = require("../../models");
const Joi = require("joi");

exports.addBrand = async (req, res) => {
  const data = req.body;
  try {
    console.log(data);
    const newBrand = await Brands.create({
      ...data,
      viewCount: 0,
      image: req.files.image[0].filename,
      userId: req.users.id,
    });

    const dataLink = JSON.parse(data.data);
    await Promise.all(
      dataLink.map(async (item) => {
        await Links.create({
          ...item,
          logo: "testGambar",
          brandId: newBrand.id,
        });
      })
    );

    let brand = await Brands.findOne({
      where: {
        id: newBrand.id,
      },
      include: {
        model: Links,
        as: "link",
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["userId", "brandId", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: brand,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

//Get all data Brands
exports.getBrands = async (req, res) => {
  try {
    let brands = await Brands.findAll({
      where: {
        userId: req.users.id,
      },
      include: {
        model: Links,
        as: "link",
        attributes: {
          exclude: ["brandId", "id", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["brandId", "createdAt", "updatedAt", "userId"],
      },
    });

    brands = JSON.parse(JSON.stringify(brands));

    brands = brands.map((item) => {
      return {
        ...item,
        image: process.env.FILE_PATH + item.image,
      };
    });
    res.send({
      status: "success",
      data: brands,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getBrand = async (req, res) => {
  try {
    const { id } = req.params;
    let brand = await Brands.findOne({
      where: { id },
      include: {
        model: Links,
        as: "link",
        attributes: {
          exclude: ["id", "brandId", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["brandId", "createdAt", "updatedAt", "userId"],
      },
    });

    brand = JSON.parse(JSON.stringify(brand));

    brand = {
      ...brand,
      image: process.env.FILE_PATH + brand.image,
    };

    res.send({
      status: "success",
      data: {
        brand,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    let brandData = await Brands.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["id", "brandId", "createdAt", "updatedAt"],
      },
    });

    await Brands.update(
      {
        viewCount: brandData.viewCount + 1,
      },
      { where: { id } }
    );

    let brand = await Brands.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["id", "brandId", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: `Update brand with id ${id} finished`,
      data: {
        viewCount: brand.viewCount,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await Brands.destroy({
      where: { id },
    });

    res.send({
      status: "success",
      data: { id: `${id}` },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};
