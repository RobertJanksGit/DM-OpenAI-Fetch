const express = require("express");
const { logger } = require("./middleware/middleware");
const router = require("./router/router");

const server = express();

server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ limit: "10mb", extended: true }));

server.use(logger);
server.use("/api", router);

module.exports = server;
