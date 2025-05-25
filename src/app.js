const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares and cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

// Routers
app.use("/api/v1/user", require("./routes/user.route"));
app.use("/api/v1/forgot-password", require("./routes/forgot.password.route"));

app.get("/", (req, res) => {
  res.status(200).send("Storage Management System is working");
});

// // wrong route handler
// app.use("/", (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

module.exports = app;
