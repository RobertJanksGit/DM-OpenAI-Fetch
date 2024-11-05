const express = require("express");
const { logger } = require("./middleware/middleware");
const router = require("./router/router");
const cors = require("cors");

const server = express();

server.use(
  cors({
    origin: "https://dungeon-master-pro.firebaseapp.com",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ limit: "10mb", extended: true }));

server.use(logger);
server.use("/api", router);

module.exports = server;
