"use strict";

const mongodb = require("mongodb");
const mongoose = require("mongoose");

module.exports = function (app) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  let stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    likes: { type: Number, default: 0 },
    ips: [String],
  });

  let Stock = mongoose.model("Stock", stockSchema);

  app.route("/api/stock-prices").get(function (req, res) {
    let responseObject = {};
    responseObject.stockData = {};

    let twoStocks = false;

    let outputResponse = () => {
      return res.json(responseObject);
    };

    let findOrUpdateStock = (stockName, documentUpdate, nextStep) => {
      Stock.findOneAndUpdate(
        { name: stockName },
        documentUpdate,
        { new: true, upsert: true },
        (err, stockDocument) => {
          if (err) {
            console.log(err);
          } else if (!err && stockDocument) {
            if (twoStocks === false) {
              return nextStep(stockDocument, processOneStock);
            }
          }
        }
      );
    };

    let likeStock = (stockName, nextStep) => {};

    let getPrice = (stockDocument, nextStep) => {
      nextStep(stockDocument, outputResponse);
    };

    let processOneStock = (stockDocument, nextStep) => {
      responseObject["stockData"]["stock"] = stockDocument["name"];
      nextStep();
    };

    let stocks = [];

    let processTwoStocks = (stockDocument, nextStep) => {};

    if (typeof req.query.stock === "string") {
      let stockName = req.query.stock;

      let documentUpdate = {};
      findOrUpdateStock(stockName, documentUpdate, getPrice);
    } else if (Array.isArray(req.query.stock)) {
      twoStocks = true;
    }
  });
};
