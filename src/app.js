const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

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

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "../public")));

// Routers
app.use("/api/v1/user", require("./routes/user.route"));
app.use("/api/v1/forgot-password", require("./routes/forgot.password.route"));

app.use("/api/v1/locked-folder", require("./routes/locked.folder.route"));

app.use("/api/v1/folder", require("./routes/folder.route"));
app.use("/api/v1/file", require("./routes/file.route"));
app.use("/api/v1/favorites", require("./routes/favorites.route"));

app.use("/api/v1/settings", require("./routes/settings.route"));

app.get("/", (req, res) => {
  res.status(200).send("Storage Management System is working");
});

// wrong route handler
app.use("/", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

module.exports = app;
