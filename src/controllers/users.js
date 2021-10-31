const { users } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    const user = await users.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "success",
      data: { users: user },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    let data = await users.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    const user = {
      ...data,
    };

    res.send({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.addUser = async (req, res) => {
  try {
    const data = req.body;
    await users.create({ data });
    console.log(data);

    res.send({
      status: "success",
      message: "Add user finished",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateData = {
      ...data,
    };

    await users.update(updateData, {
      where: { id },
    });

    res.send({
      status: "success",
      message: `Update user id: ${id} finished`,
      data: { user: updateData },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

//delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await users.destroy({
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
