const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("1 stock", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "GOOG" })
      .end((err, res) => {
        assert.equal(res.body["stockData"]["stock"], "GOOG");
        assert.isNotNull(res.body["stockData"]["price"]);
        assert.isNotNull(res.body["stockData"]["likes"]);
        done();
      });
  });

  // 'AAPL' stock must be deleted from MongoDB before test is run in order for these to pass
  test("1 stock with like", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "aapl", like: true })
      .end((err, res) => {
        assert.equal(res.body["stockData"]["stock"], "aapl");
        assert.equal(res.body["stockData"]["likes"], 1);
        done();
      });
  });

  test("Ensure likes are not counted twice", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: "aapl", like: true })
      .end((err, res) => {
        assert.equal(res.text, "Error: Only 1 Like per IP Allowed");
        done();
      });
  });

  test("2 stocks", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["aapl", "amzn"] })
      .end((err, res) => {
        let stockData = res.body["stockData"];
        assert.isArray(stockData);
        /* Stocks can come in either order */
        if (stockData[0]["stock"] === "aapl") {
          assert.equal(stockData[0]["stock"], "aapl");
          assert.equal(stockData[0]["likes"], 1);
          assert.equal(stockData[0]["rel_likes"], 1);
          assert.equal(stockData[1]["stock"], "amzn");
          assert.equal(stockData[1]["likes"], 0);
          assert.equal(stockData[1]["rel_likes"], -1);
        } else {
          assert.equal(stockData[1]["stock"], "aapl");
          assert.equal(stockData[1]["likes"], 1);
          assert.equal(stockData[1]["rel_likes"], 1);
          assert.equal(stockData[0]["stock"], "amzn");
          assert.equal(stockData[0]["likes"], 0);
          assert.equal(stockData[0]["rel_likes"], -1);
        }
        done();
      });
  });

  test("2 stocks with like", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({ stock: ["spot", "amzn"], like: true })
      .end((err, res) => {
        let stockData = res.body.stockData;
        if (stockData[0]["stock"] === "spot") {
          assert.equal(stockData[0]["stock"], "spot");
          assert.equal(stockData[0]["likes"], 1);
          assert.equal(stockData[0]["rel_likes"], 0);
          assert.equal(stockData[1]["stock"], "amzn");
          assert.equal(stockData[1]["likes"], 1);
          assert.equal(stockData[1]["rel_likes"], 0);
        } else {
          assert.equal(stockData[1]["stock"], "spot");
          assert.equal(stockData[1]["likes"], 1);
          assert.equal(stockData[1]["rel_likes"], 0);
          assert.equal(stockData[0]["stock"], "amzn");
          assert.equal(stockData[0]["likes"], 1);
          assert.equal(stockData[0]["rel_likes"], 0);
        }
        done();
      });
  });
});
