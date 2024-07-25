const express = require("express");
const db = require("./db");
const mainRouter = require("./routes/index-r");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRouter);

app.listen(3000);