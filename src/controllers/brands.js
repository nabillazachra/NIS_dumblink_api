const { Brands, users, Links } = require("../../models");
const Joi = require("joi");

exports.addBrand = async (req, res) => {
  const data = req.body;
  try {
    console.log(data);
    const newBrand = await Brands.create({
      ...data,
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

    // let brandData = await Brands.findOne({
    //   where: {
    //     id: newBrand.id,
    //   },
    //   attributes: {
    //     exclude: ["userId", "brandId", "createdAt", "updatedAt"],
    //   },
    // });

    res.send({
      status: "success",
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
    let brandData = await Brands.findAll({
      include: {
        model: users,
        as: "users",
        attributes: {
          exclude: ["id", "role", "createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["brandId", "createdAt", "updatedAt", "userId"],
      },
    });

    brandData = JSON.parse(JSON.stringify(brandData));

    brandData = brandData.map((item) => {
      return {
        ...item,
        image: process.env.FILE_PATH + item.image,
      };
    });
    res.send({
      status: "success",
      data: { Brands: brandData },
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
        model: users,
        as: "users",
        attributes: {
          exclude: ["id", "role", "createdAt", "updatedAt", "password"],
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

  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({
      status: "error",
      message: error.details[0].message,
    });
  }

  try {
    let brand = {
      ...data,
      image: req.files.image[0].filename,
      userId: req.users.id,
    };

    const whereId = { where: { id } };

    await Brands.update(brand, whereId);

    brand = {
      ...brand,
      image: process.env.FILE_PATH + brand.image,
    };

    res.send({
      status: "success",
      message: `Update brand with id ${id} finished`,
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
