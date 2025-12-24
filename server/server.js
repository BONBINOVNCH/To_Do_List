const express = require("express");
const path = require("path");
const corse = require("cors");
const connectDB = require("./config/db");
const tasksRouter = require("./routers/tasks.js");
require("dotenv").config();

const { swaggerUi, swaggerSpec } = require("./swagger/swagger");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(corse());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
    console.log("Сервер запущено, порт: ", port);
});
