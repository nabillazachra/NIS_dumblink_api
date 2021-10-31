const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const router = require("./src/routes");

const port = 5000;

app.use(express.json());
app.use(cors());

app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads"));

app.listen(port, () => console.log(`Listening to port ${port}`));
