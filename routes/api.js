"use strict";

const mongodb = require("mongodb");
const mongoose = require("mongoose");

module.exports = function (app) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    likes: { type: Number, default: 0 },
    ips: [String],
  });

  app.route("/api/stock-prices").get(function (req, res) {});
};
