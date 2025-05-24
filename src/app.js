const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Storage Management System is working");
});

module.exports = app;
