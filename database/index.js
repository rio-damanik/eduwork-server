// database/index.js
const mongoose = require("mongoose");
const config = require("../app/config");

const uri = `mongodb://${config.dbUser ? config.dbUser + ":" : ""}${config.dbPass ? config.dbPass + "@" : ""}${config.dbHost}:${config.dbPort}/${config.dbName}?authSource=admin`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.error("Connection error:", error));
db.once("open", () => {
  console.log("Database Running");
});

module.exports = db;
