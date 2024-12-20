const express = require("express");
const { logger } = require("./middleware/middleware");
const router = require("./router/router");
const cors = require("cors");

const server = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://dungeon-master-pro.firebaseapp.com",
];

server.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ limit: "10mb", extended: true }));

server.use(logger);
server.use("/api", router);

module.exports = server;
