const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");         // sprint 13

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors());  // sprint 13

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("Connected to Mongoose DB on port 27017");
  },
  (e) => console.log("DB error", e),
);

const routes = require("./routes");

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});

/*
// Code from sprint 12 using hard coded user._id value
app.use((req, res, next) => {
  req.user = {
    _id: '654e72d8b3d07d8029cdbcef'
  };
  next();
});
*/