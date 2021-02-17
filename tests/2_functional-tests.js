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
        console.log(res.body);
        assert.equal(res.body, "Error: Only 1 Like per IP Allowed");
        done();
      });
  });
});
