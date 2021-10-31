const { Links, Brands } = require("../../models");
const Joi = require("joi");

exports.addLink = async (req, res) => {
  // const data = req.body.data;
  // console.log(req.body.data);
  try {
    const objectStringArray = new Function("return " + req.body.data)();
    console.log(objectStringArray);
    const data = JSON.parse(JSON.stringify(objectStringArray));
    await Promise.all(
      data.map(async (item) => {
        await Links.create({
          ...item,
          logo: "testGambar",
          brandId: 1,
        });
      })
    );
    let linkData = await Links.findOne({
      where: {
        BrandId: 1,
      },
      attributes: {
        exclude: ["brandId", "linkId", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        link: {
          ...linkData,
          // logo: process.env.FILE_PATH + linkData.logo,
        },
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

//Get all data Links
exports.getLinks = async (req, res) => {
  try {
    let linkData = await Links.findAll({
      include: {
        model: Brands,
        as: "brand",
        attributes: {
          exclude: ["id", "", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["linkId", "createdAt", "updatedAt", "brandId"],
      },
    });

    linkData = JSON.parse(JSON.stringify(linkData));

    linkData = linkData.map((item) => {
      return {
        ...item,
        logo: process.env.FILE_PATH + item.logo,
      };
    });
    res.send({
      status: "success",
      data: { Links: linkData },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getLink = async (req, res) => {
  try {
    const { id } = req.params;
    let link = await Links.findOne({
      where: { id },
      include: {
        model: Brands,
        as: "brand",
        attributes: {
          exclude: ["id", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["linkId", "createdAt", "updatedAt", "brandId"],
      },
    });

    link = JSON.parse(JSON.stringify(link));

    link = {
      ...link,
      logo: process.env.FILE_PATH + link.logo,
    };

    res.send({
      status: "success",
      data: {
        link,
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

exports.updateLink = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    let link = {
      ...data,
      logo: req.files.logo[0].filename,
    };

    const whereId = { where: { id } };

    await Links.update(link, whereId);

    link = {
      ...link,
      logo: process.env.FILE_PATH + link.logo,
    };

    res.send({
      status: "success",
      message: `Update link with id ${id} finished`,
      data: {
        link,
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

exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    await Links.destroy({
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
