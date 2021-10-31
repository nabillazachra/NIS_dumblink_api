const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { uploadFiles } = require("../middlewares/uploadFiles");

const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.post("/user", addUser);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

const { register, login, checkAuth } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

const {
  addBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brands");

//init route controller brands
router.post("/brand", auth, uploadFiles("image"), addBrand);
router.get("/brands", auth, getBrands);
router.get("/brand/:id", auth, getBrand);
router.patch("/brand/:id", auth, uploadFiles("image"), updateBrand);
router.delete("/brand/:id", auth, deleteBrand);

const {
  addLink,
  getLinks,
  getLink,
  updateLink,
  deleteLink,
} = require("../controllers/links");

//init route controller links
router.post("/link", auth, uploadFiles("logo"), addLink);
router.get("/links", auth, getLinks);
router.get("/link/:id", auth, getLink);
router.patch("/link/:id", auth, uploadFiles("logo"), updateLink);
router.delete("/link/:id", auth, deleteLink);

module.exports = router;
