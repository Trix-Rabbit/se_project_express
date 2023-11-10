const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("Connected to Mongoose DB on port 27017");
  },
  (e) => console.log("DB error", e),
);

app.use((req, res, next) => {
  req.user = {
    _id: '654e72d8b3d07d8029cdbcef'
  };
  next();
});

const routes = require("./routes");

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
