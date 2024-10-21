const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const productRoute = require("./app/product/router");
const db = require("./database/index");
const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(cors()); // Enable CORS for cross-origin requests
app.use(logger("dev")); // Use morgan logger for request logging
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // Parse cookies

// Serve static files from the "public" directory (e.g., images)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/products", productRoute); // Use productRoute for product-related APIs

// Home route to serve a welcome page
app.use("/", function (req, res) {
  res.render("index", {
    title: "Eduwork API Service", // Render the homepage with a title
  });
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err); // Log error ke console
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({
    error: {
      message: res.locals.message,
      status: res.status,
    },
  });
});

module.exports = app;
